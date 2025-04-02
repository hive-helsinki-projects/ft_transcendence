import Database from 'better-sqlite3';

const db = new Database('database/pong.db', { verbose: console.log });

// Create users table
db.prepare(`
	CREATE TABLE IF NOT EXISTS users (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		username TEXT NOT NULL UNIQUE,
		email TEXT NOT NULL UNIQUE,
		password_hash TEXT NOT NULL,
		online_status BOOLEAN DEFAULT FALSE,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`).run();

// Enable foreign key constraints
db.prepare('PRAGMA foreign_keys = ON').run();

// Create players table
db.prepare(`
	CREATE TABLE IF NOT EXISTS player (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		user_id INTEGER,
		display_name TEXT NOT NULL UNIQUE,
		wins INTEGER DEFAULT 0,
		losses INTEGER DEFAULT 0,
		avatar_url TEXT DEFAULT NULL,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
	)
`).run();

// Create friends table
db.prepare(`
	CREATE TABLE IF NOT EXISTS friend (
		user_id INTEGER,
		friend_id INTEGER,
		status TEXT DEFAULT 'pending',
		PRIMARY KEY (user_id, friend_id),
		FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
		FOREIGN KEY (friend_id) REFERENCES users(id) ON DELETE CASCADE
	)
`).run();

// Create tournament table
db.prepare(`
	CREATE TABLE IF NOT EXISTS tournament (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT NOT NULL,
		status TEXT DEFAULT 'pending',
		player_count INTEGER DEFAULT 0,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	)
`)

// Create match history
db.prepare(`
	CREATE TABLE IF NOT EXISTS match_history (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		tournament_id INTEGER,
		player_one_id INTEGER,
		player_two_id INTEGER,
		round TEXT NOT NULL,
		winner_id INTEGER,
		date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (tournament_id) REFERENCES tournament(id),
		FOREIGN KEY (player_one_id) REFERENCES player(id),
		FOREIGN KEY (player_two_id) REFERENCES player(id),
		FOREIGN KEY (winner_id) REFERENCES player(id)
	)
`)

export default db;
