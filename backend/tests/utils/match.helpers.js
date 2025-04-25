export function getMatchHistoriesResponse (app, token) {
    const response = app.inject({
        method: 'GET',
        url: '/match-histories',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        
    })
    return response;
}

export function getMatchHistoryResponse (app, token, id) {
    const response = app.inject({
        method: 'GET',
        url: `/match-histories/${id}`,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
    return response;
}

export function createMatchHistoryResponse (app, token, { 
    type = '1v1',
    tournament_id = null,
    round = null,
    players = []
    } = {}) {
    const match = {
        type,
        tournament_id,
        round,
        players
    };

    return app.inject({
        method: 'POST',
        url: '/match-histories',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        payload: match
    });
}

export function updateMatchHistoryResponse (app, token, id, { 
    players = [],
    winner_id = null
    } = {}) {
    const match = {
        players,
        winner_id,
    };

    return app.inject({
        method: 'PUT',
        url: `/match-histories/${id}`,
        headers: {
            Authorization: `Bearer ${token}`,
        },
        payload: match
    });
}

export function deleteMatchHistoryResponse (app, token, id) {
    const response = app.inject({
        method: 'DELETE',
        url: `/match-histories/${id}`,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
    return response;
}
