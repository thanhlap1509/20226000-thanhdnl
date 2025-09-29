import { Kafka } from "kafkajs";

const clientId = "my-app";
const queue = "my_queue";
const port = 9092;
const groupId = "my-groupId";

const kafka = new Kafka({
  clientId: clientId,
  brokers: [`localhost:${port}`],
});

const consumer = kafka.consumer({ groupId: groupId });

const run = async () => {
  await consumer.connect();

  await consumer.subscribe({ topic: queue, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`Received message ${message.value.toString()}`);
    },
  });
};
run().catch(console.error);
