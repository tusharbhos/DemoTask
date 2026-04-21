require('dotenv').config();
const express = require('express');
const helmet  = require('helmet');
const cors    = require('cors');
const rateLimit = require('express-rate-limit');

const authRoutes  = require('./routes/auth.routes');
const stateRoutes = require('./routes/state.routes');
const cityRoutes  = require('./routes/city.routes');

const app  = express();
const PORT = process.env.PORT || 5000;

// Security headers
app.use(helmet());

// CORS - allow React dev server and configured frontend URL
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: Origin ${origin} not allowed`));
  },
  credentials: true,
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiter on login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15,
  message: { success: false, message: 'Too many login attempts. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Routes
app.use('/api/auth',   loginLimiter, authRoutes);
app.use('/api/states', stateRoutes);
app.use('/api/cities', cityRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Admin Panel API is running', timestamp: new Date() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
