import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import dotenv from 'dotenv';

import listingsRouter from './routes/listings.js';
import bookingsRouter from './routes/bookings.js';
import reviewsRouter from './routes/reviews.js';
import favoritesRouter from './routes/favorites.js';
import reportsRouter from './routes/reports.js';
import adminRouter from './routes/admin.js';
import authRouter from './routes/auth.js';
import { isSupabaseConfigured } from './config/supabase.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Middleware
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

app.use(cors({
  origin: '*', // Allow development client & production deployments
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id', 'x-user-role', 'x-user-email', 'x-user-name']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Rate Limiting for security
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // limit each IP to 300 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests from this IP, please try again after 15 minutes' }
});

app.use('/api/', apiLimiter);

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/listings', listingsRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/favorites', favoritesRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/admin', adminRouter);

// Health & System Info
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'RentEase Student Rental Platform API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    supabaseConnected: isSupabaseConfigured,
    mode: isSupabaseConfigured ? 'Live Supabase PostgreSQL' : 'Local Persistent Demo Mode'
  });
});

// Root route
app.get('/', (req, res) => {
  res.send('RentEase API Server is running. Visit /api/health for system status.');
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ error: 'Internal server error occurred', details: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 RentEase API server listening on http://localhost:${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
});

export default app;
