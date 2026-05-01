require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const userRoutes = require('./routes/userRoutes');
const couponRoutes = require('./routes/couponRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Connect to MongoDB
connectDB();

const app = express();

// Security & logging
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', app: 'KAARVAN API', timestamp: new Date().toISOString() });
});

// API Routes
const API = '/api/v1';
app.use(`${API}/auth`, authRoutes);
app.use(`${API}/products`, productRoutes);
app.use(`${API}/categories`, categoryRoutes);
app.use(`${API}/orders`, orderRoutes);
app.use(`${API}/payments`, paymentRoutes);
app.use(`${API}/users`, userRoutes);
app.use(`${API}/coupons`, couponRoutes);
app.use(`${API}/upload`, uploadRoutes);
app.use(`${API}/admin`, adminRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 KAARVAN API running on port ${PORT} [${process.env.NODE_ENV}]`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err.message);
  server.close(() => process.exit(1));
});

module.exports = app;
