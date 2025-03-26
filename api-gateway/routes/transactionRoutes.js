const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// Створення транзакції
router.post('/new', transactionController.addTransaction);

// Отримання транзакцій
router.get('/get', transactionController.getTransactions);

// Видалення транзакції
router.delete('/:id', transactionController.deleteTransaction);

module.exports = router;
