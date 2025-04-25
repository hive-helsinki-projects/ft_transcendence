import { loginResponse } from "./utils/auth.helpers.js";
import { createPlayerResponse } from "./utils/player.helpers.js";
import {
    getTournamentsResponse,
    getTournamentResponse,
    createTournamentResponse
} from './utils/tournament.helpers.js'
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

        db.prepare(`DELETE FROM 'players'`).run();
        db.prepare(`DELETE FROM sqlite_sequence WHERE name='players'`).run();
        db.prepare(`DELETE FROM 'match_history'`).run();
        db.prepare(`DELETE FROM sqlite_sequence WHERE name='match_history'`).run();

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

        // Test creating tournament with 2 player
        t.test('POST `/tournaments` returns 400 when creating tournament with 2 player', async (t) => {
            response = await createTournamentResponse(app, authToken, {
                name: 'T1',
                player_ids: [1, 2]
            });
            t.equal(response.statusCode, 400, 'Status code 400');
            t.equal(response.json().message, 'body/player_ids must NOT have fewer than 3 items');
        });

        // Test creating tournament with non existing player
        t.test('POST `/tournaments` returns 400 when creating tournament with invalid player', async (t) => {
            response = await createTournamentResponse(app, authToken, {
                name: 'T1',
                player_ids: [1, 2, 100]
            });
            t.equal(response.statusCode, 400, 'Status code 400');
            t.equal(response.json().error, `Player with ID 100 does not exist`);
        });

        // Test creating tournament with no players
        t.test('POST `/tournaments` returns 500 when creating tournament when missing players', async (t) => {
            response = await createTournamentResponse(app, authToken, {
                name: 'T1',
            });
            t.equal(response.statusCode, 400, 'Status code 400');
            t.equal(response.json().error, `Bad Request`);
        });

        // Test creating tournament with no name
        t.test('POST `/tournaments` returns 500 when creating tournament with no name', async (t) => {
            response = await createTournamentResponse(app, authToken, {
                player_ids: [1, 2, 3]
            });
            t.equal(response.statusCode, 400, 'Status code 400');
            t.equal(response.json().error, `Bad Request`);
        });

        // Test creating tournament with 3 players
        t.test('POST `/tournaments` returns 200 when creating tournament with 3 players', async (t) => {
            response = await createTournamentResponse(app, authToken, {
                name: 'T1',
                player_ids: [1, 2, 3]
            });
            t.equal(response.statusCode, 200, 'Status code 200');
            const data = response.json();
            t.equal(data.message, 'Successfully created tournament');
            t.same(data.item, {
                tournament_id: 1,
                name: 'T1',
                status: 'pending',
                current_round: 0,
                winner_id: null,
                matches: [ {
                    match_id: 1,
                    type: 'tournament',
                    round: 0,
                    date: data.item.matches[0].date,
                    players: [
                        {
                            player_id: data.item.matches[0].players[0].player_id,
                            score: 0
                        },
                        {
                            player_id: data.item.matches[0].players[1].player_id,
                            score: 0
                        }
                    ]
                }, {
                    match_id: 2,
                    type: 'tournament',
                    round: 0,
                    date: data.item.matches[1].date,
                    players: [
                        {
                            player_id: data.item.matches[1].players[0].player_id,
                            score: 0
                        }
                    ]
                }]
            })
        });

        // Test creating tournament with duplicate name
        t.test('POST `/tournaments` returns 400 when name already taken', async (t) => {
            response = await createTournamentResponse(app, authToken, {
                name: 'T1',
                player_ids: [1, 2, 3]
            });
            t.equal(response.statusCode, 400, 'Status code 400');
            t.equal(response.json().error, 'Tournament name already taken');
        });

        // Test advancing tournament returns 





    })
}

export default runTournamentTests;