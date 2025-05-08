import speakeasy from 'speakeasy';
import { registerResponse, loginResponse } from './utils/auth.helpers.js';
import { getUserResponse } from './utils/user.helpers.js';
import { setup2faResponse, verify2faResponse, disable2faResponse, login2faResponse } from './utils/2fa.helpers.js';
import db from '../models/database.js';

export default function run2faTests(app, t) {
  t.test('Two-Factor Authentication Suite', async t => {
    // Register
    let res = await registerResponse(app, {
      username: 'alice2fa',
      email:    'alice2fa@example.com',
      password: 'strongpass'
    });
    t.equal(res.statusCode, 201, 'POST /register → 201');
    const { id } = res.json().user;

    // Login normally
    res = await loginResponse(app, {
      username: 'alice2fa',
      password: 'strongpass'
    });
    t.equal(res.statusCode, 200, 'POST /login without 2FA → 200');
    const jwt1 = res.json().token;

    // GET /api/2fa/setup
    res = await setup2faResponse(app, jwt1);
    t.equal(res.statusCode, 200, 'GET /api/2fa/setup → 200');
    t.match(res.json().qrDataUrl, /^data:image\/png;base64,/, 'returns QR data-URL');

    // Grab secret & generate TOTP
    const { two_fa_secret } = db
      .prepare('SELECT two_fa_secret FROM users WHERE id = ?')
      .get(id);
    t.ok(two_fa_secret, 'Secret stored in DB');
    const token = speakeasy.totp({ secret: two_fa_secret, encoding: 'base32' });

    // POST /api/2fa/verify
    res = await verify2faResponse(app, jwt1, { token });
    t.equal(res.statusCode, 200, 'POST /api/2fa/verify → 200');
    t.equal(res.json().message, '2FA enabled');

    // Confirm flag on GET /users/:id
    res = await getUserResponse(app, id);
    t.equal(res.json().two_fa_enabled, true, 'two_fa_enabled is true');

    // Login now returns 206
    res = await loginResponse(app, {
      username: 'alice2fa',
      password: 'strongpass'
    });
    t.equal(res.statusCode, 206, 'POST /login with 2FA → 206');
    t.equal(res.json().message, 'Two-factor authentication required');
    const userId = res.json().userId;

    // Login with incorrect 2FA code
    const code3 = speakeasy.totp({ secret: two_fa_secret, encoding: 'base32', counter: 1 });
    res = await login2faResponse(app, { userId, code: code3 });
    t.equal(res.statusCode, 400, 'POST /login/2fa with wrong code → 400');
    t.equal(res.json().error, 'Invalid 2FA code');

    // POST /login/2fa
    const code2 = speakeasy.totp({ secret: two_fa_secret, encoding: 'base32' });
    res = await login2faResponse(app, { userId, code: code2 });
    t.equal(res.statusCode, 200, 'POST /login/2fa → 200');
    t.ok(res.json().token, 'JWT returned');

    // DELETE /api/2fa
    const jwt2 = res.json().token;
    res = await disable2faResponse(app, jwt2);
    t.equal(res.statusCode, 200, 'DELETE /api/2fa → 200');
    t.equal(res.json().message, '2FA disabled');

    // Final normal login
    res = await loginResponse(app, {
      username: 'alice2fa',
      password: 'strongpass'
    });
    t.equal(res.statusCode, 200, 'POST /login after disabling → 200');
    t.same(Object.keys(res.json()), ['token','username'], 'returns token & username');
  });
}
