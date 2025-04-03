import playerController from '../controllers/playerController.js'
import { getPlayersOpts, getPlayerOpts, postPlayerOpts, deletePlayerOpts } from '../models/playerSchemas.js';

function playerRoutes(fastify, options) {
	// Get all players belonging to a user
	fastify.get('/players', { 
		...getPlayersOpts,
		onRequest: [fastify.jwtAuth],
		handler: playerController.getPlayers 
	})
	
	// Get a player belonging to a user
	fastify.get('/players/:id', {
		...getPlayerOpts,
		onRequest: [fastify.jwtAuth],
		handler: playerController.getPlayer
	})
	
	// Create a player
	fastify.post('/players', {
		...postPlayerOpts,
		onRequest: [fastify.jwtAuth],
		handler: playerController.createPlayer
	})
	
	// Delete a player
	fastify.delete('/players/:id', {
		...deletePlayerOpts,
		onRequest: [fastify.jwtAuth],
		handler: playerController.deletePlayer
	})
}

export default playerRoutes;