import { Kafka } from "kafkajs";
import { dbClient } from "./db/db";

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
   }
}
main();