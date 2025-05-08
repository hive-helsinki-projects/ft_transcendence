import { loginResponse } from "./utils/auth.helpers.js";
import { getUserResponse, getUsersResponse, updateUserResponse } from "./utils/user.helpers.js";

// Group of tests for User routes
function runUserTests(app, t) {
    t.test('User Routes Suite', async (t) => {

        // Test retrieving all users
        t.test('GET `/users` returns two users', async (t) => {
            const response = await getUsersResponse(app);
            t.equal(response.statusCode, 200, 'Status code 200');

            const users = await response.json();
            t.equal(users.length, 2, 'Two user in the database');
            t.same(users[0], {
                id: 1,
                username: 'testuser',
                email: 'testuse@email.com',
                avatar_url: "",
                online_status: false,
                created_at: users[0].created_at,
                two_fa_enabled: false,
            });
            t.same(users[1], {
                id: 2,
                username: 'kim',
                email: 'kim@email.com',
                avatar_url: "",
                online_status: false,
                created_at: users[1].created_at,
                two_fa_enabled: false,
            });
        });

        // Test retrieving a single user by ID
        t.test('GET `/users/:id` returns second user', async (t) => {
            const response = await getUserResponse(app, 2);
            t.equal(response.statusCode, 200, 'Status code 200');

            const user = await response.json();
            t.same(user, {
                id: 2,
                username: 'kim',
                email: 'kim@email.com',
                avatar_url: "",
                online_status: false,
                created_at: user.created_at,
                two_fa_enabled: false,
            });
        });

        // Test handling of invalid user ID
        t.test('GET `/users/:id` returns 404 user not found', async (t) => {
            const response = await getUserResponse(app, 3);
            t.equal(response.statusCode, 404, 'Status code 404');
            t.equal((await response.json()).error, 'User not found');
        });

        // Group of tests for updating user information
        t.test('PUT `/users/:id`', async (t) => {
            const response = await loginResponse(app, { username: 'testuser', password: 'testpassword' });
            const authToken = (await response.json()).token;

            // Test unauthorized update attempt
            t.test('PUT `/users/2` returns 403 if unauthoritized', async (t) => {
                const response = await updateUserResponse(app, 2, authToken, { username: "new" });
                t.equal(response.statusCode, 403, 'Status code 403');
                t.equal((await response.json()).error, "Unauthorized to update this user's information");
            });

            // Test update with username already taken
            t.test('PUT `/users/1` returns 400 if username already taken', async (t) => {
                const response = await updateUserResponse(app, 1, authToken, { username: "kim" });
                t.equal(response.statusCode, 400, 'Status code 400');
                t.equal((await response.json()).error, 'Username already taken');
            });

            // Test update with email already in use
            t.test('PUT `/users/1` returns 400 if email already in use', async (t) => {
                const response = await updateUserResponse(app, 1, authToken, { email: "kim@email.com" });
                t.equal(response.statusCode, 400, 'Status code 400');
                t.equal((await response.json()).error, 'Email already in use');
            });

            // Test successful email update
            t.test('PUT `/users/1` returns 200 if email updated', async (t) => {
                const response = await updateUserResponse(app, 1, authToken, { email: "new@email.com" });
                t.equal(response.statusCode, 200, 'Status code 200');

                const data = await response.json();
                t.equal(data.message, 'User updated successfully');
                t.same(data.item, {
                    id: 1,
                    username: 'testuser',
                    email: 'new@email.com',
                    avatar_url: "",
                    online_status: true,
                    created_at: data.item.created_at,
                    two_fa_enabled: false
                });
            });

            // Test successful update of username and avatar_url
            t.test('PUT `/users/1` returns 200 if username and avatar_url updated', async (t) => {
                let response = await updateUserResponse(app, 1, authToken, { username: 'lumi', avatar_url: 'newlink.com' });
                t.equal(response.statusCode, 200, 'Status code 200');

                let data = await response.json();
                t.equal(data.message, 'User updated successfully');
                t.same(data.item, {
                    id: 1,
                    username: 'lumi',
                    email: 'new@email.com',
                    avatar_url: 'newlink.com',
                    online_status: true,
                    created_at: data.item.created_at,
                    two_fa_enabled: false
                });

                response = await getUserResponse(app, 1);
                t.equal(response.statusCode, 200, 'Status code 200');

                const user = await response.json();
                t.same(user, {
                    id: 1,
                    username: 'lumi',
                    email: 'new@email.com',
                    avatar_url: "newlink.com",
                    online_status: true,
                    created_at: user.created_at,
                    two_fa_enabled: false,
                });
            });

            // Test password update and login with new password
            t.test('PUT `/users/1` returns 200 if password updated', async (t) => {
                let response = await updateUserResponse(app, 1, authToken, { password: 'newpassword' });
                t.equal(response.statusCode, 200, 'Status code 200');

                let data = await response.json();
                t.equal(data.message, 'User updated successfully');
                t.same(data.item, {
                    id: 1,
                    username: 'lumi',
                    email: 'new@email.com',
                    avatar_url: 'newlink.com',
                    online_status: true,
                    created_at: data.item.created_at,
                    two_fa_enabled: false
                });

                response = await loginResponse(app, { username: 'lumi', password: 'testpassword' });
                t.equal(response.statusCode, 401, 'Status code 401');
                t.equal((await response.json()).error, 'Invalid username or password');

                response = await loginResponse(app, { username: 'lumi', password: 'newpassword' });
                data = await response.json();
                t.ok(data.token, 'Token is present');
                t.equal(response.statusCode, 200, 'Status code 200');
                t.same(data, {
                    token: data.token,
                    username: 'lumi',
                });
            });

        });
    });
}

export default runUserTests;
