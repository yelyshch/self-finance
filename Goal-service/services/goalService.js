const Goal = require("../models/Goal");

// Створити нову ціль
exports.createGoal = async (userId, goalData) => {
  const goal = new Goal({ user_id: userId, ...goalData });
  return await goal.save();
};

// Отримати всі цілі користувача
exports.getGoals = async (userId) => {
  return await Goal.find({ user_id: userId });
};

// Оновити ціль
exports.updateGoal = async (id, updateData) => {
  return await Goal.findByIdAndUpdate(id, updateData, { new: true });
};

// Видалити ціль
exports.deleteGoal = async (id) => {
  return await Goal.findByIdAndDelete(id);
};
