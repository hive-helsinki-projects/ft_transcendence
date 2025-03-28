import Fastify from 'fastify';
import dotenv from 'dotenv';
import fastifyJwt from 'fastify-jwt';

// Load environment variables
dotenv.config();

// Initialize fastify
const fastify = Fastify({ logger: true });

fastify.register(fastifyJwt, {
	secret: process.env.JWT_SECRET,
})

// Register routes
await fastify.register(import('./routes/user.routes.js'))
await fastify.register(import('./routes/login.routes.js'))

// Start the server
const start = async () => {
  try {
    await fastify.listen({ port: process.env.PORT || 3001, host: '0.0.0.0' });
    fastify.log.info(`🚀 Server running on http://localhost:${process.env.PORT || 3001}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
