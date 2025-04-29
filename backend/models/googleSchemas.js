// Schema for google operations
export const postGoogleLoginOpts = {
	schema: {
		summary: 'Google login',
		tags: ['google'],
		body: {
			type: 'object',
			required: ['token'],
			properties: {
				token: { type: 'string' }
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
				},
				required: ['token', 'username'],
				},
			},
			required: ['message', 'user'],
			},
		},
	},
};