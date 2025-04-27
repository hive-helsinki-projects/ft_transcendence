export function loginResponse(app, credentials = { username, password }) {
    return app.inject({
        method: 'POST',
        url: '/login',
        payload: credentials,
    });
}

export function logoutResponse(app, token) {
    return app.inject({
        method: 'POST',
        url: '/logout',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

export function registerResponse(app, user = { username, password, email }) {
    return app.inject({
        method: 'POST',
        url: '/register',
        payload: user,
    });
}