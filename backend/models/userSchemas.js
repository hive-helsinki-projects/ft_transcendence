// User schema
export const User = {
	type: 'object',
	properties: {
		id: { type: 'integer' },
		username: { type: 'string' },
		email: { type: 'string', format: 'email' },
		online_status: { type: 'boolean' },
		avatar_url: { type: 'string' },
		created_at: { type: 'string', format: 'date-time' }
	},
}

// Schemas for user-related operations
export const getUsersOpts = {
	schema: {
		response: {
			200: {
				type: 'array',
				items: User,
			},
		},
	},
}

export const getUserOpts = {
	schema: {
		response: {
			200: User,
		},
	},
}

export const putUserOpts = {
	schema: {
		body: {
			type: 'object',
			required: [],
			properties: {
				username: { type: 'string', minLength: 3, maxLength: 20, pattern: '^[a-zA-Z0-9]+$', nullable: true },
				email: { type: 'string', format: 'email', nullable: true },
				password: { type: 'string', minLength: 6, nullable: true },
				avatar_url: { type: 'string', nullable: true },
			},
		},
		response: {
			200: {
				type: 'object',
				properties: {
					message: { type: 'string' },
					item: User,
				}
			}
		},
	},
}
