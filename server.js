const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

// Basic health route
app.get('/', (req, res) => {
  res.send('Restaurant POS Backend is running');
});

app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});