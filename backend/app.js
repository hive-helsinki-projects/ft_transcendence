import Fastify from 'fastify';
import dotenv from 'dotenv';
import jwtPlugin from './plugins/jwt-plugin.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import playerRoutes from './routes/playerRoutes.js';
import friendRoutes from './routes/friendRoutes.js';

// Load environment variables
dotenv.config();

// Initialize fastify
const fastify = Fastify({ logger: true });

// Register routes
fastify.register(jwtPlugin);
fastify.register(authRoutes);
fastify.register(userRoutes);
fastify.register(playerRoutes);
fastify.register(friendRoutes);

export default fastify;