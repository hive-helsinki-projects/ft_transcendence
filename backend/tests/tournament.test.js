import { loginResponse } from "./utils/auth.helpers.js";
import {
    getTournamentsResponse,
    getTournamentResponse,
    createTournamentResponse
} from './utils/tournament.helpers.js'

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

        // Test creating tournament with 1 player
        t.test('POST `/tournaments` returns 400 when creating tournament with 1 player', async (t) => {
            response = await createTournamentResponse(app, authToken, {
                name: 'T1',
                player_ids: [1]
            });
            t.equal(response.statusCode, 400, 'Status code should be 400');
            t.equal(response.json().message, 'body/player_ids must NOT have fewer than 3 items');
        });

        // Test creating tournament with 2 player
        t.test('POST `/tournaments` returns 400 when creating tournament with 2 player', async (t) => {
            response = await createTournamentResponse(app, authToken, {
                name: 'T1',
                player_ids: [1, 2]
            });
            t.equal(response.statusCode, 400, 'Status code should be 400');
            t.equal(response.json().message, 'body/player_ids must NOT have fewer than 3 items');
        });

        // Test creating tournament with 2 player
        t.test('POST `/tournaments` returns 400 when creating tournament with invalid player', async (t) => {
            response = await createTournamentResponse(app, authToken, {
                name: 'T1',
                player_ids: [1, 2, 100]
            });
            t.equal(response.statusCode, 400, 'Status code should be 400');
            t.equal(response.json().error, `Player with ID 100 does not exist`);
        });

        // Test creating tournament with no players
        t.test('POST `/tournaments` returns 500 when creating tournament when missing players', async (t) => {
            response = await createTournamentResponse(app, authToken, {
                name: 'T1',
            });
            t.equal(response.statusCode, 400, 'Status code should be 400');
            t.equal(response.json().error, `Bad Request`);
        });

        // Test creating tournament with no name
        t.test('POST `/tournaments` returns 500 when creating tournament when missing players', async (t) => {
            response = await createTournamentResponse(app, authToken, {
                player_ids: [1, 2, 4]
            });
            t.equal(response.statusCode, 400, 'Status code should be 400');
            t.equal(response.json().error, `Bad Request`);
        });





    })
}

export default runTournamentTests;