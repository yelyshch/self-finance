const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    amount: { type: Number, required: true },
    type: { type: String, enum: ["income", "expense"], required: true },
    category: { type: String, required: true },
    description: { type: String },
    transaction_date: { type: Date, required: true },
  },
  { timestamps: { createdAt: "created_at" } }
);

module.exports = mongoose.model("Transaction", transactionSchema);
