import { loginResponse } from "./utils/auth.helpers.js";
import { getPlayersResponse, getPlayerResponse, createPlayerResponse, updatePlayerResponse, deletePlayerResponse } from "./utils/player.helpers.js";

// Group of test for Player routes
function runPlayerTests(app, t) {
    t.test('POST `/login`', async (t) => {
        // Login as user `kim`
        let response = await loginResponse(app, { username: 'kim', password: 'password' });
        const authToken = await response.json().token;

        // Login as user `lumi`
        response = await loginResponse(app, { username: 'lumi', password: 'newpassword' });
        const authSecondToken = await response.json().token;

        // GET `/players` when no player found
        t.test('GET `/players` returns 404 when no players found for user', async (t) => {
            response = await getPlayersResponse(app, authToken);
            t.equal(response.statusCode, 404, 'Status code 404');
            t.equal(response.json().error, 'No players found for this user');
        })

        // POST `/players`
        t.test('POST `/players` returns 201 when successfully creating a player', async (t) => {
            response = await createPlayerResponse(app, authToken, {
                display_name: 'Player1',
            })
            t.equal(response.statusCode, 201, 'Status code 201');
            const player = await response.json();
            t.equal(player.message, "Player created succesfully");
            t.same(player.item, {
                id: 1,
                display_name: 'Player1',
                avatar_url: null,
                wins: 0,
                losses: 0,
                created_at: player.item.created_at,
            })
        })

        t.test('POST `/players` returns 409 when duplicate display_name', async (t) => {
            response = await createPlayerResponse(app, authToken, {
                display_name: 'Player1',
            })
            t.equal(response.statusCode, 409, 'Status code 409');
            t.equal(response.json().error, 'Display_name already exist')
        })

        t.test('POST `/players` returns 400 when reached max players (8)', async (t) => {
            let response;
            for (let i = 2; i < 10; i++) {
                response = await createPlayerResponse(app, authToken, {
                    display_name: `Player${i}`,
                })
            }
            t.equal(response.statusCode, 400, 'Status code 400');
            t.equal(response.json().error, 'Cannot add another player. Max players is 8');
        })

        // GET `players/:id`
        t.test('GET `/players/:id` returns 404 when unauthoritized', async (t) => {
            const response = await getPlayerResponse(app, authSecondToken, 8);
            t.equal(response.statusCode, 404, 'Status code 404');
            t.equal(response.json().error, 'Player not found or user not authortized to access player info');
        })

        t.test('GET `/players/:id` returns 404 when player does not exist', async (t) => {
            const response = await getPlayerResponse(app, authToken, 100);
            t.equal(response.statusCode, 404, 'Status code 404');
            t.equal(response.json().error, 'Player not found or user not authortized to access player info');
        })

        t.test('GET `/players/:id` returns 200', async (t) => {
            const response = await getPlayerResponse(app, authToken, 8);
            t.equal(response.statusCode, 200, 'Status code 200');
            const player = response.json();
            t.same(player, {
                id: 8,
                display_name: 'Player8',
                avatar_url: "",
                wins: 0,
                losses: 0,
                created_at: player.created_at,
            })
        })

        // DELETE `players/:id`
        t.test('DELETE `/players/:id` returns 404 when unauthoritized', async (t) => {
            const response = await deletePlayerResponse(app, authSecondToken, 3);
            t.equal(response.statusCode, 404, 'Status code 404');
            t.equal(response.json().error, 'Player not found or user not authortized to delete this player');
        })

        t.test('DELETE `/players/:id` returns 404 when player does not exist', async (t) => {
            const response = await deletePlayerResponse(app, authToken, 100);
            t.equal(response.statusCode, 404, 'Status code 404');
            t.equal(response.json().error, 'Player not found or user not authortized to delete this player');
        })

        t.test('DELETE `/players/:id` returns 200 when succesfully deleted player', async (t) => {
            const response = await deletePlayerResponse(app, authToken, 3);
            t.equal(response.statusCode, 200, 'Status code 200');
            t.equal(response.json().message, 'Succesfully deleted player');
        })

        // GET `/players`
        t.test('GET `/players` returns 404 when no players found for user', async (t) => {
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
            })
            t.same(players[1], {
                id: 2,
                display_name: 'Player2',
                avatar_url: "",
                wins: 0,
                losses: 0,
                created_at: players[1].created_at,
            })
            t.same(players[2], {
                id: 4,
                display_name: 'Player4',
                avatar_url: "",
                wins: 0,
                losses: 0,
                created_at: players[2].created_at,
            })
        })

        // PUT `/players/:id`
        t.test('PUT `/players/:id` returns 404 when unauthoritized', async (t) => {
            const response = await updatePlayerResponse(app, authSecondToken, 1, {
                display_name: 'updatedPlayer',
                avatar_url: "notnull.com"
            })
            t.equal(response.statusCode, 404, "Status code 404");
            t.equal(response.json().error, 'Player not found or user not authortized to update this player')
        }) 

        t.test('PUT `/players/:id` returns 404 player id invalid', async (t) => {
            const response = await updatePlayerResponse(app, authToken, 100, {
                display_name: 'updatedPlayer',
                avatar_url: "notnull.com"
            })
            t.equal(response.statusCode, 404, "Status code 404");
            t.equal(response.json().error, 'Player not found or user not authortized to update this player')
        }) 

        t.test('PUT `/players/:id` returns 404 player id invalid', async (t) => {
            const response = await updatePlayerResponse(app, authToken, 1, {
                display_name: 'Player7',
                avatar_url: "notnull.com"
            })
            t.equal(response.statusCode, 400, "Status code 400");
            t.equal(response.json().error, 'Display name already taken')
        });

        t.test('PUT `/players/:id` returns 200 when player info updated succesfully', async (t) => {
            const response = await updatePlayerResponse(app, authToken, 1, {
                display_name: 'updatedPlayer',
                avatar_url: "notnull.com"
            })
            t.equal(response.statusCode, 200, "Status code 200");
            const player = response.json();
            t.equal(player.message, 'Player updated successfully')
            t.same(player.item, {
                display_name: 'updatedPlayer',
                avatar_url: "notnull.com",
            })
        }) 
    })
}

export default runPlayerTests;