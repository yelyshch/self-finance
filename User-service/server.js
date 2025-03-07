require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const userRoutes = require("./routes/UserRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Підключення до бази
connectDB();

// Маршрути
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
