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
            }
        }
    });

    fastify.register(swaggerUi, {
        routePrefix: '/docs',
    });
    
    // Register routes
    fastify.register(jwtPlugin);
    fastify.register(authRoutes);
    fastify.register(userRoutes);
    fastify.register(playerRoutes);
    fastify.register(friendRoutes);
    fastify.register(matchHistoryRoutes);
    fastify.register(tournamentRoutes);
    
    return fastify;
}

export default buildApp;;