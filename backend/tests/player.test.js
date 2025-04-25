import { loginResponse } from "./utils/auth.helpers.js";
import {
    getPlayersResponse,
    getPlayerResponse,
    createPlayerResponse,
    updatePlayerResponse,
    deletePlayerResponse,
} from "./utils/player.helpers.js";

// Test suite for Player-related API routes
function runPlayerTests(app, t) {
    t.test('POST `/login`', async (t) => {
        // Login as user `kim` and get token
        let response = await loginResponse(app, { username: 'kim', password: 'password' });
        const authToken = await response.json().token;

        // Login as user `lumi` and get token
        response = await loginResponse(app, { username: 'lumi', password: 'newpassword' });
        const authSecondToken = await response.json().token;

        // Test when no players exist for the user
        t.test('GET `/players` returns 404 when no players found for user', async (t) => {
            response = await getPlayersResponse(app, authToken);
            t.equal(response.statusCode, 404);
            t.equal(response.json().error, 'No players found for this user');
        });

        // Test successful player creation
        t.test('POST `/players` returns 201 on successful creation', async (t) => {
            response = await createPlayerResponse(app, authToken, {
                display_name: 'Player1',
            });
            t.equal(response.statusCode, 201);
            const player = await response.json();
            t.equal(player.message, 'Player created successfully');
            t.same(player.item, {
                id: 1,
                display_name: 'Player1',
                avatar_url: null,
                wins: 0,
                losses: 0,
                created_at: player.item.created_at,
            });
        });

        // Test duplicate player display name
        t.test('POST `/players` returns 409 for duplicate display_name', async (t) => {
            response = await createPlayerResponse(app, authToken, {
                display_name: 'Player1',
            });
            t.equal(response.statusCode, 409);
            t.equal(response.json().error, 'Display name already exists');
        });

        // Test max player creation limit (8)
        t.test('POST `/players` returns 400 when max players limit is reached', async (t) => {
            for (let i = 2; i < 10; i++) {
                response = await createPlayerResponse(app, authToken, {
                    display_name: `Player${i}`,
                });
            }
            t.equal(response.statusCode, 400);
            t.equal(response.json().error, 'Cannot add another player. Max players is 8');
        });

        // Test unauthorized access to another user's player
        t.test('GET `/players/:id` returns 404 when unauthorized', async (t) => {
            const response = await getPlayerResponse(app, authSecondToken, 8);
            t.equal(response.statusCode, 404);
            t.equal(response.json().error, 'Player not found or user not authorized to access player info');
        });

        // Test getting a non-existent player
        t.test('GET `/players/:id` returns 404 when player does not exist', async (t) => {
            const response = await getPlayerResponse(app, authToken, 100);
            t.equal(response.statusCode, 404);
            t.equal(response.json().error, 'Player not found or user not authorized to access player info');
        });

        // Test retrieving a player successfully
        t.test('GET `/players/:id` returns 200 with valid data', async (t) => {
            const response = await getPlayerResponse(app, authToken, 8);
            t.equal(response.statusCode, 200);
            const player = response.json();
            t.same(player, {
                id: 8,
                display_name: 'Player8',
                avatar_url: "",
                wins: 0,
                losses: 0,
                created_at: player.created_at,
            });
        });

        // Test unauthorized player deletion
        t.test('DELETE `/players/:id` returns 404 when unauthorized', async (t) => {
            const response = await deletePlayerResponse(app, authSecondToken, 3);
            t.equal(response.statusCode, 404);
            t.equal(response.json().error, 'Player not found or user not authorized to delete this player');
        });

        // Test deletion of non-existent player
        t.test('DELETE `/players/:id` returns 404 when player does not exist', async (t) => {
            const response = await deletePlayerResponse(app, authToken, 100);
            t.equal(response.statusCode, 404);
            t.equal(response.json().error, 'Player not found or user not authorized to delete this player');
        });

        // Test successful player deletion
        t.test('DELETE `/players/:id` returns 200 on success', async (t) => {
            const response = await deletePlayerResponse(app, authToken, 3);
            t.equal(response.statusCode, 200);
            t.equal(response.json().message, 'Player deleted successfully');
        });

        // Test retrieving players after one deletion
        t.test('GET `/players` returns remaining players', async (t) => {
            response = await getPlayersResponse(app, authToken);
            const players = response.json();
            t.equal(players.length === 7, true);
            t.same(players[0], {
                id: 1,
                display_name: 'Player1',
                avatar_url: "",
                wins: 0,
                losses: 0,
                created_at: players[0].created_at,
            });
            t.same(players[1], {
                id: 2,
                display_name: 'Player2',
                avatar_url: "",
                wins: 0,
                losses: 0,
                created_at: players[1].created_at,
            });
            t.same(players[2], {
                id: 4,
                display_name: 'Player4',
                avatar_url: "",
                wins: 0,
                losses: 0,
                created_at: players[2].created_at,
            });
        });

        // Test unauthorized player update
        t.test('PUT `/players/:id` returns 404 when unauthorized', async (t) => {
            const response = await updatePlayerResponse(app, authSecondToken, 1, {
                display_name: 'updatedPlayer',
                avatar_url: "notnull.com",
            });
            t.equal(response.statusCode, 404);
            t.equal(response.json().error, 'Player not found or user not authorized to update this player');
        });

        // Test update on non-existent player
        t.test('PUT `/players/:id` returns 404 for invalid id', async (t) => {
            const response = await updatePlayerResponse(app, authToken, 100, {
                display_name: 'updatedPlayer',
                avatar_url: "notnull.com",
            });
            t.equal(response.statusCode, 404);
            t.equal(response.json().error, 'Player not found or user not authorized to update this player');
        });

        // Test update with duplicate display name
        t.test('PUT `/players/:id` returns 400 for duplicate display_name', async (t) => {
            const response = await updatePlayerResponse(app, authToken, 1, {
                display_name: 'Player7',
                avatar_url: "notnull.com",
            });
            t.equal(response.statusCode, 400);
            t.equal(response.json().error, 'Display name already taken');
        });

        // Test successful player update
        t.test('PUT `/players/:id` returns 200 when update is successful', async (t) => {
            const response = await updatePlayerResponse(app, authToken, 1, {
                display_name: 'updatedPlayer',
                avatar_url: "notnull.com",
            });
            t.equal(response.statusCode, 200);
            const player = response.json();
            t.equal(player.message, 'Player updated successfully');
            t.same(player.item, {
                display_name: 'updatedPlayer',
                avatar_url: "notnull.com",
            });
        });
    });
}

export default runPlayerTests;
