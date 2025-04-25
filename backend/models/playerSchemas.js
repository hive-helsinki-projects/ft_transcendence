// Player schema
export const Player = {
    type: 'object',
    properties: {
        id: { type: 'integer' },
        display_name: { 
            type: 'string', 
            minLength: 3, 
            maxLength: 20, 
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
        response: {
            200: Player,
        },
    },
};

export const postPlayerOpts = {
    schema: {
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
