import amqp from "amqplib";
import config from "../config/config.js";

let channel, connection;

export async function connect() {
    connection = await amqp.connect(config.RABBITMQ_URL);
    channel = await connection.createChannel();
    console.log("Connected to RabbitMQ");
    
}

export async function publishToQueue(queueName, data) {

 await channel.assertQueue(queueName, { durable: true });
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)), { persistent: true });


}

export async function subscribeToQueue(queueName,callback) {

    await channel.assertQueue(queueName, { durable: true });
    channel.consume(queueName,  async (msg) => {
        if (msg !== null) {
            await callback( JSON.parse(msg.content.toString()));
           await channel.ack(msg);
        }
    });
}