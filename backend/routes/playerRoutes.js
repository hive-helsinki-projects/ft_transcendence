import playerController from '../controllers/playerController.js'
import { getPlayersOpts, getPlayerOpts, postPlayerOpts } from '../models/playerSchemas.js';

function playerRoutes(fastify, options) {
	// Get all players belonging to a user
	fastify.get('/players/:id', { 
		...getPlayersOpts,
		onRequest: [fastify.jwtAuth],
		handler: playerController.getPlayers 
	})
	
	// Get a player belonging to a user
	fastify.get('/players/:user_id/:player_id', {
		...getPlayerOpts,
		onRequest: [fastify.jwtAuth],
		handler: playerController.getPlayer
	})
	
	// Create a player
	fastify.post('/players/:id', {
		...postPlayerOpts,
		onRequest: [fastify.jwtAuth],
		handler: playerController.createPlayer
	}) 
}

export default playerRoutes;