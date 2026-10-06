const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const { initDatabase, sequelize } = require('./models');
const authRoutes = require('./routes/authRoutes');
const predictRoutes = require('./routes/predictRoutes');
const historyRoutes = require('./routes/historyRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const PYTHON_HEALTH_URL = process.env.PYTHON_HEALTH_URL || 'http://127.0.0.1:8000/health';

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// -------------------------------------------------------------
// Health Check Endpoint
// -------------------------------------------------------------
app.get('/api/health', async (req, res) => {
  let pythonStatus = 'offline';
  let pythonInfo = null;

  try {
    const pyRes = await axios.get(PYTHON_HEALTH_URL, { timeout: 2000 });
    pythonStatus = pyRes.data?.status || 'online';
    pythonInfo = pyRes.data;
  } catch {
    pythonStatus = 'offline';
  }

  let dbStatus = 'disconnected';
  try {
    await sequelize.authenticate();
    dbStatus = 'connected';
  } catch {
    dbStatus = 'disconnected';
  }

  return res.json({
    status: 'online',
    service: 'Express Auth & Gateway Backend',
    database: dbStatus,
    python_service: pythonStatus,
    python_info: pythonInfo,
    timestamp: new Date().toISOString(),
  });
});

// -------------------------------------------------------------
// API Routes
// -------------------------------------------------------------
app.use('/api/auth', authRoutes);
app.use('/api/predict', predictRoutes);
app.use('/api/history', historyRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Maternal Risk Prediction Express API Gateway is running.',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth/register, /api/auth/login, /api/auth/me',
      predict: '/api/predict',
      history: '/api/history',
    },
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Endpoint not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[UNHANDLED ERROR]', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
  });
});

// Start Server
async function startServer() {
  await initDatabase();
  app.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(`[EXPRESS BACKEND] Running on http://localhost:${PORT}`);
    console.log(`[EXPRESS BACKEND] Auth API ready: /api/auth/*`);
    console.log(`[EXPRESS BACKEND] ML Gateway ready: /api/predict`);
    console.log(`=================================================`);
  });
}

startServer();
