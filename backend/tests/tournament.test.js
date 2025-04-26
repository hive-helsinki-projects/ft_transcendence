import { loginResponse } from "./utils/auth.helpers.js";
import { createPlayerResponse } from "./utils/player.helpers.js";
import {
    getTournamentsResponse,
    getTournamentResponse,
    createTournamentResponse,
    advanceTournamentResponse,
    deleteTournamentResponse
} from './utils/tournament.helpers.js';
import { updateMatchHistoryResponse } from './utils/match.helpers.js';
import db from '../models/database.js';

function runTournamentTests(app, t) {
    // Test when no tournament exist
    t.test('GET `/tournaments` returns 404 when no tournament exist', async (t) => {
        const response = await getTournamentsResponse(app);
        t.equal(response.statusCode, 404, 'Status code 404');
        t.same(response.json().error, 'No tournaments found');
    });

    // Test login as user `kim` and get token
    t.test('POST `/login` - Login as kim', async (t) => {
        let response = await loginResponse(app, { username: 'kim', password: 'password' });
        const authToken = await response.json().token; // Save token for `kim`

        response = await loginResponse(app, { username: 'lumi', password: 'newpassword' });
        const authSecondToken = await response.json().token; // Save token for `lumi`

        // Clear the database
        db.prepare(`DELETE FROM 'players'`).run();
        db.prepare(`DELETE FROM sqlite_sequence WHERE name='players'`).run();
        db.prepare(`DELETE FROM 'match_history'`).run();
        db.prepare(`DELETE FROM sqlite_sequence WHERE name='match_history'`).run();

        // Create players
        for (let i = 1; i < 9; i++) {
            response = await createPlayerResponse(app, authToken, {
                display_name: `Player${i}`,
            });
        }
        t.equal(response.statusCode, 201);

        // Test creating tournament with 1 player
        t.test('POST `/tournaments` returns 400 when creating tournament with 1 player', async (t) => {
            response = await createTournamentResponse(app, authToken, {
                name: 'T1',
                player_ids: [1]
            });
            t.equal(response.statusCode, 400, 'Status code 400');
            t.equal(response.json().message, 'body/player_ids must NOT have fewer than 3 items');
        });

        // Test creating tournament with 2 players
        t.test('POST `/tournaments` returns 400 when creating tournament with 2 players', async (t) => {
            response = await createTournamentResponse(app, authToken, {
                name: 'T1',
                player_ids: [1, 2]
            });
            t.equal(response.statusCode, 400, 'Status code 400');
            t.equal(response.json().message, 'body/player_ids must NOT have fewer than 3 items');
        });

        // Test creating tournament with a non-existing player
        t.test('POST `/tournaments` returns 400 when creating tournament with invalid player', async (t) => {
            response = await createTournamentResponse(app, authToken, {
                name: 'T1',
                player_ids: [1, 2, 100]
            });
            t.equal(response.statusCode, 400, 'Status code 400');
            t.equal(response.json().error, 'Player with ID 100 does not exist');
        });

        // Test creating tournament with missing players
        t.test('POST `/tournaments` returns 400 when missing player_ids', async (t) => {
            response = await createTournamentResponse(app, authToken, {
                name: 'T1',
            });
            t.equal(response.statusCode, 400, 'Status code 400');
            t.equal(response.json().error, 'Bad Request');
        });

        // Test creating tournament with missing name
        t.test('POST `/tournaments` returns 400 when missing name', async (t) => {
            response = await createTournamentResponse(app, authToken, {
                player_ids: [1, 2, 3]
            });
            t.equal(response.statusCode, 400, 'Status code 400');
            t.equal(response.json().error, 'Bad Request');
        });

        // Test creating tournament with 3 players
        t.test('POST `/tournaments` returns 200 when creating tournament with 3 players', async (t) => {
            response = await createTournamentResponse(app, authToken, {
                name: 'T1',
                player_ids: [1, 2, 3]
            });
            t.equal(response.statusCode, 200, 'Status code 200');
            const data = response.json();

            let p1 = data.item.matches[0].players[0].player_id;
            let p2 = data.item.matches[0].players[1].player_id;

            t.equal(data.message, 'Successfully created tournament');
            t.same(data.item, {
                tournament_id: 1,
                name: 'T1',
                status: 'pending',
                current_round: 0,
                winner_id: null,
                matches: [
                    {
                        match_id: 1,
                        type: 'tournament',
                        round: 0,
                        date: data.item.matches[0].date,
                        players: [
                            { player_id: p1, score: 0 },
                            { player_id: p2, score: 0 }
                        ]
                    },
                    {
                        match_id: 2,
                        type: 'tournament',
                        round: 0,
                        date: data.item.matches[1].date,
                        players: [
                            { player_id: data.item.matches[1].players[0].player_id, score: 0 }
                        ]
                    }
                ]
            });

            // Test advancing tournament returns 404 when match not played
            t.test('PUT `/tournaments/:id` returns 404 when match not played', async (t) => {
                response = await advanceTournamentResponse(app, authToken, 1);
                t.equal(response.statusCode, 404, 'Status code 404');
                t.equal(response.json().error, 'No winner found for match 1');
            });

            // Play match 1 and advance tournament
            t.test('PUT `/tournaments/:id` returns 200 on success', async (t) => {
                response = await updateMatchHistoryResponse(app, authToken, 1, {
                    players: [
                        { player_id: p1, score: 2 },
                        { player_id: p2, score: 5 },
                    ],
                    winner_id: p2,
                });
                t.equal(response.statusCode, 200, 'Status code 200');

                response = await advanceTournamentResponse(app, authToken, 1);
                const data = response.json();
                p1 = data.item.matches[0].players[0].player_id;
                p2 = data.item.matches[0].players[1].player_id;

                t.equal(response.statusCode, 200, 'Status code 200');
                t.equal(data.message, 'Successfully advanced tournament');
                t.same(data.item, {
                    matches: [{
                        match_id: 3,
                        players: [
                            { player_id: p1, score: 0 },
                            { player_id: p2, score: 0 }
                        ],
                        date: data.item.matches[0].date,
                        round: 1
                    }]
                });

                // Test unauthorized advance
                t.test('PUT `/tournaments/:id` returns 404 unauthorized', async (t) => {
                    response = await advanceTournamentResponse(app, authSecondToken, 1);
                    t.equal(response.statusCode, 404, 'Status code 404');
                    t.equal(response.json().error, 'Tournament not found or unauthorized');
                });

                // Finish the tournament
                t.test('PUT `/tournaments/:id` returns 200 on tournament finish', async (t) => {
                    response = await updateMatchHistoryResponse(app, authToken, 3, {
                        players: [
                            { player_id: p1, score: 2 },
                            { player_id: p2, score: 1 },
                        ],
                        winner_id: p1,
                    });
                    t.equal(response.statusCode, 200, 'Status code 200');

                    response = await advanceTournamentResponse(app, authToken, 1);
                    t.equal(response.statusCode, 200, 'Status code 200');
                    t.equal(response.json().message, 'Successfully finished tournament');
                });

                // Try to advance after finished
                t.test('PUT `/tournaments/:id` returns 400 when already finished', async (t) => {
                    response = await advanceTournamentResponse(app, authToken, 1);
                    t.equal(response.statusCode, 400, 'Status code 400');
                    t.equal(response.json().error, 'Tournament already finished');
                });
            });
        });

        // Duplicate tournament name
        t.test('POST `/tournaments` returns 400 on duplicate name', async (t) => {
            response = await createTournamentResponse(app, authToken, {
                name: 'T1',
                player_ids: [1, 2, 3]
            });
            t.equal(response.statusCode, 400, 'Status code 400');
            t.equal(response.json().error, 'Tournament name is already taken');
        });

        // Invalid tournament id
        t.test('GET `/tournaments/:id` returns 404 if tournament not found', async (t) => {
            response = await getTournamentResponse(app, 10);
            t.equal(response.statusCode, 404, 'Status code 404');
            t.equal(response.json().error, 'Tournament not found');
        });

        // Successfully get tournament
        t.test('GET `/tournaments/:id` returns 200 on success', async (t) => {
            response = await getTournamentResponse(app, 1);
            t.equal(response.statusCode, 200, 'Status code 200');
        });

        // Unauthorized delete
        t.test('DELETE `/tournaments/:id` returns 404 unauthorized', async (t) => {
            response = await deleteTournamentResponse(app, authSecondToken, 1);
            t.equal(response.statusCode, 404, 'Status code 404');
            t.equal(response.json().error, 'Tournament not found or unauthorized');
        });

        // Successfully delete tournament
        t.test('DELETE `/tournaments/:id` returns 200 on success', async (t) => {
            response = await deleteTournamentResponse(app, authToken, 1);
            t.equal(response.statusCode, 200, 'Status code 200');
            t.equal(response.json().message, 'Tournament deleted successfully');
        });
    });
}

export default runTournamentTests;
