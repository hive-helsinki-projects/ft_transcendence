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
                    players: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                player_id: { type: 'integer' },
                                score: { type: 'integer' },
                            },
                            required: ['player_id']
                            }
                        },
                        winner: {
                            type: 'object',
                            nullable: true,
                            properties: {
                                player_id: { type: 'integer' },
                            }
                        }
                    },
                required: ['match_id', 'players']
                }
            }
        },
        required: ['id', 'name', 'status', 'current_round', 'created_at']
}

// Schemas for tournament operations
export const getTournamentsOpts = {
    schema: {
        response: {
            200: {
                type: 'array',
                properties: {
                    items: Tournament,
                }
            }
        }
    }
}

export const getTournamentOpts = {
    schema: {
        params: {
            type: 'object',
            required: ['id'],
            properties: {
                id: { type: 'integer' }
            },
        },
        response: {
            201: {
                type: 'object',
                properties: {
                    item: Tournament,
                }    
            }
        }
    }
}

export const postTournamentOpts = {
    schema: {
        type: 'object',
        required: ['name', 'player_ids'],
        properties: {
            name: { type: 'string' },
            player_ids: {
                type: 'array',
                minItems: 3,
                items: { type: 'integer' }
            }
        },
        response: {
            201: {
                type: 'object',
                properties: {
                    message: { type: 'string' },
                    item: Tournament,
                }    
            }
        }
    }
}