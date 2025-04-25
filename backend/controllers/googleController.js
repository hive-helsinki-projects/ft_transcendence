// ビジネスロジックやデータの操作を実行し、レスポンスを返す。
// リクエストに対する具体的な処理（データベース操作、外部APIとの通信、エラー処理など）を含む。 

import { OAuth2Client } from 'google-auth-library';

async function verifyGoogleToken(idToken) {
    const client = await new OAuth2Client('847383291975-9ten21d8j1vf3m2m1kod2i2js9c28o6e.apps.googleusercontent.com');
    const ticket = await client.verifyIdToken({
        idToken,
        audience: '847383291975-9ten21d8j1vf3m2m1kod2i2js9c28o6e.apps.googleusercontent.com'
    });

    const payload = ticket.getPayload();
    console.log("HERE IS THE BACKEND: ", payload);
    return payload;
}

export default verifyGoogleToken;