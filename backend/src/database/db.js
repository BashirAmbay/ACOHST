const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// In production (Vercel), only /tmp is writable at runtime
const dbPath = process.env.NODE_ENV === 'production'
  ? '/tmp/acohst.db'
  : (process.env.DATABASE_PATH || path.join(__dirname, 'acohst.db'));

const dbDir = path.dirname(dbPath);

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath, { verbose: process.env.NODE_ENV === 'development' ? null : null });
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

module.exports = db;
