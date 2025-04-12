const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    goal_name: { type: String, required: true },
    target_amount: { type: Number, required: true },
    current_amount: { type: Number, default: 0 },
    status: { type: String, enum: ["in_progress", "completed", "failed"], required: true },
    deadline: { type: Date },
    description: { type: String },
  },
  { timestamps: { createdAt: "created_at" } }
);

module.exports = mongoose.model("Goal", goalSchema);
