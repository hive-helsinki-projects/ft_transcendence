import userController from '../controllers/userController.js';

// User schema
const User = {
	type: 'object',
	properties: {
		id: { type: 'integer' },
		username: { type: 'string' },
		display_name: { type: 'string' },
		email: { type: 'string' },
		avatar_url: { type: 'string', nullable: true },
		created_at: { type: 'string', format: 'date-time' },
		updated_at: { type: 'string', format: 'date-time' },
		online: { type: 'boolean' },
		wins: { type: 'integer'},
		losses: { type: 'integer'}
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
			201: User,
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
				password: { type: 'string', nullable: true },
				email: { type: 'string', nullable: true },
				avatar_url: { type: 'string', nullable: true },
				status: { type: 'string', enum: ['online', 'offline', 'busy']}
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
	fastify.get('/api/users', getUsersOpts)
	console.log(getUsersOpts.handler);

	// Get a single user by id
	fastify.get('/api/users/:id', getUserOpts)
	
	// Create a user
	fastify.post('/api/users', postUserOpts)
	console.log(userController.createUser);
	
	// Update user information
	fastify.put('/api/users/:id', { onRequest: [fastify.jwtAuth], ...putUserOpts })
}

export default userRoutes;
