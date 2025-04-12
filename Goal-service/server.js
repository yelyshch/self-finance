require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const goalRoutes = require("./routes/goalRoutes");
const startGoalConsumer = require("./broker/goalConsumer");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Підключення до бази
connectDB();
startGoalConsumer();

// Маршрути
app.use('/api/goal', goalRoutes);

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
