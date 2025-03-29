import Fastify from 'fastify';
import dotenv from 'dotenv';
import jwtPlugin from './plugins/jwt-plugin.js';
import loginRoutes from './routes/loginRoutes.js';
import userRoutes from './routes/userRoutes.js';

// Load environment variables
dotenv.config();

// Initialize fastify
const fastify = Fastify({ logger: true });

// Register routes
fastify.register(jwtPlugin);
fastify.register(loginRoutes);
fastify.register(userRoutes);

export default fastify;