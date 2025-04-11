import tournamentController from '../controllers/tournamentController.js';
import { getTournamentsOpts, getTournamentOpts, postTournamentOpts } from '../models/tournamentSchemas.js';

function tournamentRoutes(fastify, options) {
    // // Get all tournaments
    // fastify.get('/tournaments', {
    //     ...getTournamentsOpts,
    //     handler: tournamentController.getTournaments
    // });

    // Get tournament details
    fastify.get('/tournaments/:id', {
        ...getTournamentOpts,
        handler: tournamentController.getTournament
    });

    // Create a tournament
    fastify.post('/tournaments', {
        ...postTournamentOpts,
        // onRequest: [fastify.jwtAuth],
        handler: tournamentController.createTournament
    });

    // // Update a tournament
    // fastify.put('/tournaments/:id', {
    //     onRequest: [fastify.jwtAuth],
    //     handler: tournamentController.updateTournament
    // });
}

export default tournamentRoutes;