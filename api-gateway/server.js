const express = require('express');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');

// Завантажуємо змінні середовища з .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware для парсингу JSON
app.use(express.json());

// Використовуємо маршрути для користувачів
app.use('/api/users', userRoutes);

// Запуск сервера
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
