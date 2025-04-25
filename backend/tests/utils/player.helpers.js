export function getPlayersResponse(app, token) {
    return app.inject({
        method: 'GET',
        url: '/players',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

export function getPlayerResponse(app, token, id) {
    return app.inject({
        method: 'GET',
        url: `/players/${id}`,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

export function createPlayerResponse(app, token, player = { display_name, avatar_url }) {
    return app.inject({
        method: 'POST',
        url: '/players',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        payload: player,
    });
}

export function updatePlayerResponse(app, token, id, player = { display_name, avatar_url }) {
    return app.inject({
        method: 'PUT',
        url: `/players/${id}`,
        headers: {
            Authorization: `Bearer ${token}`,
        },
        payload: player,
    });
}

export function deletePlayerResponse(app, token, id) {
    return app.inject({
        method: 'DELETE',
        url: `/players/${id}`,
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
}
