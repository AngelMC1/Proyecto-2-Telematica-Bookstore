import amqp from "amqplib";

let channel;
const queueName = "notification_queue";

export const sendNotification = async (notification) => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName, { durable: true });
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(notification)));
    console.log("Notificación enviada:", notification);
  } catch (err) {
    console.error("Error enviando notificación:", err);
  }
};

export async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();
    await channel.assertQueue("notification_events");
    console.log("Connected to RabbitMQ (notification_events queue)");

    channel.consume("notification_events", (msg) => {
      if (msg !== null) {
        const event = JSON.parse(msg.content.toString());
        console.log("Notification Service received event:", event);

        // Aquí podrías simular enviar un correo o notificación push
        console.log(`Sending notification for event type: ${event.type}`);

        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error("Error connecting to RabbitMQ:", error);
  }
}

export function publishNotification(event) {
  if (!channel) {
    console.error("RabbitMQ channel not ready");
    return;
  }
  channel.sendToQueue("notification_events", Buffer.from(JSON.stringify(event)));
}