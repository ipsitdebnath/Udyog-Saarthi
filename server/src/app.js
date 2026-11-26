const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const jobRoutes = require('./routes/jobRoutes');
const aiRoutes = require('./routes/aiRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const reminderRoutes = require('./routes/reminderRoutes');
const errorHandler = require('./middleware/errorHandler');
const { isConfigured, supabase } = require('./config/database');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(`[API ${req.method}] ${req.url}`);
  }
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Udyog Saarthi REST API',
    tagline: 'Every Ability Deserves an Opportunity',
    timestamp: new Date().toISOString(),
    database: isConfigured ? 'supabase_cloud' : 'local_dev_store',
    version: '1.0.0',
    day: 'Day 1: Project Foundation and Candidate Experience',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/reminders', reminderRoutes);

// 404 Route handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Central Error Handler
app.use(errorHandler);

module.exports = app;
