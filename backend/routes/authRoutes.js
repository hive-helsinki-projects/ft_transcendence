import authController from '../controllers/authController.js'
import { postLoginOpts, postLogoutOpts, postRegisterOpts, postLogin2faOpts } from '../models/authSchemas.js'

function authRoutes(fastify, options, done) {
	// Login a user
	fastify.post('/login', {
		...postLoginOpts,
		handler: authController.loginUser
	})

    fastify.post('/login/2fa', {
        ...postLogin2faOpts,
        handler: authController.login2fa
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

	// TEMPORARY: Test 401 response - REMOVE IN PRODUCTION
	fastify.get('/test-401', {
		handler: authController.test401
	})

	done()
}

export default authRoutes;
