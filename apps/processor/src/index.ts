import { Kafka } from "kafkajs";
import { dbClient } from "./db/db.js";
const TOPIC_NAME = "zap-events";

const kafka = new Kafka({
    clientId: "outbox-processor",
    brokers: ["localhost:9092"],
})

async function main() {
   const producer = kafka.producer();
   await producer.connect();
   while(1) {
    const pendingRow = await dbClient.zapRunOutBox.findMany({
        where: {},
        take: 10,
    })
    producer.send({
        topic: TOPIC_NAME,
        messages: pendingRow.map(r => ({
            value: JSON.stringify({
                zapRunId: r.zapRunId, 
                stage: 0,

            })
        }))
    });
    await dbClient.zapRunOutBox.deleteMany({
        where: {
            id: {
                in: pendingRow.map(x => x.id)
            }
        }
    })
    await new Promise(r => setTimeout(r, 3000));
   }
}
main();