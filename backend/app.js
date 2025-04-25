import Fastify from 'fastify';
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

// Load environment variables
dotenv.config();

// Initialize fastify HTTPS
const fastify = Fastify({ 
    logger: true,
    https: {
        key: fs.readFileSync(process.env.SSL_KEY),
        cert: fs.readFileSync(process.env.SSL_CERT)
    }});

// register CORS
await fastify.register(fastifyCors, {
    origin: 'http://localhost:5173',
    credentials: true
});

// Register routes
fastify.register(jwtPlugin);
fastify.register(authRoutes);
fastify.register(userRoutes);
fastify.register(playerRoutes);
fastify.register(friendRoutes);
fastify.register(matchHistoryRoutes);
fastify.register(tournamentRoutes);
fastify.register(googleRoutes);

export default fastify;