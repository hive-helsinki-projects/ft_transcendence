import Fastify from 'fastify';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const fastify = Fastify({ logger: true });

// Basic route
fastify.get('/', async (request, reply) => {
  return { message: 'Fastify is running!' };
});

// Start the server
const start = async () => {
  try {
    await fastify.listen({ port: process.env.PORT || 3001 });
    console.log(`🚀 Server running on http://localhost:${process.env.PORT || 3001}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
