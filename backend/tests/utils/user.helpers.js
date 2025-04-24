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

export function getUsersResponse (app) {
    const response = app.inject({
        method: 'GET',
        url: '/users',
    });
    return response;
}