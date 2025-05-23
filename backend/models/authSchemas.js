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
					id: { type: 'integer' },
				},
			},
            206: {
                description: 'Two-factor authentication required',
                type: 'object',
                properties: {
                    message: { type: 'string' },
                    userId: { type: 'integer' },
                }
            },
		},
	},
};

export const postLogin2faOpts = {
    schema: {
      summary: "Complete login with 2FA code",
      tags: ['auth'],
      body: {
        type: 'object',
        required: ['userId','code'],
        properties: {
          userId: { type: 'integer' },
          code:   { type: 'string', minLength: 6, maxLength: 6 }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            token: { type: 'string' }
          }
        },
        400: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        }
      }
    }
  }

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
