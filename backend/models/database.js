import Database from 'better-sqlite3';

const db = new Database('database/pong.db', { verbose: console.log });

// Create users table
db.prepare(`
	CREATE TABLE IF NOT EXISTS users (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		username TEXT NOT NULL UNIQUE,
		display_name TEXT NOT NULL UNIQUE,
		email TEXT NOT NULL UNIQUE,
		password_hash TEXT NOT NULL,
		avatar_url TEXT DEFAULT NULL,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`).run();

// Enable foreign key constraints
db.prepare('PRAGMA foreign_keys = ON').run();

// Create friends table
db.prepare(`
	CREATE TABLE IF NOT EXISTS user_friends (
		user_id INTEGER,
		friend_id INTEGER,
		status TEXT DEFAULT 'pending',
		PRIMARY KEY (user_id, friend_id),
		FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
		FOREIGN KEY (friend_id) REFERENCES users(id) ON DELETE CASCADE
	)
`).run();

db.prepare(`
	CREATE TABLE IF NOT EXISTS user_online_status (
		user_id INTEGER,
		online BOOLEAN DEFAULT 0,
		FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
	)
`).run();

// Stores wins and losses
db.prepare(`
	CREATE TABLE IF NOT EXISTS user_stats (
		user_id INTEGER,
		wins INTEGER DEFAULT 0,
		losses INTEGER DEFAULT 0,
		FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
	)
`).run();

// Create match history
db.prepare(`
	CREATE TABLE IF NOT EXISTS user_match_history (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		player_one_id INTEGER,
		player_two_id INTEGER,
		winner_id INTEGER,
		date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (player_one_id) REFERENCES users(id),
		FOREIGN KEY (player_two_id) REFERENCES users(id),
		FOREIGN KEY (winner_id) REFERENCES users(id)
	)
`)

export default db;
