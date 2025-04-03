import playerController from '../controllers/playerController.js'
import { getPlayersOpts } from '../models/playerSchemas.js';

function playerRoutes(fastify, options) {
	// Get all players belonging to a user
	fastify.get('/players/:id', { 
		...getPlayersOpts,
		onRequest: [fastify.jwtAuth],
		handler: playerController.getPlayers 
	})
}

export default playerRoutes;