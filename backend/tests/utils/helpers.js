export function loginResponse (app, credentials = { username, password}) {
    const response = app.inject({
        method: 'POST',
        url: '/login',
        payload: credentials,
    });
    return response;
}

export function logoutResponse (app, token) {
    const response = app.inject({
        method: 'POST',
        url: '/logout',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response;
}

export function registerResponse (app, user = { username, password, email }) {
    const response = app.inject({
        method: 'POST',
        url: '/register',
        payload: user,
    });
    return response;
}

export function updateUserResponse (app, id, token, user = { username, password, email, avatar_url }) {
    const response = app.inject({
        method: 'PUT',
        url: `/users/${id}`,
        headers: {
            Authorization: `Bearer ${token}`,
        },
        payload: user,
    });
    return response;
}

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