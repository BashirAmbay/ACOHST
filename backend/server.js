require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const apiRoutes = require('./src/routes/apiRoutes');
const seedDatabase = require('./src/database/seed');

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure database and seed data are initialized
try {
  seedDatabase();
} catch (err) {
  console.error('Database Initialization Warning:', err.message);
}

// Global Middleware
// Allow frontend origin in production via FRONTEND_URL env variable
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? (process.env.FRONTEND_URL || '*')
    : '*',
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// Static Uploads Directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api', apiRoutes);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    institution: 'Al-Madinatu College of Health Science and Technology, Kore (ACOHST)',
    timestamp: new Date().toISOString()
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server Unhandled Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Only start the HTTP server when running locally (not on Vercel)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`\n===============================================================`);
    console.log(`🏥 ACOHST Institutional Backend API running on port ${PORT}`);
    console.log(`🌐 Base URL: http://localhost:${PORT}/api`);
    console.log(`📁 Uploads URL: http://localhost:${PORT}/uploads`);
    console.log(`===============================================================\n`);
  });
}

// Export for Vercel serverless handler
module.exports = app;
