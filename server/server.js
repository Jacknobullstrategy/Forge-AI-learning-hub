import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase } from './db.js';
import routes from './routes.js';
import authRoutes from './routes/auth.js';
import contentRoutes from './routes/content.js';
import profileRoutes from './routes/profile.js';
import analyticsRoutes from './routes/analytics.js';
import notificationsRoutes from './routes/notifications.js';
import forgeRoutes from './routes/forge.js';
import { initScheduler, scheduleRefresh } from './scheduler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// AI Learning Hub Routes
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/forge', forgeRoutes);

// Routes
app.use(routes);

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Initialize and start server
const startServer = async () => {
  try {
    console.log('🚀 Starting AI Dashboard Backend...');

    // Initialize database
    await initDatabase();

    // Initialize scheduler with default schedules
    await initScheduler();

    // Set up default refresh schedules if they don't exist
    await setupDefaultSchedules();

    // Start Express server
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
      console.log(`📊 Dashboard API: http://localhost:${PORT}/api/metrics`);
      console.log(`🔧 Admin Dashboard: http://localhost:3000/admin (after frontend setup)`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Setup default refresh schedules
const setupDefaultSchedules = async () => {
  const defaultSchedules = [
    { dataSource: 'mckinsey', cron: '0 0 * * 0' }, // Weekly Sunday midnight
    { dataSource: 'gartner', cron: '0 0 * * 1' }, // Weekly Monday midnight
    { dataSource: 'forrester', cron: '0 0 * * 2' }, // Weekly Tuesday midnight
    { dataSource: 'internal', cron: '0 * * * *' }, // Hourly
  ];

  for (const schedule of defaultSchedules) {
    try {
      // These will be created or updated in database
      scheduleRefresh(schedule.dataSource, schedule.cron);
    } catch (error) {
      console.error(`Error setting default schedule for ${schedule.dataSource}:`, error);
    }
  }
};

startServer();
