import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, setupMongoShutdown } from './config/db.js';

// Import routes (adjust paths when you create them)
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import codeRoutes from './routes/codeRoutes.js';
import { authLimiter, generalLimiter, llmLimiter } from './middlewares/rateLimit.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
await connectDB();
setupMongoShutdown();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || '*', // set your frontend URL in .env for security
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.send('API is running');
});

app.use(generalLimiter);

// Register API routes
app.use('/api/auth',authLimiter, authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/code',llmLimiter, codeRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
