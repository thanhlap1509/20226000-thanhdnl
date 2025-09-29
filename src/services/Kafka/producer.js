import { Kafka } from "kafkajs";

const clientId = "my-app";
const queue = "my_queue";
const brokers = ["localhost:9092"];

const kafka = new Kafka({
  clientId: clientId,
  brokers: brokers,
});

const producer = kafka.producer();

const run = async (msg) => {
  await producer.connect();
  await producer.send({
    topic: queue,
    messages: [{ value: msg }],
  });
  console.log(`Sending message ${msg}`);

  await producer.disconnect();
};

run("hello").catch(console.error);
run("world").catch(console.error);
