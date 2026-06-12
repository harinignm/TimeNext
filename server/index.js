require('dotenv').config({ override: true });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// 🛑 GLOBAL CONFIG: Must be before routes/models
mongoose.set('bufferCommands', false);
mongoose.set('bufferTimeoutMS', 5000);

const authRoutes = require('./routes/auth');
const capsuleRoutes = require('./routes/capsule');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));

// Database Connection with Caching for Serverless Functions
let cachedConnection = null;

const connectDB = async () => {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  console.log('Attempting to connect to MongoDB Atlas...');
  
  if (!process.env.MONGODB_URI) {
    console.error('❌ ERROR: MONGODB_URI is missing from environment variables!');
    throw new Error('MONGODB_URI is not defined');
  }

  try {
    cachedConnection = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 8000, // 8 seconds timeout
    });
    
    console.log('✅ Connected to MongoDB Atlas');
    return cachedConnection;
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    throw err;
  }
};

// Middleware to ensure DB is connected before handling requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ 
      error: 'Database connection failed', 
      details: err.message,
      troubleshooting: 'Ensure MONGODB_URI is set in Vercel Environment Variables and IP 0.0.0.0/0 is whitelisted in Atlas.'
    });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/capsule', capsuleRoutes);

app.get('/', (req, res) => {
  res.send('TimeNext API is running...');
});

// Start Server (only for local development)
if (!process.env.VERCEL) {
  const startLocal = async () => {
    try {
      await connectDB();
      app.listen(PORT, () => {
        console.log(`🚀 Local server running on port ${PORT}`);
      });
    } catch (err) {
      console.error('Failed to start local server:', err.message);
      process.exit(1);
    }
  };
  startLocal();
}

module.exports = app;
