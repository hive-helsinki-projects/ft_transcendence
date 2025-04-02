import userController from '../controllers/userController.js';

// User schema
const User = {
	type: 'object',
	properties: {
		id: { type: 'integer' },
		username: { type: 'string' },
		email: { type: 'string' },
		online_status: { type: 'boolean' },
		created_at: { type: 'string', format: 'date-time' }
	},
}

// Options for get all items
const getUsersOpts = {
	schema: {
		response: {
			200: {
				type: 'array',
				items: User,
			},
		},
	},
	handler: userController.getUsers,
}

const getUserOpts = {
	schema: {
		response: {
			200: User,
		},
	},
	handler: userController.getUser,
}

const postUserOpts = {
	schema: {
		body: {
			type: 'object',
			required: ['username', 'email', 'password'],
			properties: {
				username: { type: 'string' },
				email: { type: 'string' },
				password: { type: 'string' },
			},
		},
		response: {
			201: {
				type: 'object',
				properties: {
					message: { type: 'string' },
					user: User,
				}
			}
		},
	},
	handler: userController.createUser,
}

const putUserOpts = {
	schema: {
		body: {
			type: 'object',
			required: [],
			properties: {
				username: { type: 'string', nullable: true },
				email: { type: 'string', nullable: true },
				password: { type: 'string', nullable: true }
			},
		},
		response: {
			200: {
				type: 'object',
				properties: {
					message: { type: 'string' },
					user: User,
				}
			}
		},
	},
	handler: userController.updateUser,
}

// Define user routes
function userRoutes(fastify, options) {
	// Get all users
	fastify.get('/users', getUsersOpts)

	// Get a single user by id
	fastify.get('/users/:id', getUserOpts)
	
	// Create a user
	fastify.post('/users', postUserOpts)
	
	// Update user information
	fastify.put('/users/:id', { onRequest: [fastify.jwtAuth], ...putUserOpts })
}

export default userRoutes;
