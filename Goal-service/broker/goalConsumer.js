const amqp = require("amqplib");
const Goal = require("../models/Goal");
require("dotenv").config();

const QUEUE = "transaction_created";

async function startGoalConsumer() {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertQueue(QUEUE, { durable: true });

    console.log(`[GOAL SERVICE] Listening on queue: ${QUEUE}`);

    channel.consume(
      QUEUE,
      async (msg) => {
        if (msg !== null) {
          const data = JSON.parse(msg.content.toString());
          console.log("Received message:", data);

          const { user_id, amount, type } = data;

          try {
            const goal = await Goal.findOne({
              user_id,
              status: "in_progress",
            }).sort({ created_at: 1 });

            if (goal) {
              if (goal.deadline && new Date() > new Date(goal.deadline)) {
                goal.status = "failed";

                await goal.save();
                console.log(`Goal "${goal.goal_name}" for user ${user_id} marked as failed due to deadline.`);
                return;
              }

              if (type === "income") {
                goal.current_amount += amount;
                if (goal.current_amount >= goal.target_amount) {
                  goal.status = "completed";
                }

                await goal.save();
                console.log(`Goal "${goal.goal_name}" updated for user ${user_id}`);
              }

              if (type === "expense") {
                goal.current_amount -= amount;

                if (goal.current_amount <= 0) {
                  goal.status = "failed";
                  goal.current_amount = 0;
                }

                await goal.save();
                console.log(`Goal "${goal.goal_name}" updated for user ${user_id} with expense.`);
              }
            } else {
              console.log(`No active goal found for user ${user_id}`);
            }

            channel.ack(msg);

          } catch (error) {
            console.error("Error processing message:", error.message);

            channel.nack(msg, false, true);
          }
        }
      },
      { noAck: false }
    );
  } catch (err) {
    console.error("Error in goal consumer:", err.message);
  }
}

module.exports = startGoalConsumer;
