const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Detect Vercel / Serverless / Production environment
const isServerless = Boolean(
  process.env.VERCEL ||
  process.env.VERCEL_ENV ||
  process.env.AWS_LAMBDA_FUNCTION_NAME ||
  process.env.NODE_ENV === 'production'
);

// In production (Vercel), only /tmp is writable at runtime
const dbPath = isServerless
  ? path.join('/tmp', 'acohst.db')
  : (process.env.DATABASE_PATH
      ? path.resolve(process.env.DATABASE_PATH)
      : path.join(__dirname, 'acohst.db'));

const dbDir = path.dirname(dbPath);

try {
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
} catch (err) {
  console.warn('Database directory initialization notice:', err.message);
}

const db = new Database(dbPath, { verbose: process.env.NODE_ENV === 'development' ? null : null });
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

module.exports = db;
