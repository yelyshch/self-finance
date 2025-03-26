const transactionService = require("../services/transactionService");

// Додавання транзакції
exports.addTransaction = async (req, res) => {
  try {
    const { amount, type, category, description, transaction_date } = req.body;
    const newTransaction = await transactionService.addTransaction(req.user.id, {
      amount,
      type,
      category,
      description,
      transaction_date,
    });

    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(500).json({ message: "Error adding transaction", error: error.message });
  }
};

// Отримання всіх транзакцій користувача
exports.getTransactions = async (req, res) => {
  try {
    const filters = {
      type: req.query.type,
      category: req.query.category,
      amount_gte: req.query.amount_gte,
      amount_lte: req.query.amount_lte,
      sort: req.query.sort,
    };

    const transactions = await transactionService.getTransactions(req.user.id, filters);
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};




// Видалення транзакції
exports.deleteTransaction = async (req, res) => {
  try {
    await transactionService.deleteTransaction(req.params.id);
    res.json({ message: "Transaction deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting transaction" });
  }
};

module.exports = exports;
