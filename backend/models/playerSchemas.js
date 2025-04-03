// Player schema
export const Player = {
	type: 'object',
	properties: {
		id: { type: 'integer' },
		display_name: { type: 'string' },
		wins: { type: 'integer' },
		losses: { type: 'integer' },
		avatar_url: { type: 'string' },
		created_at: { type: 'string', format: 'date-time' }
	},
}

// Schemas for player-related operations
export const getPlayersOpts = {
	schema: {
		response: {
			200: {
				type: 'array',
				items: Player,
			}
		}
	}
}