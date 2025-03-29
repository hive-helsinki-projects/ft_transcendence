import Fastify from 'fastify';
import dotenv from 'dotenv';
import jwtPlugin from './plugins/jwt-plugin.js';
import userRoutes from './routes/userRoutes.js';
import loginRoutes from './routes/loginRoutes.js';

// Load environment variables
dotenv.config();

// Initialize fastify
const fastify = Fastify({ logger: true });

// Register routes
fastify.register(jwtPlugin);
fastify.register(userRoutes);
fastify.register(loginRoutes);

export default fastify;