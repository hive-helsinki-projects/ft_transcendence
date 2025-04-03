// User schema
export const User = {
	type: 'object',
	properties: {
		id: { type: 'integer' },
		username: { type: 'string' },
		email: { type: 'string' },
		online_status: { type: 'boolean' },
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
}
