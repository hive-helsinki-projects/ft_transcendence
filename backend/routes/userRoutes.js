import userController from '../controllers/userController.js'
import { getUsersOpts, getUserOpts, putUserOpts } from '../models/userSchemas.js'

// Define user routes
function userRoutes(fastify, options) {
	// Get all users
	fastify.get('/users', { ...getUsersOpts, handler: userController.getUsers })

	// Get a single user by id
	fastify.get('/users/:id', { ...getUserOpts, handler: userController.getUser})
	
	// Update user information
	fastify.put('/users/:id', { onRequest: [fastify.jwtAuth], ...putUserOpts, handler: userController.updateUser })
}

export default userRoutes;
