import Database from 'better-sqlite3';

const db = new Database('pong.db', { verbose: console.log });

// Create users table if not exists
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL
  )
`).run();

export default db;
