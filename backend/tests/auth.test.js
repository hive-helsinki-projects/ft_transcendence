import { loginResponse, logoutResponse, registerResponse } from './utils/auth.helpers.js';
import { getUsersResponse, getUserResponse } from './utils/user.helpers.js';

// Group of tests for Auth routes
function runAuthTests(app, t) {
    t.test('Auth Routes Suite', async (t) => {

        // Test that initially, the users list is empty
        t.test('GET `/users` returns empty array', async (t) => {
            const response = await getUsersResponse(app);
            t.equal(response.statusCode, 200, 'Status code 200');
            t.same(response.json(), []);
        });

        // Group of tests related to user registration
        t.test('POST `/register`', async(t) => {

            // Test: Missing email
            t.test('returns 400 if email is missing', async (t) => {
                const response = await registerResponse(app, { username: 'testuser', password: 'testpassword' });
                t.equal(response.statusCode, 400, 'Status code 400');
                t.equal(response.json().message, "body must have required property 'email'");
            });

            // Test: Invalid email format
            t.test('returns 400 if invalid email', async (t) => {
                const response = await registerResponse(app, {
                    username: 'testuser',
                    email: 'invalid-email',
                    password: 'testpassword',
                });
                t.equal(response.statusCode, 400, 'Status code 400');
                t.equal(response.json().message, 'body/email must match format "email"');
            });

            // Test: Username too short
            t.test('returns 400 if username < 3 chars', async (t) => {
                const response = await registerResponse(app, {
                    username: 'ti',
                    email: 'invalid-email',
                    password: 'testpassword',
                });
                t.equal(response.statusCode, 400, 'Status code 400');
                t.equal(response.json().message, 'body/username must NOT have fewer than 3 characters');
            });

            // Test: Missing username
            t.test('returns 400 if username is missing', async (t) => {
                const response = await registerResponse(app, {
                    email: 'testuse@email.com',
                    password: 'testpassword',
                });
                t.equal(response.statusCode, 400, 'Status code 400');
                t.equal(response.json().message, "body must have required property 'username'");
            });

            // Test: Missing password
            t.test('returns 400 if password is missing', async (t) => {
                const response = await registerResponse(app, {
                    email: 'testuse@email.com',
                    username: 'testuser',
                });
                t.equal(response.statusCode, 400, 'Status code 400');
                t.equal(response.json().message, "body must have required property 'password'");
            });

            // Test: Password too short
            t.test('returns 400 if invalid password', async (t) => {
                const response = await registerResponse(app, {
                    email: 'testuse@email.com',
                    password: '123',
                    username: 'testuser',
                });
                t.equal(response.statusCode, 400, 'Status code 400');
                t.equal(response.json().message, 'body/password must NOT have fewer than 6 characters');
            });

            // Test: Successful registration
            t.test('returns 201 if successfully created user', async (t) => {
                let response = await registerResponse(app, {
                    username: 'testuser',
                    password: 'testpassword',
                    email: 'testuse@email.com',
                });
                t.equal(response.statusCode, 201, 'Status code 201');
                t.equal(response.json().message, "User created successfully");

                // Verify the user exists in DB
                response = await getUsersResponse(app);
                t.equal(response.statusCode, 200, 'Status code 200');
                const users = await response.json();
                t.equal(users.length, 1, 'One user in the database');
                t.same(users[0], {
                    id: 1,
                    username: 'testuser',
                    email: 'testuse@email.com',
                    avatar_url: "",
                    online_status: false,
                    created_at: users[0].created_at,
                    two_fa_enabled: false,
                });
            });

            // Test: Duplicate username
            t.test('returns 400 if duplicate name', async (t) => {
                const response = await registerResponse(app, {
                    username: 'testuser',
                    password: 'testpassword',
                    email: 'new@email.com',
                });
                t.equal(response.statusCode, 409, 'Status code 409');
                t.equal(response.json().error, 'Username or email already exists');
            });

            // Test: Duplicate email
            t.test('returns 400 if duplicate email', async (t) => {
                const response = await registerResponse(app, {
                    username: 'newuser',
                    password: 'testpassword',
                    email: 'testuse@email.com',
                });
                t.equal(response.statusCode, 409, 'Status code 409');
                t.equal(response.json().error, 'Username or email already exists');
            });

            // Register a second valid user
            t.test('returns 201 if successfully created another user', async (t) => {
                const response = await registerResponse(app, {
                    username: 'kim',
                    password: 'password',
                    email: 'kim@email.com',
                });
                t.equal(response.statusCode, 201, 'Status code 201');
                t.equal(response.json().message, "User created successfully");
            });
        });

        // Group of tests related to user login
        t.test('POST `/login`', async (t) => {

            // Test: Missing username
            t.test('returns 400 if username is missing', async (t) => {
                const response = await loginResponse(app, { password: 'password' });
                t.equal(response.statusCode, 400, 'Status code 400');
                t.equal(response.json().message, "body must have required property 'username'");
            });

            // Test: Missing password
            t.test('returns 400 if password is missing', async (t) => {
                const response = await loginResponse(app, { username: 'kim' });
                t.equal(response.statusCode, 400, 'Status code 400');
                t.equal(response.json().message, "body must have required property 'password'");
            });

            // Test: Non-existent user
            t.test('returns 401 if user not found', async (t) => {
                const response = await loginResponse(app, {
                    username: 'nonexistentuser',
                    password: 'password',
                });
                t.equal(response.statusCode, 401, 'Status code 401');
                t.equal(response.json().error, 'Invalid username or password');
            });

            // Test: Incorrect password
            t.test('returns 401 if password is incorrect', async (t) => {
                const response = await loginResponse(app, {
                    username: 'kim',
                    password: 'wrongpassword',
                });
                t.equal(response.statusCode, 401, 'Status code 401');
                t.equal(response.json().error, 'Invalid username or password');
            });

            // Test: Successful login and set online_status
            t.test('returns 200 if login is successful', async (t) => {
                let response = await loginResponse(app, { username: 'kim', password: 'password' });
                const authToken = response.json().token;

                t.equal(response.statusCode, 200, 'Status code 200');
                t.ok(authToken, 'Token is present');
                t.same(response.json(), {
                    token: authToken,
                    username: 'kim',
                });

                // Check if user status is online
                response = await getUserResponse(app, 2);
                t.equal(response.statusCode, 200, 'Status code 200');
                const user = await response.json();
                t.same(user, {
                    id: 2,
                    username: 'kim',
                    email: 'kim@email.com',
                    avatar_url: "",
                    online_status: true,
                    created_at: user.created_at,
                    two_fa_enabled: false,
                });

                // Logout Tests
                t.test('POST `/logout`', async (t) => {

                    // Test: Successful logout
                    t.test('returns 200 if logout is successful', async (t) => {
                        let response = await logoutResponse(app, authToken);
                        t.equal(response.statusCode, 200, 'Status code 200');
                        t.equal(response.json().message, 'Logout successful');

                        // Check if user status is offline
                        response = await getUserResponse(app, 2);
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

                    // Test: Already logged out
                    t.test('returns 400 if user already logged out', async (t) => {
                        const response = await logoutResponse(app, authToken);
                        t.equal(response.statusCode, 404, 'Status code 404');
                        t.equal(response.json().error, 'User already logged out');
                    });
                });
            });
        });
    });
}

export default runAuthTests;
