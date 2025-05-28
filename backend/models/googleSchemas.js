// Schema for google operations
export const postGoogleLoginOpts = {
	schema: {
		summary: 'Google login',
		tags: ['google'],
		body: {
			type: 'object',
			required: ['code'],
			properties: {
				code: { type: 'string' }
			},
		},
		response: {
			200: {
			type: 'object',
			properties: {
				message: { type: 'string' },
				user: {
				type: 'object',
				properties: {
					token: { type: 'string' },
					username: { type: 'string' },
					id: { type: 'number' },
				},
				required: ['token', 'username', 'id'],
				},
			},
			required: ['message', 'user'],
			},
		},
	},
};