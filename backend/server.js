import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Console Log Interceptor for Serverless Debugging
const logBuffer = [];
const originalLog = console.log;
const originalError = console.error;
const originalWarn = console.warn;

console.log = (...args) => {
  logBuffer.push({ type: 'log', message: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '), time: new Date().toISOString() });
  if (logBuffer.length > 200) logBuffer.shift();
  originalLog.apply(console, args);
};

console.error = (...args) => {
  logBuffer.push({ type: 'error', message: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '), time: new Date().toISOString() });
  if (logBuffer.length > 200) logBuffer.shift();
  originalError.apply(console, args);
};

console.warn = (...args) => {
  logBuffer.push({ type: 'warn', message: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '), time: new Date().toISOString() });
  if (logBuffer.length > 200) logBuffer.shift();
  originalWarn.apply(console, args);
};

// Import Routes
import authRoutes from './routes/authRoutes.js';
import workoutRoutes from './routes/workoutRoutes.js';
import mealRoutes from './routes/mealRoutes.js';
import progressRoutes from './routes/progressRoutes.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Connect to database
if (!process.env.MONGO_URI && process.env.NODE_ENV === 'production') {
  console.warn('WARNING: MONGO_URI is not defined in production environment!');
}
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Simple logger middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/progress', progressRoutes);

// Health check endpoint
app.get('/api/_wake', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Debug logs endpoint
app.get('/api/debug-logs', (req, res) => {
  res.status(200).json(logBuffer);
});

// Catch-all for API routes to debug 404s
app.use('/api', (req, res) => {
  console.log(`404 at ${req.originalUrl}`);
  res.status(404).json({ message: `API route not found: ${req.originalUrl}` });
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
