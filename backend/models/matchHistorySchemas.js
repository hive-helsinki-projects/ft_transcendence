// Match history schema
export const MatchHistory = {
    type: 'object',
    properties: {
        id: { type: 'integer' },
        type: { type: 'string' },
        tournament_id: { type: 'integer', nullable: true },
        date: { type: 'string', format: 'date-time' },
        round: { type: 'integer', nullable: true },
        status: { type: 'string', enum: ['pending', 'finished'] },
        winner_id: { type: 'integer', nullable: true },
        players: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    player_id: { type: 'integer' },
                    score: { type: 'integer', nullable: true },
                },
            },
        },
    },
};

// Schemas for match-history operations
export const getMatchHistoriesOpts = {
    schema: {
        summary: 'Get all match histories',
        tags: ['match-history'],
        response: {
            200: {
                type: 'array',
                items: MatchHistory,
            },
        },
    },
};

export const getUserMatchHistoriesOpts = {
    schema: {
        summary: 'Get match histories for specific user',
        tags: ['match-history'],
        response: {
            200: {
                type: 'array',
                items: MatchHistory,
            },
        },
    },
};

export const getMatchHistoryOpts = {
    schema: {
        summary: 'Get match details',
        tags: ['match-history'],
        params: {
            type: 'object',
            required: ['id'],
            properties: {
                id: { type: 'integer' },
            },
        },
        response: {
            200: MatchHistory,
        },
    },
};

export const postMatchHistoryOpts = {
    schema: {
        security: [
            {
                bearerAuth: []
            }
        ],
        summary: 'Create a match',
        tags: ['match-history'],
        body: {
            type: 'object',
            required: ['type', 'players'],
            properties: {
                type: { type: 'string' },
                tournament_id: { type: 'integer', nullable: true },
                winner_id: { type: 'integer', nullable: true },
                players: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            player_id: { type: 'integer' },
                            score: { type: 'integer', nullable: true },
                        },
                        required: ['player_id'],
                    },
                },
            },
        },
        response: {
            201: {
                type: 'object',
                properties: {
                    message: { type: 'string' },
                    match_id: { type: 'integer' },
                },
            },
        },
    },
};

export const putMatchHistoryOpts = {
    schema: {
        security: [
            {
                bearerAuth: []
            }
        ],
        summary: 'Update a match history players scores and winners',
        tags: ['match-history'],
        params: {
            type: 'object',
            required: ['id'],
            properties: {
                id: { type: 'integer' },
            },
        },
        body: {
            type: 'object',
            required: ['winner_id', 'players'],
            properties: {
                type: { type: 'string' },
                tournament_id: { type: 'integer', nullable: true },
                status: { type: 'string', enum: ['pending', 'finished'] },
                winner_id: { type: 'integer' },
                players: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            player_id: { type: 'integer' },
                            score: { type: 'integer' },
                            round: { type: 'integer', nullable: true },
                        },
                        required: ['player_id', 'score'],
                    },
                },
            },
        },
        response: {
            200: {
                type: 'object',
                properties: {
                    message: { type: 'string' },
                    item: MatchHistory,
                },
            },
        },
    },
};

export const deleteMatchHistoryOpts = {
    schema: {
        security: [
            {
                bearerAuth: []
            }
        ],
        summary: 'Delete a match history',
        tags: ['match-history'],
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

export const deleteAllMatchHistoryOpts = {
    schema: {
        security: [
            {
                bearerAuth: []
            }
        ],
        summary: 'Delete all 1v1 match history',
        tags: ['match-history'],
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
