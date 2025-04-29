import loginGoogleSignin from '../controllers/googleController.js';

function googleRoutes(fastify, options) {
    // Login with google sign-in
    fastify.post('/api/auth/google', {
        handler: loginGoogleSignin
    });
}

export default googleRoutes;