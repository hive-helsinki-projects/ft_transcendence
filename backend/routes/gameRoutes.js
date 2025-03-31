import gameController from '../controllers/gameController.js';

async function gameRoutes(fastify, options) {
  fastify.get('/ws', { websocket: true }, gameController.handleWebSocket);
}

export default gameRoutes;
