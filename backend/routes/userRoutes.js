import userController from '../controllers/userController.js'
import { getUsersOpts, deleteUserOpts, getUserOpts, putUserOpts } from '../models/userSchemas.js'

// Define user routes
function userRoutes(fastify, options) {
	// Get all users
	fastify.get('/users', { 
		...getUsersOpts, 
		handler: userController.getUsers 
	})

	// Get a single user by id
	fastify.get('/users/:id', { 
		...getUserOpts, 
		handler: userController.getUser 
	})
	
	// Update user information
	fastify.put('/users/:id', { 
		...putUserOpts,
		onRequest: [fastify.jwtAuth], 
		handler: userController.updateUser
	})

	// Delete a user
	fastify.delete('/users', { 
		...deleteUserOpts,
		onRequest: [fastify.jwtAuth], 
		handler: userController.deleteUser
	})
}

export default userRoutes;
