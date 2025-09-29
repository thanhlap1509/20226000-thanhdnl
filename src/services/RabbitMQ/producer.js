import amqp from "amqplib";

const queue = "my_queue";

const send = async (msg) => {
  // Do AMQP 0-9-1 sử dụng giao thức TCP,
  // ta cần thiết lập kết nối đến RabbitMQ trước khi bắt đầu gửi tin nhắn
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  await channel.assertQueue(queue, { durable: false });

  channel.sendToQueue(queue, Buffer.from(msg));
  console.log(`Sending message ${msg}`);

  await channel.close();
  await connection.close();
};

send("hello").catch(console.error);
send("world").catch(console.error);
