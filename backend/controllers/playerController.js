import db from '../models/database.js';

const getPlayers = async (req, reply) => {
	const user_id = req.user.id;
	
	try {
		const players = db.prepare(`SELECT * FROM players WHERE user_id = ?`).all(user_id)
		if (players.length === 0) {
			return reply.code(404).send({ error: 'No players found for this user' })
		}
		return reply.send(players)
	} catch (error) {
		return reply.code(500).send({ error: 'Failed to fetch players' })
	}
}

const getPlayer = async (req, reply) => {
	const user_id = req.user.id;
	const { id } = req.params;
	
	try {
		const player = db.prepare(`SELECT * FROM players WHERE id = ? AND user_id = ?`).get(id, user_id)
		if (!player) {
			return reply.code(404).send({ error: 'Player not found or user not authortized to access player info' })
		}
		return reply.send(player);
	} catch (error) {
		return reply.code(500).send({ error: 'Failed to fetch player' })
	}
}

const createPlayer = async (req, reply) => {
	const user_id = req.user.id;
	const { display_name, avatar_url } = req.body;
	
	const newPlayer = {
		user_id: parseInt(user_id),
		display_name,
		avatar_url: avatar_url ?? null
	}
	
	try {
		const playerCount = db.prepare(`SELECT COUNT(*) AS count FROM players WHERE user_id = ?`).get(user_id);
		if (playerCount.count >= 4) {
			return reply.code(400).send({ error: 'Cannot add another player. Max players is 4'})
		}
		
		const result = db.prepare(`INSERT INTO players (user_id, display_name, avatar_url) VALUES (?, ?, ?)`).run(newPlayer.user_id, newPlayer.display_name, newPlayer.avatar_url);
		
		const player = db.prepare('SELECT id, display_name, avatar_url, wins, losses, created_at FROM players WHERE id = ?').get(result.lastInsertRowid);
		
		return reply.code(201).send({
			message: 'Player created succesfully',
			player
		})
	} catch (error) {
		if (error.message.includes('UNIQUE constraint failed: players.display_name')) {
			return reply.code(409).send({ error: 'Display_name already exist' })
		}
		console.log(error);
		return reply.code(500).send({ error: 'Internal server error' })
	}
}

const deletePlayer = async (req, reply) => {
	const user_id = req.user.id;
	const { id } = req.params;
	
	try {
		const result = db.prepare(`DELETE FROM players WHERE id = ? and user_id = ?`).run(id, user_id)
		if (result.changes === 0) {
			return reply.code(404).send({ error: 'Player not found or user not authortized to delete this player'})
		}
		return reply.code(200).send({ message: 'Succesfully deleted player '})
	} catch (error) {
		console.log(error);
		return reply.code(500).send({ error: 'Failed to delete player' })
	}
}

const updatePlayer = async (req, reply) => {
	const { id } = req.params;
	const { display_name, avatar_url } = req.body;
	
	try {
		const player = db.prepare(`SELECT * FROM players WHERE id = ?`).get(id)
		if (!player) {
			return reply.code(404).send({ error: 'Player not found or user not authortized to update this player'})
		}

		if (display_name && display_name !== player.display_name) {
			const existingPlayer = db.prepare(`SELECT * FROM players WHERE display_name = ?`).get(display_name);
			if (existingPlayer) {
				return reply.code(400).send({ error: 'Display name already taken' });
			}
		}
		
		const updatedPlayer = {
			display_name: display_name ?? player.display_name,
			avatar_url: avatar_url ?? player.avatar_url
		}
		
		db.prepare(`UPDATE players SET display_name = ?, avatar_url = ? WHERE id = ?`).run(updatedPlayer.display_name, updatedPlayer.avatar_url, id);
		
		return reply.code(200).send({
			message: 'Player updated successfully',
			item: updatedPlayer
		})
	} catch (error) {
		console.log(error);
		return reply.code(500).send({ error: 'Failed to update player' })
	}
}

export default {
	getPlayers,
	getPlayer,
	createPlayer,
	deletePlayer,
	updatePlayer
}