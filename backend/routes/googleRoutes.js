import loginGoogleSignin from '../controllers/googleController.js';
import { postGoogleLoginOpts } from '../models/googleSchemas.js';

function googleRoutes(fastify, options) {
    // Login with google sign-in
    fastify.post('/api/auth/google', {
        ...postGoogleLoginOpts,
        handler: loginGoogleSignin
    });
}

export default googleRoutes;