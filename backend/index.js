const Fastify = require('fastify')
const fastify = Fastify({
  logger: true
})

fastify.get('/', async function handler (request, reply) {
	return { hello: 'world' }
})

fastify.listen({ port: 3001, host: '0.0.0.0' }, (err, address) => {
	if (err) {
		fastify.log.error(err);
		process.exit(1);
	}
	fastify.log.info(`Server listening at ${address}`);
});