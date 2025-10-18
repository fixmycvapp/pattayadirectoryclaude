const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const reminderScheduler = require('./services/reminderScheduler');
const { scheduleLiveEventsSync } = require('./cron/syncLiveEvents');

// Services
const emailService = require('./services/emailService');
const reminderScheduler = require('./services/reminderScheduler');
const { cleanOldJobs } = require('./services/emailQueue');
const { scheduleNewsFetcher } = require('./cron/fetchNews'); //

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/events', require('./routes/events'));
app.use('/api/admin/live-events', require('./routes/admin/liveEvents'));
app.use('/api/locations', require('./routes/locations'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/accommodation', require('./routes/accommodation'));
app.use('/api/venues', require('./routes/venues'));
app.use('/api/news', require('./routes/news'));
app.use('/api/users', require('./routes/users'));
app.use('/api/reminders', require('./routes/reminders')); 
app.use('/api/admin/email', require('./routes/admin/email'));
app.use('/api/admin/news', require('./routes/admin/news'));
app.use('/api/ads', require('./routes/ads'));

connectDB().then(() => {
  reminderScheduler.initializeScheduler();
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Pattaya Directory API is running',
    timestamp: new Date().toISOString()
    email: process.env.SMTP_USER ? 'configured' : 'not configured',
    news_fetcher: 'active',
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Route not found' 
  });
});

// Start server
const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
  console.log('✅ Database connected');

   if (process.env.EVENTBRITE_API_KEY || process.env.FACEBOOK_ACCESS_TOKEN) {
    scheduleLiveEventsSync();
  } else {
    console.log('⚠️  Live events sync not configured (missing API keys)');
  }
  
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});

  const emailTest = await emailService.testConnection();
  if (emailTest.success) {
    console.log('✅ Email service ready');
  } else {
    console.warn('⚠️  Email service not configured');
  }
  
  // Initialize reminder scheduler
  await reminderScheduler.initializeScheduler();

    // Initialize news fetcher cron job ⬅️ ADD THIS
  scheduleNewsFetcher();
  
  // Clean old jobs daily at midnight
  const schedule = require('node-schedule');
  schedule.scheduleJob('0 0 * * *', cleanOldJobs);
  
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('❌ Database connection failed:', err);
  process.exit(1);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 API URL: http://localhost:${PORT}/api`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;