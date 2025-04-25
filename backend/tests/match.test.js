import { loginResponse } from "./utils/auth.helpers.js";
import {
    getMatchHistoriesResponse,
    getMatchHistoryResponse,
    createMatchHistoryResponse,
    updateMatchHistoryResponse,
    deleteMatchHistoryResponse
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

        t.test('PUT /match-histories/:id returns 403 when unauthorized', async (t) => {
            response = await updateMatchHistoryResponse(app, authSecondToken, 1, {
                players: [
                    { player_id: 1, score: 5 },
                    { player_id: 2, score: 2 },
                ],
                winner_id: 1,
            })
            t.equal(response.statusCode, 403, 'Status code 403');
            t.equal(response.json().error, 'Unauthorized to update match-history or match not found');
        })

        t.test('PUT /match-histories/:id returns 403 when match not found', async (t) => {
            response = await updateMatchHistoryResponse(app, authToken, 100, {
                players: [
                    { player_id: 1, score: 5 },
                    { player_id: 2, score: 2 },
                ],
                winner_id: 1,
            })
            t.equal(response.statusCode, 403, 'Status code 403');
            t.equal(response.json().error, 'Unauthorized to update match-history or match not found');
        })

        t.test('PUT /match-histories/:id returns 400 when missing score', async (t) => {
            response = await updateMatchHistoryResponse(app, authToken, 1, {
                players: [
                    { player_id: 1, score: 2 },
                    { player_id: 2 },
                ],
                winner_id: 1,
            })
            t.equal(response.statusCode, 400, 'Status code 400');
            t.equal(response.json().error, 'Bad Request');
        })

        t.test('PUT /match-histories/:id returns 404 when player not in match', async (t) => {
            response = await updateMatchHistoryResponse(app, authToken, 1, {
                players: [
                    { player_id: 1, score: 2 },
                    { player_id: 4, score: 3 },
                ],
                winner_id: 1,
            })
            t.equal(response.statusCode, 404, 'Status code 404');
            t.equal(response.json().error, 'Player not found in this match');
        })

        t.test('PUT /match-histories/:id returns 404 when winner not a player', async (t) => {
            response = await updateMatchHistoryResponse(app, authToken, 1, {
                players: [
                    { player_id: 1, score: 2 },
                    { player_id: 2, score: 3 },
                ],
                winner_id: 4,
            })
            t.equal(response.statusCode, 400, 'Status code 400');
            t.equal(response.json().error, 'Winner must be part of the players list');
        })

        t.test('PUT /match-histories/:id returns 200 on success', async (t) => {
            response = await updateMatchHistoryResponse(app, authToken, 1, {
                players: [
                    { player_id: 1, score: 2 },
                    { player_id: 2, score: 3 },
                ],
                winner_id: 2,
            })
            t.equal(response.statusCode, 200, 'Status code 200');
            t.equal(response.json().message, 'Successfully updated match-history');

            response = await getMatchHistoryResponse(app, authToken, 1);
            t.same(response.json(), {
                id: 1,
                type: '1v1',
                tournament_id: null,
                date: response.json().date,
                round: null,
                winner_id: 2,
                players: [ 
                    { player_id: 1, score: 2 }, 
                    { player_id: 2, score: 3 } 
                ]
            })
        })

        t.test('DELETE /match-histories/:id returns 404 when unauthoritized', async (t) => {
            response = await deleteMatchHistoryResponse(app, authSecondToken, 1);
            t.equal(response.statusCode, 404, 'Status code 404');
            t.equal(response.json().error, 'Match-history not found or user not authortized to delete this player');
        })

        t.test('DELETE /match-histories/:id returns 404 when match does not exist', async (t) => {
            response = await deleteMatchHistoryResponse(app, authToken, 100);
            t.equal(response.statusCode, 404, 'Status code 404');
            t.equal(response.json().error, 'Match-history not found or user not authortized to delete this player');
        })

        t.test('DELETE /match-histories/:id returns 200 on success', async (t) => {
            response = await deleteMatchHistoryResponse(app, authToken, 1);
            t.equal(response.statusCode, 200, 'Status code 200');
            t.equal(response.json().message, 'Succesfully deleted match-history');
        })

    })
}

export default runMatchHistoryTests;