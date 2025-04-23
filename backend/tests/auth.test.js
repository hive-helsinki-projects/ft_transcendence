
function runAuthTests(app, t) {
    function loginResponse (credentials = { username: 'kim', password: 'password' }) {
        const response = app.inject({
            method: 'POST',
            url: '/login',
            payload: credentials,
        });
        return response;
    }
    
    t.test('Auth Routes Suite', async (t) => {
        t.test('GET `/users` returns empty array', async (t) => {
            const response = await app.inject({
                method: 'GET',
                url: '/users',
            });
            t.equal(response.statusCode, 200, 'Status code 200');
            t.same(response.json(), []);
        });
    
        t.test('POST `/register` returns 400 if email is missing', async (t) => {
            const response = await app.inject({
                method: 'POST',
                url: '/register',
                payload: {
                    username: 'testuser',
                    password: 'testpassword',
                },
            });
            t.equal(response.statusCode, 400, 'Status code 400');
            t.equal(response.json().message, "body must have required property 'email'");
        });
    
        t.test('POST `/register` returns 400 if invalid email', async (t) => {
            const response = await app.inject({
                method: 'POST',
                url: '/register',
                payload: {
                    username: 'testuser',
                    email: 'invalid-email',
                    password: 'testpassword',
                },
            });
            t.equal(response.statusCode, 400, 'Status code 400');
            t.equal(response.json().message, 'body/email must match format "email"');
        });
    
        t.test('POST `/register` returns 400 if invalid username (min 3 char)', async (t) => {
            const response = await app.inject({
                method: 'POST',
                url: '/register',
                payload: {
                    username: 'ti',
                    email: 'invalid-email',
                    password: 'testpassword',
                },
            });
            t.equal(response.statusCode, 400, 'Status code 400');
            t.equal(response.json().message, 'body/username must NOT have fewer than 3 characters');
        });
    
        t.test('POST `/register` returns 400 if username is missing', async (t) => {
            const response = await app.inject({
                method: 'POST',
                url: '/register',
                payload: {
                    email: 'testuse@email.com',
                    password: 'testpassword',
                },
            });
            t.equal(response.statusCode, 400, 'Status code 400');
            t.equal(response.json().message, "body must have required property 'username'");
        });
    
        t.test('POST `/register` returns 400 if password is missing', async (t) => {
            const response = await app.inject({
                method: 'POST',
                url: '/register',
                payload: {
                    email: 'testuse@email.com',
                    username: 'testuser',
                },
            });
            t.equal(response.statusCode, 400, 'Status code 400');
            t.equal(response.json().message, "body must have required property 'password'");
        });

        t.test('POST `/register` returns 400 if invalid password', async (t) => {
            const response = await app.inject({
                method: 'POST',
                url: '/register',
                payload: {
                    email: 'testuse@email.com',
                    password: '123',
                    username: 'testuser',
                },
            });
            t.equal(response.statusCode, 400, 'Status code 400');
            t.equal(response.json().message, 'body/password must NOT have fewer than 6 characters');
        });
    
        t.test('POST `/register` returns 201 if successfully created user', async (t) => {
            const response = await app.inject({
                method: 'POST',
                url: '/register',
                payload: {
                    username: 'testuser',
                    password: 'testpassword',
                    email: 'testuse@email.com',
                },
            });
            t.equal(response.statusCode, 201, 'Status code 201');
            t.equal(response.json().message, "User created successfully");
        });
    
        t.test('GET `/users` returns one user', async (t) => {
            const response = await app.inject({
                method: 'GET',
                url: '/users',
            });
            t.equal(response.statusCode, 200, 'Status code 200');
            const users = response.json();
            t.equal(users.length, 1, 'One user in the database');   
            t.same(users[0], {
                id: 1,
                username: 'testuser',
                email: 'testuse@email.com',
                avatar_url: "",
                online_status: false,
                created_at: users[0].created_at,
            });
        });

        t.test('POST `/register` returns 400 if duplicate name', async (t) => {
            const response = await app.inject({
                method: 'POST',
                url: '/register',
                payload: {
                    username: 'testuser',
                    password: 'testpassword',
                    email: 'new@email.com',
                },
            });
            t.equal(response.statusCode, 409, 'Status code 409');
            t.equal(response.json().error, 'Username or email already exists');
        });

        t.test('POST `/register` returns 400 if duplicate email', async (t) => {
            const response = await app.inject({
                method: 'POST',
                url: '/register',
                payload: {
                    username: 'newuser',
                    password: 'testpassword',
                    email: 'testuse@email.com',
                },
            });
            t.equal(response.statusCode, 409, 'Status code 409');
            t.equal(response.json().error, 'Username or email already exists');
        });

        t.test('POST `/register` returns 201 if successfully created user', async (t) => {
            const response = await app.inject({
                method: 'POST',
                url: '/register',
                payload: {
                    username: 'kim',
                    password: 'password',
                    email: 'kim@email.com',
                },
            });
            t.equal(response.statusCode, 201, 'Status code 201');
            t.equal(response.json().message, "User created successfully");
        });

        t.test('POST `/login` returns 400 if username is missing', async (t) => {
            const response = await app.inject({
                method: 'POST',
                url: '/login',
                payload: {
                    password: 'password',
                },
            });
            t.equal(response.statusCode, 400, 'Status code 400');
            t.equal(response.json().message, "body must have required property 'username'");
        });

        t.test('POST `/login` returns 400 if password is missing', async (t) => {
            const response = await app.inject({
                method: 'POST',
                url: '/login',
                payload: {
                    username: 'kim',
                },
            });
            t.equal(response.statusCode, 400, 'Status code 400');
            t.equal(response.json().message, "body must have required property 'password'");
        }
        );

        t.test('POST `/login` returns 401 if user not found', async (t) => {
            const response = await app.inject({
                method: 'POST',
                url: '/login',
                payload: {
                    username: 'nonexistentuser',
                    password: 'password',
                },
            });
            t.equal(response.statusCode, 401, 'Status code 401');
            t.equal(response.json().error, 'Invalid username or password');
        }
        );

        t.test('POST `/login` returns 401 if password is incorrect', async (t) => { 
            const response = await app.inject({
                method: 'POST',
                url: '/login',
                payload: {
                    username: 'kim',
                    password: 'wrongpassword',
                },
            });
            t.equal(response.statusCode, 401, 'Status code 401');
            t.equal(response.json().error, 'Invalid username or password');
        }
        );

        t.test('POST `/login` returns 200 if login is successful', async (t) => {
            const response = await loginResponse();
            t.equal(response.statusCode, 200, 'Status code 200');
            t.ok(response.json().token, 'Token is present');
            t.same(response.json(), {
                token: response.json().token,
                username: 'kim',
            });
        }
        );

        t.test('POST `/logout` returns 200 if logout is successful', async (t) => {
            const loginResponse = await app.inject({
                method: 'POST',
                url: '/login',
                payload: {
                    username: 'kim',
                    password: 'password',
                },
            });

            const token = loginResponse.json().token;

            const response = await app.inject({
                method: 'POST',
                url: '/logout',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            t.equal(response.statusCode, 200, 'Status code 200');
            t.equal(response.json().message, 'Logout successful');
    });

        t.test('POST `/logout` returns 400 if user already logged out', async (t) => {
            const loginResponse = await app.inject({
                method: 'POST',
                url: '/login',
                payload: {
                    username: 'kim',
                    password: 'password',
                },
            });

            const token = loginResponse.json().token;

            let response = await app.inject({
                method: 'POST',
                url: '/logout',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            t.equal(response.statusCode, 200, 'Status code 200');
            t.equal(response.json().message, 'Logout successful');

            response = await app.inject({
                method: 'POST',
                url: '/logout',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            t.equal(response.statusCode, 404, 'Status code 404');
            t.equal(response.json().error, 'User already logged out');
        }
        );
    });

} 

export default runAuthTests;