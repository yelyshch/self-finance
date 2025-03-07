const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
//const { authenticate } = require('../middleware/authenticate'); // Middleware для аутентифікації

// Реєстрація користувача
router.post('/register', userController.registerUser);

// Логін користувача
router.post('/login', userController.loginUser);

// Отримання поточного користувача
router.get('/me', userController.getCurrentUser);

// Оновлення інформації про користувача
router.put('/update',  userController.updateUser);

// Видалення користувача
router.delete('/delete', userController.deleteUser);

// Отримання всіх користувачів
router.get('/', userController.getAllUsers);

module.exports = router;
