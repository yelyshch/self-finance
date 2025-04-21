// transactionService.js
const Transaction = require("../models/Transaction");
const mongoose = require("mongoose");
const { publishTransaction } = require("../broker/transactionPublisher");

exports.addTransaction = async (user_id, transactionData) => {
  try {
    const transaction = new Transaction({ user_id, ...transactionData });
    const savedTransaction = await transaction.save();
    try {
      publishTransaction(savedTransaction);
    } catch (error) {
      console.error('Failed to publish transaction:', error.message);
    }
    return savedTransaction;
  } catch (error) {
    console.error('Error saving transaction:', error.message);
    throw error;
  }
};


exports.getTransactions = async (userId, filters = {}, sortBy = "transaction_date", order = "desc") => {
  try {
    const query = { user_id: userId };
    console.log("Received filters:", filters);

    // Фільтр за типом транзакції
    if (filters.type) query.type = filters.type;

    // Фільтр за категорією
    if (filters.category) query.category = filters.category;

    // Фільтр за сумою (>=, <=), перевіряємо наявність та перетворюємо у число
    if (filters.amount_gte !== undefined) {
      query.amount = { ...query.amount, $gte: Number(filters.amount_gte) };
    }
    if (filters.amount_lte !== undefined) {
      query.amount = { ...query.amount, $lte: Number(filters.amount_lte) };
    }

    // Обробка параметра сортування (amount_desc -> { amount: -1 })
    let sort = {};
    if (filters.sort) {
      const [field, direction] = filters.sort.split("_");
      sort[field] = direction === "desc" ? -1 : 1;
    } else {
      sort = { [sortBy]: order === "desc" ? -1 : 1 };
    }

    console.log("Final Query:", JSON.stringify(query, null, 2));
    console.log("Sorting:", sort);

    return await Transaction.find(query).sort(sort);
  } catch (error) {
    console.error("Error fetching transactions:", error.message);
    return [];
  }
};

// Отримання однієї транзакції за ID
exports.getTransactionById = async (id, userId) => {
  try {
    const transaction = await Transaction.findById(id);
    if (!transaction || transaction.user_id.toString() !== userId) {
      throw new Error("Access denied");
    }
    return transaction;
  } catch (error) {
    console.error("Error fetching transaction:", error.message);
    throw error;
  }
};

// Видалення транзакції
exports.deleteTransaction = async (id) => {
  try {
    return await Transaction.findByIdAndDelete(id);
  } catch (error) {
    console.error("Error deleting transaction:", error.message);
    throw error;
  }
};
