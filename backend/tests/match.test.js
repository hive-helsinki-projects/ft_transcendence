import { loginResponse } from "./utils/auth.helpers.js";
import {
    getMatchHistoriesResponse,
    getMatchHistoryResponse,
    createMatchHistoryResponse,
} from './utils/match.helpers.js'

// Group of test for Match-history routes
function runMatchHistoryTests(app, t) {
    t.test('POST `/login`', async (t) => {
        // Login as user `kim` and get token
        let response = await loginResponse(app, { username: 'kim', password: 'password' });
        const authToken = await response.json().token;

        // Login as user `lumi`
        response = await loginResponse(app, { username: 'lumi', password: 'newpassword' });
        const authSecondToken = await response.json().token;

        // Test when no match exist for the user
        t.test('GET `/match-histories` returns 200 empty array when no matches found for user', async (t) => {
            response = await getMatchHistoriesResponse(app, authToken);
            t.equal(response.statusCode, 200, 'Status code 200');
            t.same(response.json(), []);
        });

        t.test('POST `/match-histories` returns 500 when missing one player', async (t) => {
            response = await createMatchHistoryResponse(app, authToken, {
                type: '1v1',
                players: [
                    { player_id: 1 },
                ]
            })
            t.equal(response.statusCode, 400, 'Status code 400');
            t.equal(response.json().error, 'Must have 2 players')
        })

        t.test('POST `/match-histories` returns 500 when player does not exist', async (t) => {
            response = await createMatchHistoryResponse(app, authToken, {
                type: '1v1',
                players: [
                    { player_id: 100 },
                    { player_id: 2 },
                ]
            })
            t.equal(response.statusCode, 500, 'Status code 500');
            t.equal(response.json().error, 'Failed to create a match-history')
        })

        t.test('POST `/match-histories` returns 200 when succesfully created match', async (t) => {
            response = await createMatchHistoryResponse(app, authToken, {
                type: '1v1',
                players: [
                    { player_id: 1 },
                    { player_id: 2 },
                ]
            })
            t.equal(response.statusCode, 200, 'Status code 200');
            t.equal(response.json().message, 'Successfully created match-history')
        })

        t.test('GET `/match-histories/200` returns 404 match not found', async (t) => {
            response = await getMatchHistoryResponse(app, authToken, 200);
            t.equal(response.statusCode, 404, 'Status code 404');
            t.equal(response.json().error, 'Match not found')
        })
        
        t.test('GET `/match-histories/1` returns 500 when unauthoritized', async (t) => {
            response = await getMatchHistoryResponse(app, authSecondToken, 1);
            t.equal(response.statusCode, 500, 'Status code 500');
            t.equal(response.json().error, 'Unauthoritized')
        })

        t.test('GET `/match-histories/1` returns 200', async (t) => {
            response = await getMatchHistoryResponse(app, authToken, 1);
            t.equal(response.statusCode, 200, 'Status code 200');
            t.same(response.json(), {
                id: 1,
                type: '1v1',
                tournament_id: null,
                date: response.json().date,
                round: null,
                winner_id: null,
                players: [ 
                    { player_id: 1, score: 0 }, 
                    { player_id: 2, score: 0 } 
                ]
            })
        })

    })
}

export default runMatchHistoryTests;