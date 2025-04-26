import tournamentController from '../controllers/tournamentController.js';
import { getTournamentsOpts, getTournamentOpts, postTournamentOpts, putTournamentOpts, deleteTournamentOpts } from '../models/tournamentSchemas.js';

function tournamentRoutes(fastify, options) {
    // Get all tournaments
    fastify.get('/tournaments', {
        ...getTournamentsOpts,
        handler: tournamentController.getTournaments
    });

    // Get tournament details
    fastify.get('/tournaments/:id', {
        ...getTournamentOpts,
        handler: tournamentController.getTournament
    });

    // Create a tournament
    fastify.post('/tournaments', {
        ...postTournamentOpts,
        onRequest: [fastify.jwtAuth],
        handler: tournamentController.createTournament
    });

    // Advance a tournament to next round
    fastify.put('/tournaments/:id', {
        ...putTournamentOpts,
        onRequest: [fastify.jwtAuth],
        handler: tournamentController.advanceTournament
    });

     // Delete a match tournament
    fastify.delete('/tournaments/:id', {
        ...deleteTournamentOpts,
        onRequest: [fastify.jwtAuth],
        handler: tournamentController.deleteTournament
    });
}

export default tournamentRoutes;