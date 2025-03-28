import loginController from '../controllers/login.controller.js'

const loginOpts = {
	schema: {
			body: {
				type: 'object',
				required: ['username', 'password'],
				properties: {
					username: { type: 'string' },
					password: { type: 'string' },
				},
			},
			response: {
				200: {
					type: 'object',
					properties: {
						token: { type: 'string' },
						username: { type: 'string' },
				},
			},
		},
	},
	handler: loginController.loginUser,
}

function loginRoutes(fastify, options, done) {
	fastify.post('/api/login', loginOpts)
	
	done()
}

export default loginRoutes;