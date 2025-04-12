const express = require('express');
const router = express.Router();
const goalController = require('../controllers/goalController');

// Створення цілі
router.post('/new', goalController.createGoal);

//Отримання цілей
router.get('/get', goalController.getGoals);

//Редагування цілі
router.put('/:id', goalController.updateGoal);

//Видалення цілі
router.delete('/:id', goalController.deleteGoal);

module.exports = router;
