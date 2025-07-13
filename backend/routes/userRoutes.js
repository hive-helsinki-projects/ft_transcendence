import userController from '../controllers/userController.js'
import { getUsersOpts, deleteUserOpts, getUserOpts, putUserOpts, postAvatarOpts } from '../models/userSchemas.js'

// Define user routes
function userRoutes(fastify, options) {
	// Get all users
	fastify.get('/users', {
		...getUsersOpts,
		onRequest: [fastify.jwtAuth],
		handler: userController.getUsers
	})

	// Get a single user by id
	fastify.get('/users/:id', {
		...getUserOpts,
		onRequest: [fastify.jwtAuth],
		handler: userController.getUser
	})

	// Update user information
	fastify.put('/users/:id', {
		...putUserOpts,
		onRequest: [fastify.jwtAuth],
		handler: userController.updateUser
	})

	// Delete a user
	fastify.delete('/users/:id', {
		...deleteUserOpts,
		onRequest: [fastify.jwtAuth],
		handler: userController.deleteUser
	})

    // Upload or replace avatar (multipart/form-data)
    fastify.post('/users/:id/avatar', {

      ...postAvatarOpts,
      onRequest: [fastify.jwtAuth],
      handler: userController.uploadAvatar
    },
  )
}

export default userRoutes;
