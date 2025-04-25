export function getTournamentsResponse(app) {
    return app.inject({
        method: 'GET',
        url: '/tournaments'
    });
}

export function getTournamentResponse(app, id) {
    return app.inject({
        method: 'GET',
        url: `/tournaments/${id}`
    })
}

export function createTournamentResponse(app, token, { 
    name,
    player_ids = []
} = {}) {
    const tournament = {
        name,
        player_ids
    };

    return app.inject({
        method: 'POST',
        url: '/tournaments',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        payload: tournament
    });
}

// export function advanceTournamentResponse(app, token, )