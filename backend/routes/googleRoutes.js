// リクエストを受け取り、どのコントローラーハンドラーを呼び出すかを決定する。
// ルートの定義と、そのルートに対応するコントローラー関数を関連付ける。

import db from '../models/database.js';
import bcrypt from 'bcryptjs';

import verifyGoogleToken from '../controllers/googleController.js';

async function googleRoutes(fastify, options) {
    console.log("Hi from googleRoutes fucntion"); // for debugging

    fastify.post('/api/auth/google', async (request, reply) => {
        let { token } = request.body;
        console.log('we recieved this token', token);

        try {
            let user = await verifyGoogleToken(token);
            console.log("HERE IS THE USER INFO:", user);

            // CREATE A USER WITH INFORMATION FROM THE GOOGLE (EMAIL, USERNAME); LINE 69 IN AUTHCONTROLLER
            const userExist = db.prepare(`SELECT * FROM users WHERE email = ?`).get(user.email);
            if (!userExist) {
                const result = db.prepare(`INSERT INTO users (username, email) VALUES (?, ?)`).run(user.given_name, user.email);
                console.log('result:', result);
            }

            user = db.prepare(`SELECT * FROM users WHERE email = ? AND username = ?`).get(user.email, user.given_name);
            if (!user) {
                return reply.code(401).send({error: 'Google signin failed to create user'})
            }

            const userForToken = {
                username: user.username,
                id: user.id,
            };
            // OR IF USER EXIST. SIGN IN AND SEND BACK THE TOKEN.

            token = await reply.jwtSign(userForToken, { expiresIn: '1h'});
            // MAKE A TOKEN TO SEND BACK TO FRONTEND. AUTHCONTROLLER.JS LINE 18-34

            db.prepare(`UPDATE users
                SET online_status = TRUE
                WHERE id = ?
                AND online_status = FALSE
                `).run(user.id);
            
                console.log("HERE IS TOKEN:", token)
            // SEND BACK USERNAME AND TOKEN TO FRONTEND
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