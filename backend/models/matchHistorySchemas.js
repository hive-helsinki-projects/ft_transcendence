// Match history schema
export const MatchHistory = {
    type: 'object',
    properties: {
        id: { type: 'integer' },
        type: { type: 'string' },
        tournament_id: { type: 'integer', nullable: true},
        date: { type: 'string', format: 'date-time' },
        winners: { 
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    winner_id: { type: 'integer' }
                }
            }
        },
        players: { 
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    player_id: { type: 'integer' },
                    score: { type: 'integer', nullable: true },
                    team: { type: 'integer', nullable: true },
                    round: { type: 'integer', nullable: true }
                }
            }
        },
    }
}

// Schemas for match-history operations
export const getMatchHistoriesOpts = {
    schema: {
        response: {
            200: {
                type: 'array',
                items: MatchHistory,
            }
        }
    }
}

export const getMatchHistoryOpts = {
    schema: {
        response: {
            200: MatchHistory,
        }
    }
}

export const postMatchHistoryOpts = {
    schema: {
        body: {
            type: 'object',
            required: [ 'type', 'players' ],
            properties: {
                type: { type: 'string' },
                tournament_id: { type: 'integer', nullable: true },
                winners: { 
                    type: 'array', nullable: true,
                    items: {
                        type: 'object',
                        properties: {
                            winner_id: { type: 'integer' }
                        },
                    }
                },
                players: { 
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            player_id: { type: 'integer' },
                            score: { type: 'integer', nullable: true },
                            team: { type: 'integer', nullable: true },
                            round: { type: 'integer', nullable: true }
                        },
                        required: ['player_id']
                    }
                },
            }
        },
        response: {
            200: {
                type: 'object',
                properties: {
                    message: { type: 'string' },
                    item: MatchHistory,
                }
            }
        }
    }
}

export const putMatchHistoryOpts = {
    schema: {
        body: {
            type: 'object',
            required: [ 'winners', 'players' ],
            properties: {
                type: { type: 'string' },
                tournament_id: { type: 'integer', nullable: true },
                winners: { 
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            winner_id: { type: 'integer' }
                        },
                    }
                },
                players: { 
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            player_id: { type: 'integer' },
                            score: { type: 'integer' },
                            team: { type: 'integer', nullable: true },
                            round: { type: 'integer', nullable: true }
                        },
                        required: ['player_id', 'score']
                    }
                },
            }
        },
        response: {
            200: {
                type: 'object',
                properties: {
                    message: { type: 'string' },
                    item: MatchHistory,
                }
            }
        }
    }
}