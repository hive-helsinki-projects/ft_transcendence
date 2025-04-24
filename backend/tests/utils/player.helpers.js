export function getPlayersResponse (app, token) {
    const response = app.inject({
        method: 'GET',
        url: '/players',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response;
}

export function getPlayerResponse (app, token, id) {
    const response = app.inject({
        method: 'GET',
        url: `/players/${id}`,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response;
}

export function createPlayerResponse (app, token, player = { display_name, avatar_url }) {
    const response = app.inject({
        method: 'POST',
        url: '/players',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        payload: player,
    });
    return response;
}

export function updatePlayerResponse (app, token, id, player = { display_name, avatar_url }) {
    const response = app.inject({
        method: 'PUT',
        url: `/players/${id}`,
        headers: {
            Authorization: `Bearer ${token}`,
        },
        payload: player,
    })
    return response;
}

export function deletePlayerResponse (app, token, id) {
    const response = app.inject({
        method: 'DELETE',
        url: `/players/${id}`,
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
    return response;
}