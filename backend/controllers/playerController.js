import db from '../models/database.js';

const getPlayers = async (req, reply) => {
	const { id } = req.params;
	if (req.user.id !== parseInt(id)) {
		return reply.code(403).send({ error: 'Unauthoritized to access users players info' })
	}
	
	try {
		const players = db.prepare(`SELECT * FROM players WHERE user_id = ?`).all(id)
		if (players.length === 0) {
			return reply.code(404).send({ error: 'No players found for this user' })
		}
		return reply.send(players)
	} catch (error) {
		return reply.code(500).send({ error: 'Failed to fetch players' })
	}
}

const getPlayer = async (req, reply) => {
	const { user_id, player_id } = req.params;
	if (req.user.id !== parseInt(user_id)) {
		return reply.code(403).send({ error: 'Unauthoritized to access users player info' })
	}
	
	try {
		const player = db.prepare(`SELECT * FROM players WHERE id = ? AND user_id = ?`).get(player_id, user_id)
		if (!player) {
			return reply.code(404).send({ error: 'Player not found '})
		}
		return reply.send(player);
	} catch (error) {
		return reply.code(500).send({ error: 'Failed to fetch player' })
	}
}

const createPlayer = async (req, reply) => {
	const { id } = req.params;	
	if (req.user.id !== parseInt(id)) {
		return reply.code(403).send({ error: 'Unauthoritized to create player' })
	}
	
	const { display_name, avatar_url } = req.body;
	
	const newPlayer = {
		user_id: parseInt(id),
		display_name,
		avatar_url: avatar_url ?? null
	}
	
	try {
		const result = db.prepare(`INSERT INTO players (user_id, display_name, avatar_url) VALUES (?, ?, ?)`).run(newPlayer.user_id, newPlayer.display_name, newPlayer.avatar_url);
		
		const player = db.prepare('SELECT id, display_name, avatar_url, wins, losses, created_at FROM players WHERE id = ?').get(result.lastInsertRowid);
		
		return reply.code(201).send({
			message: 'Player created succesfully',
			player
		})
	} catch (error) {
		if (error.message.includes('UNIQUE contraint failed')) {
			return reply.code(409).send({ error: 'Display_name already exist' })
		}
		console.log(error);
		return reply.code(500).send({ error: 'Internal server error' })
	}
	
}

export default {
	getPlayers,
	getPlayer,
	createPlayer
}