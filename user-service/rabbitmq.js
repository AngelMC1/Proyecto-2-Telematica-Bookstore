import amqp from "amqplib";

let channel;
const queueName = "user_events";

export const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect("amqp://rabbitmq");
    channel = await connection.createChannel();
    await channel.assertQueue(queueName, { durable: true });
    console.log("Connected to RabbitMQ and queue created:", queueName);
  } catch (error) {
    console.error("Error connecting to RabbitMQ:", error);
  }
};

export const publishUserEvent = async (eventType, data) => {
  try {
    if (!channel) {
      console.warn("Channel not ready, cannot publish event.");
      return;
    }

    const message = {
      eventType,
      timestamp: new Date(),
      data,
    };

    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
    console.log(`Event sent: ${eventType}`);
  } catch (error) {
    console.error("Error publishing message:", error);
  }
};
