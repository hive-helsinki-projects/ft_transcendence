import Database from 'better-sqlite3';

export function resetTestDb() {
	const db = new Database('database/testPong.db');
	db.pragma('foreign_keys = OFF'); // Disable temporarily for truncation

	const tables = [
		'users',
		'players',
		'friends',
		'tournaments',
		'match_history',
		'match_player_history',
		'match_winner_history',
	];

	for (const table of tables) {
		db.prepare(`DELETE FROM ${table}`).run();
		db.prepare(`DELETE FROM sqlite_sequence WHERE name='${table}'`).run(); // Reset AUTOINCREMENT
	}

	db.pragma('foreign_keys = ON');
	db.close();

	console.log('🧹 testPong.db wiped clean for next test');
}