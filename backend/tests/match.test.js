import { loginResponse } from "./utils/auth.helpers.js";
import {
    getMatchHistoriesResponse,
    getMatchHistoryResponse,
    createMatchHistoryResponse,
    updateMatchHistoryResponse,
    deleteMatchHistoryResponse
} from './utils/match.helpers.js'

// Group of tests for Match-history routes
function runMatchHistoryTests(app, t) {
    // Test login as user `kim` and get token
    t.test('POST `/login` - Login as kim', async (t) => {
        let response = await loginResponse(app, { username: 'kim', password: 'password' });
        const authToken = await response.json().token; // Save token for `kim`

        // Login as user `lumi`
        response = await loginResponse(app, { username: 'lumi', password: 'newpassword' });
        const authSecondToken = await response.json().token; // Save token for `lumi`

        // Test when no match exists for the logged-in user
        t.test('GET `/match-histories` returns 200 with empty array when no matches found for user', async (t) => {
            response = await getMatchHistoriesResponse(app, authToken);
            t.equal(response.statusCode, 200, 'Status code should be 200');
            t.same(response.json(), []); // No matches found, so expect an empty array
        });

        // Test creating match-history with missing player
        t.test('POST `/match-histories` returns 400 when missing one player', async (t) => {
            response = await createMatchHistoryResponse(app, authToken, {
                type: '1v1',
                players: [
                    { player_id: 1 },
                ]
            });
            t.equal(response.statusCode, 400, 'Status code should be 400');
            t.equal(response.json().error, 'Must have 2 players'); // Error: not enough players
        });

        // Test creating match-history with non-existing player
        t.test('POST `/match-histories` returns 500 when player does not exist', async (t) => {
            response = await createMatchHistoryResponse(app, authToken, {
                type: '1v1',
                players: [
                    { player_id: 100 }, // Non-existing player
                    { player_id: 2 },
                ]
            });
            t.equal(response.statusCode, 500, 'Status code should be 500');
            t.equal(response.json().error, 'Failed to create match history');
        });

        // Test creating match-history successfully
        t.test('POST `/match-histories` returns 201 when match is successfully created', async (t) => {
            response = await createMatchHistoryResponse(app, authToken, {
                type: '1v1',
                players: [
                    { player_id: 1 },
                    { player_id: 2 },
                ]
            });
            t.equal(response.statusCode, 201, 'Status code should be 201');
            t.equal(response.json().message, 'Match history created successfully');
        });

        // Test fetching a non-existing match by ID
        t.test('GET `/match-histories/200` returns 404 when match is not found', async (t) => {
            response = await getMatchHistoryResponse(app, authToken, 200);
            t.equal(response.statusCode, 404, 'Status code should be 404');
            t.equal(response.json().error, 'Match not found'); // Match with ID 200 doesn't exist
        });

        // Test fetching a valid match by ID
        t.test('GET `/match-histories/1` returns 200 for an existing match', async (t) => {
            response = await getMatchHistoryResponse(app, authToken, 1);
            t.equal(response.statusCode, 200, 'Status code should be 200');
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
            });
        });

        // Test updating match-history without authorization
        t.test('PUT /match-histories/:id returns 403 when unauthorized to update', async (t) => {
            response = await updateMatchHistoryResponse(app, authSecondToken, 1, {
                players: [
                    { player_id: 1, score: 5 },
                    { player_id: 2, score: 2 },
                ],
                winner_id: 1,
            });
            t.equal(response.statusCode, 403, 'Status code should be 403');
            t.equal(response.json().error, 'Unauthorized to update this match history');
        });

        // Test updating match-history with a non-existing match
        t.test('PUT /match-histories/:id returns 403 when match not found', async (t) => {
            response = await updateMatchHistoryResponse(app, authToken, 100, {
                players: [
                    { player_id: 1, score: 5 },
                    { player_id: 2, score: 2 },
                ],
                winner_id: 1,
            });
            t.equal(response.statusCode, 403, 'Status code should be 403');
            t.equal(response.json().error, 'Unauthorized to update this match history');
        });

        // Test updating match-history with missing score
        t.test('PUT /match-histories/:id returns 400 when score is missing', async (t) => {
            response = await updateMatchHistoryResponse(app, authToken, 1, {
                players: [
                    { player_id: 1, score: 2 },
                    { player_id: 2 }, // Missing score
                ],
                winner_id: 1,
            });
            t.equal(response.statusCode, 400, 'Status code should be 400');
            t.equal(response.json().error, 'Bad Request');
        });

        // Test updating match-history with a player not in the match
        t.test('PUT /match-histories/:id returns 404 when player not in match', async (t) => {
            response = await updateMatchHistoryResponse(app, authToken, 1, {
                players: [
                    { player_id: 1, score: 2 },
                    { player_id: 4, score: 3 }, // Player 4 is not part of this match
                ],
                winner_id: 1,
            });
            t.equal(response.statusCode, 404, 'Status code should be 404');
            t.equal(response.json().error, 'Player not found in this match');
        });

        // Test updating match-history with an invalid winner
        t.test('PUT /match-histories/:id returns 400 when winner is not part of the players', async (t) => {
            response = await updateMatchHistoryResponse(app, authToken, 1, {
                players: [
                    { player_id: 1, score: 2 },
                    { player_id: 2, score: 3 },
                ],
                winner_id: 4, // Player 4 is not in the match
            });
            t.equal(response.statusCode, 400, 'Status code should be 400');
            t.equal(response.json().error, 'Winner must be part of the players list');
        });

        // Test updating match-history successfully
        t.test('PUT /match-histories/:id returns 200 on success', async (t) => {
            response = await updateMatchHistoryResponse(app, authToken, 1, {
                players: [
                    { player_id: 1, score: 2 },
                    { player_id: 2, score: 3 },
                ],
                winner_id: 2,
            });
            t.equal(response.statusCode, 200, 'Status code should be 200');
            t.equal(response.json().message, 'Match history updated successfully');

            // Verify updated match-history
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
            });
        });

        // Test deleting match-history with unauthorized user
        t.test('DELETE /match-histories/:id returns 404 when unauthorized', async (t) => {
            response = await deleteMatchHistoryResponse(app, authSecondToken, 1);
            t.equal(response.statusCode, 404, 'Status code should be 404');
            t.equal(response.json().error, 'Match history not found or user not authorized');
        });

        // Test deleting non-existing match-history
        t.test('DELETE /match-histories/:id returns 404 when match does not exist', async (t) => {
            response = await deleteMatchHistoryResponse(app, authToken, 100);
            t.equal(response.statusCode, 404, 'Status code should be 404');
            t.equal(response.json().error, 'Match history not found or user not authorized');
        });

        // Test successfully deleting match-history
        t.test('DELETE /match-histories/:id returns 200 on success', async (t) => {
            response = await deleteMatchHistoryResponse(app, authToken, 1);
            t.equal(response.statusCode, 200, 'Status code should be 200');
            t.equal(response.json().message, 'Match history deleted successfully');
        });
    });
}

export default runMatchHistoryTests;
