import db from '../models/database.js';
import bcrypt from 'bcryptjs';

import verifyGoogleToken from '../controllers/googleController.js';

async function googleRoutes(fastify, options) {

    fastify.post('/api/auth/google', async (request, reply) => {
        let { token } = request.body;

        try {
            let user = await verifyGoogleToken(token);

            const userExist = db.prepare(`SELECT * FROM users WHERE email = ?`).get(user.email);
            if (!userExist) {
                db.prepare(`INSERT INTO users (username, email) VALUES (?, ?)`).run(user.given_name, user.email);
            }

            user = db.prepare(`SELECT * FROM users WHERE email = ? AND username = ?`).get(user.email, user.given_name);
            if (!user) {
                return reply.code(401).send({error: 'Google signin failed to create user'})
            }

            const userForToken = {
                username: user.username,
                id: user.id,
            };

            token = await reply.jwtSign(userForToken, { expiresIn: '1h'});

            db.prepare(`UPDATE users
                SET online_status = TRUE
                WHERE id = ?
                AND online_status = FALSE
                `).run(user.id);
            
            return reply.send({
                message: 'Verified',
                user: { token, username: user.username},
            });
        } catch (error) {
            console.log(error);
            reply.code(400).send({ message: 'Failed verification' });
        }
    });
}

export default googleRoutes;