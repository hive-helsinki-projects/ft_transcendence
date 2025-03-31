<<<<<<< HEAD
import Fastify from 'fastify';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const fastify = Fastify({ logger: true });

// Basic route
fastify.get('/', async (request, reply) => {
  return { message: 'Fastify is running!' };
});
=======
import fastify from './app.js'
>>>>>>> origin/main

// Start the server
const start = async () => {
  try {
<<<<<<< HEAD
    await fastify.listen({ port: process.env.PORT || 3001 });
    console.log(`🚀 Server running on http://localhost:${process.env.PORT || 3001}`);
=======
    await fastify.listen({ port: process.env.PORT || 3001, host: '0.0.0.0' });
    fastify.log.info(`🚀 Server running on http://localhost:${process.env.PORT || 3001}`);
>>>>>>> origin/main
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
