export function setup2faResponse(app, token) {
    return app.inject({
      method: 'GET',
      url: '/api/2fa/setup',
      headers: { Authorization: `Bearer ${token}` },
    });
}

export function verify2faResponse(app, token, payload) {
    return app.inject({
      method: 'POST',
      url: '/api/2fa/verify',
      headers: { Authorization: `Bearer ${token}` },
      payload,
    });
}

export function disable2faResponse(app, token) {
    return app.inject({
      method: 'DELETE',
      url: '/api/2fa',
      headers: { Authorization: `Bearer ${token}` },
    });
}

export function login2faResponse(app, payload) {
    return app.inject({
      method: 'POST',
      url: '/login/2fa',
      payload,
    });
}
