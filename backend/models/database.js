import Database from 'better-sqlite3';

const db = new Database('database/pong.db', { verbose: console.log });

// Create users table
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
		email TEXT NOT NULL UNIQUE,
		password TEXT NOT NULL,
		avatar_url TEXT DEFAULT NULL,
		status TEXT DEFAULT 'offline',
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`).run();

export default db;
