import playerController from '../controllers/playerController.js'
import { getPlayersOpts, getUserPlayersOpts, getPlayerOpts, postPlayerOpts, putPlayerOpts, deletePlayerOpts } from '../models/playerSchemas.js';

function playerRoutes(fastify, options) {
	// Get all players for the authenticated user
	fastify.get('/players', { 
			...getPlayersOpts,
			onRequest: [fastify.jwtAuth],
			handler: playerController.getPlayers 
		})

	// Get all players belonging to a user
	fastify.get('/users/:userId/players', { 
		...getUserPlayersOpts,
		handler: playerController.getUserPlayers 
	})
	
	// Get a player belonging to a user
	fastify.get('/players/:id', {
		...getPlayerOpts,
		// onRequest: [fastify.jwtAuth],
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

	// Update a player display_name or avatar_url
	fastify.put('/players/:id', {
		...putPlayerOpts,
		onRequest: [fastify.jwtAuth],
		handler: playerController.updatePlayer
	})
}

export default playerRoutes;