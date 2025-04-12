const Transaction = require("../models/Transaction");
const mongoose = require("mongoose");
const { publishTransaction } = require("../broker/transactionPublisher");

exports.addTransaction = async (userId, data) => {
  const transaction = new Transaction({ user_id: userId, ...data });
  const saved = await transaction.save();

  publishTransaction(saved);

  return saved;
};

exports.getTransactions = async (userId, filters = {}, sortBy = "transaction_date", order = "desc") => {
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
};



// Отримання однієї транзакції за ID
exports.getTransactionById = async (id) => {
  const transaction = await Transaction.findById(id);
  if (!transaction || transaction.user_id.toString() !== userId) {
    throw new Error("Access denied");
  }

  return await Transaction.findById(id);
};

// Видалення транзакції
exports.deleteTransaction = async (id) => {
  return await Transaction.findByIdAndDelete(id);
};
