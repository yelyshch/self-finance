require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const transactionRoutes = require("./routes/transactionRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Підключення до бази даних
connectDB();

// Маршрути
app.use('/api/transactions', transactionRoutes);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
