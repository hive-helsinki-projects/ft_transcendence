import matchHistoryController from '../controllers/matchHistoryController.js';
import { getMatchHistoriesOpts, getMatchHistoryOpts, postMatchHistoryOpts, putMatchHistoryOpts, deleteMatchHistoryOpts } from '../models/matchHistorySchemas.js';

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

    // Update a match history players scores and winners
    fastify.put('/match-histories/:id', {
        ...putMatchHistoryOpts,
        onRequest: [fastify.jwtAuth],
        handler: matchHistoryController.updateMatchHistory
    });

    // Delete a match history
    fastify.delete('/match-histories/:id', {
        ...deleteMatchHistoryOpts,
        onRequest: [fastify.jwtAuth],
        handler: matchHistoryController.deleteMatchHistory
    });
}

export default matchHistoryRoutes;
