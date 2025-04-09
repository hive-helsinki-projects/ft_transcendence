import matchHistoryController from '../controllers/matchController.js';
import { getMatchHistoriesOpts, getMatchHistoryOpts, postMatchHistoryOpts } from '../models/matchHistorySchemas.js';

function matchHistoryRoutes(fastify, options) {
    // Get match history for current user
    // GET /match-history?type=1v1
    // GET /match-history?type=multiplayer
    fastify.get('/match-histories', {
        ...getMatchHistoriesOpts,
        onRequest: [fastify.jwtAuth],
        handler: matchHistoryController.getMatchHistories
    });
    
    // Get match details
    fastify.get('/match-histories/:id', {
        ...getMatchHistoryOpts,
        onRequest: [fastify.jwtAuth],
        handler: matchHistoryController.getMatchHistory
    });
    
    // Create a match
    fastify.post('/match-histories', {
        ...postMatchHistoryOpts,
        onRequest: [fastify.jwtAuth],
        handler: matchHistoryController.createMatchHistory
    });
}

export default matchHistoryRoutes;
