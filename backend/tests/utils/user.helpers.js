export function updateUserResponse(app, id, token, user = { username, password, email, avatar_url }) {
    return app.inject({
        method: 'PUT',
        url: `/users/${id}`,
        headers: {
            Authorization: `Bearer ${token}`,
        },
        payload: user,
    });
}

export function getUsersResponse(app) {
    return app.inject({
        method: 'GET',
        url: '/users',
    });
}

export function getUserResponse(app, id) {
    return app.inject({
        method: 'GET',
        url: `/users/${id}`,
    });
}
