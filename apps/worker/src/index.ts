import { Kafka } from "kafkajs";
import { dbClient } from "./db/db.js";
import { Parse } from "./parser.js";
import { JsonObject } from "@repo/db";
import { sendEmail } from "./email/sendEmail.js";
import { sendSol } from "./solana.js";
import { saveToNotion } from "./notion/SaveToNotion.js";
import { fetchEmailWithTag } from "./email/getTaggedEmails.js";

const TOPIC_NAME = "zap-events";

const kafka = new Kafka({
    clientId: "outbox-processor",
    brokers: ["localhost:9092"],
})

// Add type definition
interface NotionMetadata {
    tag?: string;
    databaseId?: string;
    title?: string;
    properties?: string;
}

async function main() {
     const consumer = kafka.consumer({
        groupId: "main-worker",
     });
     await consumer.connect();
     const producer = kafka.producer();
     await producer.connect();

     await consumer.subscribe({
        topic: TOPIC_NAME, fromBeginning: true,
     });
     await consumer.run({
        eachMessage: async ({topic, partition, message}) => {
            console.log({
               partition,
               offset: message.offset,
                 value: message.value?.toString()
            });  
            if (!message.value?.toString()) {
                return;
            }
            const parsedValue = JSON.parse(message.value?.toString());
            const zapRunId = parsedValue.zapRunId;
            const stage = parsedValue.stage;
            const zapRunDetails = await dbClient.zapRun.findFirst({
                where: {
                    id: zapRunId,
                },
                include: {
                    zap: {
                        include: {
                            actions: {
                                include: {
                                    type: true,
                                }
                            }
                        }
                    }
                }
            });
            const currentAction = zapRunDetails?.zap.actions.find(x => x.sortringOrder === stage);
            if(!currentAction) {
                console.log("Current action not founded");
                return;
            }
            console.log(currentAction);
            const zapRunMetaData = zapRunDetails?.metadata;
            if(currentAction?.type.id === 'email') {
                const body = Parse((currentAction.metadata as JsonObject)?.body as string, zapRunMetaData);
                const to = Parse((currentAction.metadata as JsonObject)?.body as string, zapRunMetaData);
                console.log(`Sending Out email to ${to} body is ${body}`);
                await sendEmail(to, body);
            }
            if(currentAction?.type.id === "send-sol") {
                const amount = Parse((currentAction.metadata as JsonObject)?.body as string, zapRunMetaData)
                const address = Parse((currentAction.metadata as JsonObject)?.body as string, zapRunMetaData);
                console.log(`Sending out sol of ${amount} to address ${address}`);
                await sendSol(address, amount, zapRunId);
            }
            if(currentAction?.type.id === "notion") {
                try {
                    // Get metadata from zapRunDetails with type assertion
                    const runMetadata = zapRunDetails?.metadata as NotionMetadata || {};
                    console.log("ZapRun metadata:", runMetadata);
                    
                    // Type-safe property access
                    const databaseId = runMetadata?.databaseId;
                    const tag = runMetadata?.tag;

                    if (!databaseId) {
                        console.error("Missing Notion database ID in metadata");
                        return;
                    }

                    if (!tag) {
                        console.error("Missing email tag in metadata");
                        return;
                    }

                    console.log(`Fetching emails with tag: ${tag}`);
                    const emails = await fetchEmailWithTag(tag);
                    
                    if (!emails || emails.length === 0) {
                        console.log("No matching emails found");
                        return;
                    }

                    console.log(`Found ${emails.length} emails, saving to Notion database ${databaseId}`);
                    await saveToNotion(databaseId, emails);
                    
                    // Send next stage message
                    const lastState = (zapRunDetails?.zap.actions?.length || 1) - 1;
                    if (lastState !== stage) {
                        await producer.send({
                            topic: TOPIC_NAME,
                            messages: [{
                                value: JSON.stringify({
                                    stage: stage + 1,
                                    zapRunId,
                                })
                            }]
                        });
                    }

                    console.log("Processing done");
                    await consumer.commitOffsets([{
                        topic: TOPIC_NAME,
                        partition,
                        offset: (parseInt(message.offset) + 1).toString(),
                    }]);
                } catch (error) {
                    console.error("Error processing notion action:", error);
                }
            }
            await new Promise(r => setTimeout(r, 500));
            const zapId = message.value.toString();
            const lastState = (zapRunDetails?.zap.actions?.length || 1) -1;
            if(lastState !== stage) {
                await producer.send({
                    topic: TOPIC_NAME,
                    messages: [{
                        value: JSON.stringify({
                            stage: stage + 1,
                            zapRunId,
                        })
                    }]
                })
            }
            console.log("Prosseing done");
            await consumer.commitOffsets([{
                topic: TOPIC_NAME,
                partition: partition,
                offset: (parseInt(message.offset) + 1).toString(),
            }]);
        },
     })
}
main();