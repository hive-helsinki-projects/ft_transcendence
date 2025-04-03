import db from '../models/database.js';

const getPlayers = async (req, reply) => {
	const { id } = req.params;
	
	if (req.user.id !== parseInt(id)) {
		return reply.code(403).send({ error: 'Unauthoritized to access users player info' })
	}
	
	try {
		const players = db.prepare(`SELECT * FROM players WHERE user_id = ?`).all(id)
		if (players.length === 0) {
			return reply.code(404).send({ error: 'No players found for this user' })
		}
		return reply.send(players)
	} catch (error) {
		console.error(error);
		return reply.code(500).send({ error: 'Failed to fetch players' })
	}
}

export default {
	getPlayers,
}