const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

// 1. Helmet Security Headers Configuration
const securityHeaders = helmet({
  contentSecurityPolicy: false, // Let frontend assets load freely across Vite/localhost/production
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' } // Allows images & static uploads to be safely rendered
});

// 2. Global API Rate Limiter (Protects against volumetric DDoS and scraping)
const globalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Limit each IP to 500 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP address, please try again in 15 minutes.'
  }
});

// 3. Stricter Auth Rate Limiter (Blocks Brute-force Password Attacks and Credential Stuffing)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Max 20 login/register attempts per 15 minutes per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login attempts detected from this IP. Account temporarily protected. Please try again after 15 minutes.'
  }
});

// 4. Contact & Inquiry Spam Limiter (Stops Bot Spam)
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Max 10 messages per 15 minutes per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many inquiries sent. Please wait 15 minutes before sending another message.'
  }
});

// 5. Input Sanitizer & Prototype Pollution Guard
function sanitizeData(obj) {
  if (!obj || typeof obj !== 'object') return obj;

  for (const key of Object.keys(obj)) {
    // Prevent Prototype Pollution
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      delete obj[key];
      continue;
    }

    if (typeof obj[key] === 'string') {
      // Remove dangerous script tags and null bytes
      obj[key] = obj[key]
        .replace(/\0/g, '')
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      sanitizeData(obj[key]);
    }
  }
  return obj;
}

function inputSanitizer(req, res, next) {
  if (req.body) sanitizeData(req.body);
  if (req.query) sanitizeData(req.query);
  if (req.params) sanitizeData(req.params);
  next();
}

module.exports = {
  securityHeaders,
  globalApiLimiter,
  authLimiter,
  contactLimiter,
  inputSanitizer
};
