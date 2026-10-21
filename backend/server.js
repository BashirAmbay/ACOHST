require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const apiRoutes = require('./src/routes/apiRoutes');
const seedDatabase = require('./src/database/seed');

const { securityHeaders, globalApiLimiter, inputSanitizer } = require('./src/middleware/securityMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Security: Hide server technology header
app.disable('x-powered-by');

// Ensure database and seed data are initialized
try {
  seedDatabase();
} catch (err) {
  console.error('Database Initialization Warning:', err.message);
}

// Global Security Headers (Protection against XSS, clickjacking, MIME-sniffing)
app.use(securityHeaders);

// Global Middleware
const isServerless = Boolean(
  process.env.VERCEL ||
  process.env.VERCEL_ENV ||
  process.env.AWS_LAMBDA_FUNCTION_NAME ||
  process.env.NODE_ENV === 'production'
);

// Allow frontend origins dynamically (supports production domains, Vercel deployments, and local dev)
const configuredFrontend = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.trim() : '';

const corsOptions = {
  origin: (origin, callback) => {
    // 1. Allow non-browser requests (e.g. mobile apps, server-to-server, curl)
    if (!origin) return callback(null, true);

    // 2. Allow local development (Vite, CRA, localhost, 127.0.0.1)
    if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
      return callback(null, true);
    }

    // 3. Allow Vercel preview & production deployments (*.vercel.app)
    if (/^https:\/\/[a-zA-Z0-9_-]+\.vercel\.app$/.test(origin)) {
      return callback(null, true);
    }

    // 4. Allow official institutional domain (almadinatukore.com with any subdomains)
    if (/^https?:\/\/([a-zA-Z0-9_-]+\.)*almadinatukore\.com$/.test(origin)) {
      return callback(null, true);
    }

    // 5. Match against FRONTEND_URL environment variable if explicitly configured
    if (configuredFrontend) {
      const normConfig = configuredFrontend.replace(/^https?:\/\//, '').replace(/\/$/, '');
      const normOrigin = origin.replace(/^https?:\/\//, '').replace(/\/$/, '');
      if (normOrigin === normConfig || normOrigin.endsWith('.' + normConfig)) {
        return callback(null, true);
      }
    }

    // 6. In serverless / production environments, reflect origin so legitimate client callers are not blocked
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle all preflight requests immediately
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(inputSanitizer); // Data sanitization & prototype pollution prevention
app.use(morgan('dev'));

// Static Uploads Directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
if (isServerless) {
  app.use('/uploads', express.static(path.join('/tmp', 'uploads')));
}

// Rate Limiting on API endpoints to prevent DDoS, scraping, and brute force
app.use('/api', globalApiLimiter);

// API Routes
app.use('/api', apiRoutes);

// Root Route — API info
app.get('/', (req, res) => {
  res.json({
    name: 'ACOHST Backend API',
    institution: 'Al-Madinatu College of Health Science and Technology, Kore',
    version: '1.0.0',
    status: 'online',
    docs: '/api/health',
    timestamp: new Date().toISOString()
  });
});

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
