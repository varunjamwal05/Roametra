import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';

import authRoutes from './routes/auth.routes.js';
import tripsRoutes from './routes/trips.routes.js';
import expensesRoutes from './routes/expenses.routes.js';
import votesRoutes from './routes/votes.routes.js';
import itineraryRoutes from './routes/itinerary.routes.js';
import packingRoutes from './routes/packing.routes.js';
import errorHandler from './middleware/errorHandler.js';

connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripsRoutes);
app.use('/api/trips/:id/expenses', expensesRoutes);
app.use('/api/trips/:id/votes', votesRoutes);
app.use('/api/trips/:id/itinerary', itineraryRoutes);
app.use('/api/trips/:id/packing', packingRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Roametra backend running on port ${PORT}`);
});
