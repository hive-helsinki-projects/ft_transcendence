import db from '../models/database.js';
import { OAuth2Client } from 'google-auth-library';
import axios from 'axios'

async function verifyGoogleToken(idToken) {
    // const client = await new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    return payload;
}

const loginGoogleSignin = async (req, reply) => {
    const { code } = req.body;

    const params = new URLSearchParams();
    params.append('code', code);
    params.append('client_id', process.env.GOOGLE_CLIENT_ID);
    params.append('client_secret', process.env.GOOGLE_CLIENT_SECRET);
    params.append('redirect_uri', process.env.GOOGLE_REDIRECT_URI);
    params.append('grant_type', 'authorization_code');

    try {
        // Verify the Google token and get user info
        console.log('Received code:', code);
        const tokenRes = await axios.post(
            'https://oauth2.googleapis.com/token',
            params.toString(),                        // <-- form-urlencoded
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        const { id_token } = tokenRes.data;
        if (!id_token) {
            return reply.code(400).send({ error: 'IDトークンの取得に失敗しました' });
        }
        const googleUser = await verifyGoogleToken(id_token);
        let user = db.prepare(`SELECT * FROM users WHERE email = ?`).get(googleUser.email);

        // If user doesn't exist, try to register them
        if (!user) {
            // Check if username (given_name) is already taken
            const usernameTaken = db.prepare(`SELECT * FROM users WHERE username = ?`).get(googleUser.given_name);

            if (usernameTaken) {
                // If taken, fallback to using email as username
                db.prepare(`INSERT INTO users (username, email) VALUES (?, ?)`)
                    .run(googleUser.email, googleUser.email);
            } else {
                // Use given_name as username
                db.prepare(`INSERT INTO users (username, email) VALUES (?, ?)`)
                    .run(googleUser.given_name, googleUser.email);
            }
        }

        // Fetch the user again after insertion
        user = db.prepare(`SELECT * FROM users WHERE email = ?`).get(googleUser.email);
        if (!user) {
            return reply.code(401).send({ error: 'Google sign-in failed to create user' });
        }

        // Generate JWT token
        const userForToken = {
            username: user.username,
            id: user.id,
        };
        const jwtToken = await reply.jwtSign(userForToken, { expiresIn: '1h' });

        // Update online status if it's not already true
        db.prepare(`
            UPDATE users
            SET online_status = TRUE
            WHERE id = ? AND online_status = FALSE
        `).run(user.id);

        // Respond with the token and username
        return reply.send({
            message: 'Verified',
            user: { token: jwtToken, username: user.username, id: user.id },
        });

    } catch (error) {
        console.error('Google sign-in error:', error);
        reply.code(400).send({ message: 'Failed verification' });
    }
};

export default loginGoogleSignin;
