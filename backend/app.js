import Fastify from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import dotenv from 'dotenv';
import fs from 'fs';
import jwtPlugin from './plugins/jwt-plugin.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import playerRoutes from './routes/playerRoutes.js';
import friendRoutes from './routes/friendRoutes.js';
import matchHistoryRoutes from './routes/matchHistoryRoute.js'
import tournamentRoutes from './routes/tournamentRoute.js';
import googleRoutes from './routes/googleRoutes.js';
import fastifyCors from '@fastify/cors';
import twoFaRoutes from './routes/twoFactorRoutes.js';

// Load environment variables
dotenv.config();

// Initialize fastify HTTPS
function buildApp() {
    const fastify = Fastify({
        logger: true,
        https: {
            key: fs.readFileSync(process.env.SSL_KEY),
            cert: fs.readFileSync(process.env.SSL_CERT)
        }});

        fastify.register(swagger, {
            openapi: {
                info: {
                    title: 'Ping Pong API',
                    description: 'API documentation',
                    version: '1.0.0'
                },
                components: {
                    securitySchemes: {
                        bearerAuth: {
                            type: 'http',
                            scheme: 'bearer',
                            bearerFormat: 'JWT'
                        }
                    }
                },
            }
        });

    // https://localhost:3001/docs
    fastify.register(swaggerUi, {
        routePrefix: '/docs',
    });

    // register CORS
    fastify.register(fastifyCors, {
        origin: 'https://localhost:5173',
        credentials: true,
        methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    });

    // Register routes
    fastify.register(jwtPlugin);
    fastify.register(authRoutes);
    // fastify.register(twoFaRoutes);
    fastify.register(twoFaRoutes, { prefix: '/api' });
    fastify.register(userRoutes);
    fastify.register(playerRoutes);
    fastify.register(friendRoutes);
    fastify.register(matchHistoryRoutes);
    fastify.register(tournamentRoutes);
    fastify.register(googleRoutes);

    return fastify;
}

export default buildApp;
