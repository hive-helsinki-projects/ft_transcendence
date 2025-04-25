// リクエストを受け取り、どのコントローラーハンドラーを呼び出すかを決定する。
// ルートの定義と、そのルートに対応するコントローラー関数を関連付ける。

import verifyGoogleToken from '../controllers/googleController.js';

async function googleRoutes(fastify, options) {
    console.log("Hi from googleRoutes fucntion"); // for debugging

    fastify.post('/api/auth/google', async (request, reply) => {
        const { token } = request.body;
        console.log('we recieved this token', token);

        try {
            const user = await verifyGoogleToken(token);
            console.log(user);

            // CREATE A USER WITH INFORMATION FROM THE GOOGLE (EMAIL, USERNAME); LINE 69 IN AUTHCONTROLLER
            // OR IF USER EXIST. SIGN IN AND SEND BACK THE TOKEN.

            // MAKE A TOKEN TO SEND BACK TO FRONTEND. AUTHCONTROLLER.JS LINE 18-34

            // SEND BACK USERNAME AND TOKEN TO FRONTEND
            reply.send({
                message: 'Verified',
                user: user,
            });
        } catch (error) {
            console.log(error);
            reply.code(400).send({ message: 'Failed verification' });
        }
    });
}

export default googleRoutes;