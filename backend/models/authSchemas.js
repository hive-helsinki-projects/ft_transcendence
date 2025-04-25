import { User } from './userSchemas.js';

export const postLoginOpts = {
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
};

export const postLogoutOpts = {
	schema: {
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
