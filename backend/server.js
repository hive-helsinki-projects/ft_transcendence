import buildApp from './app.js'

const fastify = buildApp();

// Start the server
const start = async () => {
  try {
    fastify.listen({ port: process.env.PORT || 3001, host: '0.0.0.0' });
    fastify.log.info(`🚀 Server running on http://localhost:${process.env.PORT || 3001}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
