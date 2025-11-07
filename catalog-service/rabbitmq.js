import amqp from "amqplib";

const queueName = "user_events";

export const consumeUserEvents = async () => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertQueue(queueName, { durable: true });

    console.log("Esperando mensajes de la cola:", queueName);


    channel.consume(queueName, (message) => {
      if (message !== null) {
        const content = JSON.parse(message.content.toString());
        console.log("Nuevo evento recibido:", content);



        channel.ack(message); 
      }
    });
  } catch (error) {
    console.error("Error al conectarse a RabbitMQ:", error);
  }
};
