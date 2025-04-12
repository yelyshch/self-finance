const goalService = require("../services/goalService");

// Створення нової цілі
exports.createGoal = async (req, res) => {
  try {
    const newGoal = await goalService.createGoal(req.user.id, req.body);
    res.status(201).json(newGoal);
  } catch (error) {
    res.status(500).json({ message: "Error creating goal", error: error.message });
  }
};

// Отримання всіх цілей користувача
exports.getGoals = async (req, res) => {
  try {
    const goals = await goalService.getGoals(req.user.id);
    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ message: "Error getting goals", error: error.message });
  }
};

// Оновлення цілі
exports.updateGoal = async (req, res) => {
  try {
    const updatedGoal = await goalService.updateGoal(req.params.id, req.body);
    res.status(200).json(updatedGoal);
  } catch (error) {
    res.status(500).json({ message: "Error updating goal", error: error.message });
  }
};

// Видалення цілі
exports.deleteGoal = async (req, res) => {
  try {
    await goalService.deleteGoal(req.params.id);
    res.status(200).json({ message: "Goal deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting goal", error: error.message });
  }
};

module.exports = exports;
