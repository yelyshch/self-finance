const amqp = require("amqplib");
require("dotenv").config();

let channel = null;
const QUEUE = "transaction_created";

async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();
    await channel.assertQueue(QUEUE, { durable: true });

    console.log("[TRANSACTION SERVICE] Connected to RabbitMQ");
  } catch (err) {
    console.error("RabbitMQ connection error:", err.message);
  }
}

function publishTransaction(transaction) {
  if (!channel) {
    console.warn("RabbitMQ channel not established");
    return;
  }

  const message = {
    user_id: transaction.user_id,
    amount: transaction.amount,
    type: transaction.type,
  };

  channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(message)), {
    persistent: true,
  });

  console.log("Sent transaction to queue:", message);
}

module.exports = { connectRabbitMQ, publishTransaction };
