import userController from '../controllers/user.controller.js';

// User schema
const User = {
	type: 'object',
	properties: {
		id: { type: 'string' },
		username: { type: 'string' },
		email: { type: 'string' },
		password: { type: 'string' },
		avatar_url: { type: 'string', nullable: true },
		status: { type: 'string', enum: ['online', 'offline', 'busy']},
		created_at: { type: 'string', format: 'date-time' },
		updated_at: { type: 'string', format: 'date-time' },
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

// Define user routes
function userRoutes(fastify, options, done) {
	// Get all users
	fastify.get('/api/users', getUsersOpts)

	// Get a single user by username
	fastify.get('/api/users/:username', getUserOpts)
	
	// Create a user
	fastify.post('/api/users', postUserOpts)
	
	done()
}

export default userRoutes;
