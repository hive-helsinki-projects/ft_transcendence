import fp from 'fastify-plugin';
import fastifyJwt from '@fastify/jwt';

export default fp(async function (fastify, options) {
	fastify.register(fastifyJwt, {
		secret: process.env.JWT_SECRET
	})
	
	fastify.decorate("jwtAuth", async function (req, reply) {
		try {
			await req.jwtVerify();
		} catch (error) {
			reply.code(401).send({ error: "Unauthorized" })
		}
	})
})