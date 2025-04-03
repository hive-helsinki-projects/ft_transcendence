import authController from '../controllers/authController.js'
import { postLoginOpts, postLogoutOpts, postRegisterOpts } from '../models/authSchemas.js'

function authRoutes(fastify, options, done) {
	// Login a user
	fastify.post('/login', { 
		...postLoginOpts, 
		handler: authController.loginUser 
	})
	
	// Logout a user
	fastify.post('/logout', {
		...postLogoutOpts, 
		onRequest: [fastify.jwtAuth], 
		handler: authController.logoutUser 
	})
	
	// Create a user
	fastify.post('/register', { 
		...postRegisterOpts, 
		handler: authController.createUser
	})
	
	done()
}

export default authRoutes;