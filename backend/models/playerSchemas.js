// Player schema
export const Player = {
    type: 'object',
    properties: {
        id: { type: 'integer' },
        display_name: { 
            type: 'string', 
            minLength: 3, 
            maxLength: 16, 
            pattern: '^[a-zA-Z0-9]+$' 
        },
        wins: { type: 'integer' },
        losses: { type: 'integer' },
        avatar_url: { type: 'string' },
        created_at: { type: 'string', format: 'date-time' },
    },
};

// Schemas for player-related operations
export const getPlayersOpts = {
    schema: {
        security: [
            {
                bearerAuth: []
            }
        ],
        summary: 'Get all players belonging to a user',
		tags: ['player'],
        response: {
            200: {
                type: 'array',
                items: Player,
            },
        },
    },
};

// Schemas for player-related operations
export const getUserPlayersOpts = {
    schema: {
        summary: 'Get all players belonging to a user',
		tags: ['player'],
        response: {
            200: {
                type: 'array',
                items: Player,
            },
        },
    },
};

export const getPlayerOpts = {
    schema: {
        security: [
            {
                bearerAuth: []
            }
        ],
        summary: 'Get a player belonging to a user',
		tags: ['player'],
        params: {
            type: 'object',
            required: ['id'],
            properties: {
                id: { type: 'integer' },
            },
        },
        response: {
            200: Player,
        },
    },
};

export const postPlayerOpts = {
    schema: {
        security: [
            {
                bearerAuth: []
            }
        ],
        summary: 'Create a player',
		tags: ['player'],
        body: {
            type: 'object',
            required: ['display_name'],
            properties: {
                display_name: { 
                    type: 'string', 
                    minLength: 3, 
                    maxLength: 20, 
                    pattern: '^[a-zA-Z0-9]+$' 
                },
                avatar_url: { type: 'string', nullable: true },
            },
        },
        response: {
            200: Player,
        },
    },
};

export const putPlayerOpts = {
    schema: {
        security: [
            {
                bearerAuth: []
            }
        ],
        summary: 'Update a players display_name or avatar_url',
		tags: ['player'],
        params: {
            type: 'object',
            required: ['id'],
            properties: {
                id: { type: 'integer' },
            },
        },
        body: {
            type: 'object',
            required: [],
            properties: {
                display_name: { 
                    type: 'string', 
                    minLength: 3, 
                    maxLength: 20, 
                    pattern: '^[a-zA-Z0-9]+$', 
                    nullable: true 
                },
                avatar_url: { type: 'string', nullable: true },
            },
        },
        response: {
            200: {
                type: 'object',
                properties: {
                    message: { type: 'string' },
                    item: Player,
                },
            },
        },
    },
};

export const deletePlayerOpts = {
    schema: {
        security: [
            {
                bearerAuth: []
            }
        ],
        summary: 'Delete a player',
		tags: ['player'],
        params: {
            type: 'object',
            required: ['id'],
            properties: {
                id: { type: 'integer' },
            },
        },
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
