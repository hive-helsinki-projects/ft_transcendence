import { loginResponse, logoutResponse, registerResponse } from './utils/helpers.js';

function runAuthTests(app, t) {
    t.test('Auth Routes Suite', async (t) => {
        t.test('GET `/users` returns empty array', async (t) => {
            const response = await app.inject({
                method: 'GET',
                url: '/users',
            });
            t.equal(response.statusCode, 200, 'Status code 200');
            t.same(response.json(), []);
        });
        
        // Register test
        t.test('POST `/register`', async(t) => {
            t.test('POST `/register` returns 400 if email is missing', async (t) => {
                const response = await registerResponse(app, { username: 'testuser', password: 'testpassword' })
    
                t.equal(response.statusCode, 400, 'Status code 400');
                t.equal(response.json().message, "body must have required property 'email'");
            });
            
            t.test('POST `/register` returns 400 if invalid email', async (t) => {
                const response = await registerResponse(app, {
                        username: 'testuser',
                        email: 'invalid-email',
                        password: 'testpassword',
                });
                t.equal(response.statusCode, 400, 'Status code 400');
                t.equal(response.json().message, 'body/email must match format "email"');
            });
        
            t.test('POST `/register` returns 400 if invalid username (min 3 char)', async (t) => {
                const response = await registerResponse(app, {
                        username: 'ti',
                        email: 'invalid-email',
                        password: 'testpassword',
                    })
                t.equal(response.statusCode, 400, 'Status code 400');
                t.equal(response.json().message, 'body/username must NOT have fewer than 3 characters');
            });
        
            t.test('POST `/register` returns 400 if username is missing', async (t) => {
                const response = await registerResponse(app, {
                        email: 'testuse@email.com',
                        password: 'testpassword',
                });
                t.equal(response.statusCode, 400, 'Status code 400');
                t.equal(response.json().message, "body must have required property 'username'");
            });
        
            t.test('POST `/register` returns 400 if password is missing', async (t) => {
                const response = await registerResponse(app, {
                        email: 'testuse@email.com',
                        username: 'testuser',
                })
                t.equal(response.statusCode, 400, 'Status code 400');
                t.equal(response.json().message, "body must have required property 'password'");
            });
    
            t.test('POST `/register` returns 400 if invalid password', async (t) => {
                const response = await registerResponse(app, {
                        email: 'testuse@email.com',
                        password: '123',
                        username: 'testuser',
                });
                t.equal(response.statusCode, 400, 'Status code 400');
                t.equal(response.json().message, 'body/password must NOT have fewer than 6 characters');
            });
        
            t.test('POST `/register` returns 201 if successfully created user', async (t) => {
                let response = await registerResponse(app, {
                        username: 'testuser',
                        password: 'testpassword',
                        email: 'testuse@email.com',
                    })
                t.equal(response.statusCode, 201, 'Status code 201');
                t.equal(response.json().message, "User created successfully");
    
                response = await app.inject({
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
                const response = await registerResponse(app, {
                        username: 'testuser',
                        password: 'testpassword',
                        email: 'new@email.com',
                    })
                t.equal(response.statusCode, 409, 'Status code 409');
                t.equal(response.json().error, 'Username or email already exists');
            });
    
            t.test('POST `/register` returns 400 if duplicate email', async (t) => {
                const response = await registerResponse(app, {
                        username: 'newuser',
                        password: 'testpassword',
                        email: 'testuse@email.com',
                    })
                t.equal(response.statusCode, 409, 'Status code 409');
                t.equal(response.json().error, 'Username or email already exists');
            });
    
            t.test('POST `/register` returns 201 if successfully created user', async (t) => {
                const response = await registerResponse(app, {
                        username: 'kim',
                        password: 'password',
                        email: 'kim@email.com',
                    });
                t.equal(response.statusCode, 201, 'Status code 201');
                t.equal(response.json().message, "User created successfully");
            });
        })
        
        // Login test
        t.test('POST `/login`', async (t) => {
            t.test('POST `/login` returns 400 if username is missing', async (t) => {
                const response = await loginResponse(app, {
                        password: 'password',
                    })
                t.equal(response.statusCode, 400, 'Status code 400');
                t.equal(response.json().message, "body must have required property 'username'");
            });
    
            t.test('POST `/login` returns 400 if password is missing', async (t) => {
                const response = await loginResponse(app, {
                        username: 'kim',
                    })
                t.equal(response.statusCode, 400, 'Status code 400');
                t.equal(response.json().message, "body must have required property 'password'");
            }
            );
    
            t.test('POST `/login` returns 401 if user not found', async (t) => {
                const response = await loginResponse(app, {
                        username: 'nonexistentuser',
                        password: 'password',
                    })
                t.equal(response.statusCode, 401, 'Status code 401');
                t.equal(response.json().error, 'Invalid username or password');
            }
            );
    
            t.test('POST `/login` returns 401 if password is incorrect', async (t) => { 
                const response = await loginResponse(app, {
                        username: 'kim',
                        password: 'wrongpassword',
                    })
                t.equal(response.statusCode, 401, 'Status code 401');
                t.equal(response.json().error, 'Invalid username or password');
            }
            );
    
            t.test('POST `/login` returns 200 if login is successful', async (t) => {
                const response = await loginResponse(app, { username: 'kim', password: 'password' });
                const authToken = await response.json().token;
                t.equal(response.statusCode, 200, 'Status code 200');
                t.ok(authToken, 'Token is present');
                t.same(response.json(), {
                    token: authToken,
                    username: 'kim',
                });
                
                // Logout test
                t.test('POST `/logout`', async(t) => {
                    t.test('POST `/logout` returns 200 if logout is successful', async (t) => {
                        const response = await logoutResponse(app, authToken);
        
                        t.equal(response.statusCode, 200, 'Status code 200');
                        t.equal(response.json().message, 'Logout successful');
                });
        
                    t.test('POST `/logout` returns 400 if user already logged out', async (t) => {
                        const response = await logoutResponse(app, authToken);
        
                        t.equal(response.statusCode, 404, 'Status code 404');
                        t.equal(response.json().error, 'User already logged out');
                    });
                })
            }
            );
        })
    });
} 

export default runAuthTests;