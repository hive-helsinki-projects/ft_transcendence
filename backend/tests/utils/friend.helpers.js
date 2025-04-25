export function sendFriendRequestResponse(app, id, token) {
    return app.inject({
        method: 'POST',
        url: `/friend-requests/${id}`,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

export function getFriendStatusResponse(app, id, token) {
    return app.inject({
        method: 'GET',
        url: `/friends/${id}/status`,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

export function acceptFriendResponse(app, id, token) {
    return app.inject({
        method: 'PATCH',
        url: `/friend-requests/${id}`,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

export function getFriendsResponse(app, token) {
    return app.inject({
        method: 'GET',
        url: '/friends',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

export function deleteFriendResponse(app, token, id) {
    return app.inject({
        method: 'DELETE',
        url: `/friends/${id}`,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}
