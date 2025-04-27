import { User } from './userSchemas.js';

export const postLoginOpts = {
	schema: {
		summary: 'Login a user',
		tags: ['auth'],
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
};

export const postLogoutOpts = {
	schema: {
		security: [
            {
                bearerAuth: []
            }
        ],
		summary: 'Logout a user',
		tags: ['auth'],
		response: {
			200: {
				type: 'object',
				properties: {
					message: { type: 'string' },
				},
			},
		},
	},
};

export const postRegisterOpts = {
	schema: {
		summary: 'Register a user',
		tags: ['auth'],
		body: {
			type: 'object',
			required: ['username', 'email', 'password'],
			properties: {
				username: { type: 'string', minLength: 3, maxLength: 20, pattern: '^[a-zA-Z0-9]+$' },
				email: { type: 'string', format: 'email' },
				password: { type: 'string', minLength: 6 },
			},
		},
		response: {
			201: {
				type: 'object',
				properties: {
					message: { type: 'string' },
					user: User,
				},
			},
		},
	},
};
