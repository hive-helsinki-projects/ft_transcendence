export function sendFriendRequestResponse (app, id, token) {
    const response = app.inject({
        method: 'POST',
        url: `/friend-requests/${id}`,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response;
}

export function getFriendStatusResponse (app, id, token) {
    const response = app.inject({
        method: 'GET',
        url: `/friends/${id}/status`,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response;
}

export function acceptFriendResponse (app, id, token) {
    const response = app.inject({
        method: 'PATCH',
        url: `/friend-requests/${id}`,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response;
}