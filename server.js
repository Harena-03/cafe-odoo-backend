const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const tableRoutes = require('./routes/tableRoutes');

// Load env variables
dotenv.config();

// Initialize app
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middlewares
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173'
];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
  })
);
app.use(express.json());

// Debug request logging
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

// Routes (API endpoints)
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/tables", tableRoutes);

app.use("/api/orders", orderRoutes);

// Health check routes
app.get('/', (req, res) => {
  res.send('Restaurant POS Backend is running');
});

app.get('/harena-test', (req, res) => {
  res.send('HARENA SERVER IS RUNNING');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});