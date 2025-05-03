require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const transactionRoutes = require("./routes/transactionRoutes");
const { connectRabbitMQ } = require("./broker/transactionPublisher");


const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173/',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Підключення до бази даних
connectDB();
connectRabbitMQ();

// Маршрути
app.use('/api/transactions', transactionRoutes);

const PORT = process.env.PORT || 5002;

module.exports = app;
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
