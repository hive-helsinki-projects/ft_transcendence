import Database from 'better-sqlite3';
import dotenv from 'dotenv';

dotenv.config();
const isTestEnv = process.env.NODE_ENV === 'test';

const db = isTestEnv ?
	new Database('database/testPong.db', { verbose: console.log }) :
	new Database('database/pong.db', { verbose: console.log });

console.log(`Using ${isTestEnv ? 'testPong.db' : 'pong.db'}`);

// Create users table
db.prepare(`
	CREATE TABLE IF NOT EXISTS users (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		username TEXT NOT NULL UNIQUE,
		email TEXT NOT NULL UNIQUE,
		password_hash TEXT,
		avatar_url TEXT NOT NULL DEFAULT '/uploads/placeholder-avatar1.png',
		online_status BOOLEAN DEFAULT FALSE,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	)
`).run();

const info = db.prepare(`PRAGMA table_info(users)`).all();

if (!info.find(col => col.name === 'two_fa_secret')) {
    db.prepare(`ALTER TABLE users ADD COLUMN two_fa_secret TEXT`).run();
}

if (!info.find(col => col.name === 'two_fa_enabled')) {
    db.prepare(`ALTER TABLE users ADD COLUMN two_fa_enabled BOOLEAN DEFAULT 0`).run();
}

// Enable foreign key constraints
db.prepare('PRAGMA foreign_keys = ON').run();

// Create players table
db.prepare(`
	CREATE TABLE IF NOT EXISTS players (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		user_id INTEGER,
		display_name TEXT NOT NULL UNIQUE,
		wins INTEGER DEFAULT 0,
		losses INTEGER DEFAULT 0,
		avatar_url TEXT NOT NULL DEFAULT '/uploads/placeholder-avatar1.png',
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
	)
`).run();

// Create friends table
db.prepare(`
	CREATE TABLE IF NOT EXISTS friends (
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
	CREATE TABLE IF NOT EXISTS tournaments (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		user_id INTEGER,
		name TEXT NOT NULL,
		status TEXT DEFAULT 'pending',
		current_round INTEGER DEFAULT 0,
		winner_id INTEGER,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (user_id) REFERENCES users(id)  ON DELETE CASCADE,
		FOREIGN KEY (winner_id) REFERENCES players(id) ON DELETE SET NULL
	)
`).run();

// Create match history
db.prepare(`
	CREATE TABLE IF NOT EXISTS match_history (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		user_id INTEGER,
		type TEXT NOT NULL,
		status TEXT DEFAULT 'pending',
		tournament_id INTEGER DEFAULT NULL,
		round INTEGER,
		date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
		FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE
	)
`).run();

// Create match player history
db.prepare(`
	CREATE TABLE IF NOT EXISTS match_player_history (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		match_id INTEGER NOT NULL,
		player_id INTEGER NOT NULL,
		score INTEGER DEFAULT 0 NOT NULL,
		FOREIGN KEY (match_id) REFERENCES match_history(id) ON DELETE CASCADE,
		FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
		UNIQUE (match_id, player_id)
	)
`).run();

// Create match winner history
db.prepare(`
	CREATE TABLE IF NOT EXISTS match_winner_history (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		match_id INTEGER NOT NULL,
		winner_id INTEGER NOT NULL,
		FOREIGN KEY (match_id) REFERENCES match_history(id) ON DELETE CASCADE,
		FOREIGN KEY (winner_id) REFERENCES players(id) ON DELETE CASCADE
	)
`).run();

export default db;
