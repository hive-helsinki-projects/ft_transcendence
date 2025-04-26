// Tournament schema
export const Tournament = {
    type: 'object',
    properties: {
        id: { type: 'integer' },
        name: { type: 'string' },
        status: { type: 'string' },
        current_round: { type: 'integer' },
        winner_id: { type: 'integer', nullable: true },
        created_at: { type: 'string', format: 'date-time' },
        matches: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    match_id: { type: 'integer' },
                    date: { type: 'string', format: 'date-time' },
                    round: { type: 'integer' },
                    players: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                player_id: { type: 'integer' },
                                score: { type: 'integer' },
                            },
                            required: ['player_id'],
                        },
                    },
                    winner: {
                        type: 'object',
                        nullable: true,
                        properties: {
                            player_id: { type: 'integer' },
                        },
                    },
                },
                required: ['match_id', 'players'],
            },
        },
    },
};

// Schemas for tournament operations
export const getTournamentsOpts = {
    schema: {
        summary: 'Get all tournaments',
		tags: ['tournament'],
        response: {
            200: {
                type: 'array',
                items: Tournament,
            },
        },
    },
};

export const getTournamentOpts = {
    schema: {
        summary: 'Get tournament details',
		tags: ['tournament'],
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
                    item: Tournament,
                },
            },
        },
    },
};

export const postTournamentOpts = {
    schema: {
        security: [
            {
                bearerAuth: []
            }
        ],
        summary: 'Create a tournament',
		tags: ['tournament'],
        body: {
            type: 'object',
            required: ['name', 'player_ids'],
            properties: {
                name: { type: 'string' },
                player_ids: {
                    type: 'array',
                    minItems: 3,
                    maxItems: 8,
                    items: { type: 'integer' },
                },
            },
        },
        response: {
            201: {
                type: 'object',
                properties: {
                    message: { type: 'string' },
                    item: Tournament,
                },
            },
        },
    },
};

export const putTournamentOpts = {
    schema: {
        security: [
            {
                bearerAuth: []
            }
        ],
        summary: 'Advance a tournament to next round',
		tags: ['tournament'],
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
                    item: Tournament,
                },
            },
        },
    },
};

export const deleteTournamentOpts = {
    schema: {
        security: [
            {
                bearerAuth: []
            }
        ],
        summary: 'Delete a match tournament',
		tags: ['tournament'],
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
