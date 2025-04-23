import { loginResponse, updateUserResponse } from "./utils/helpers.js";

function runUserTests(app, t) {
    t.test('User Routes Suite', async(t) => {
        // Test retrieving all users
        t.test('GET `/users` returns two users', async (t) => {
            const response = await app.inject({
                method: 'GET',
                url: '/users'
        });
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
        }),
        t.same(users[1], {
            id: 2,
            username: 'kim',
            email: 'kim@email.com',
            avatar_url: "",
            online_status: false,
            created_at: users[1].created_at,
        })
    });

    // Test retrieving a single user by ID
    t.test('GET `/users/:id` returns second user', async (t) => {
        const response = await app.inject({
            method: 'GET',
            url: '/users/2'
    });
    t.equal(response.statusCode, 200, 'Status code 200');
    const user = await response.json();
    t.same(user, {
        id: 2,
        username: 'kim',
        email: 'kim@email.com',
        avatar_url: "",
        online_status: false,
        created_at: user.created_at,
    })
    })

    //  Test handling of invalid user ID
    t.test('GET `/users/:id` returns 404 user not found', async (t) => {
        const response = await app.inject({
            method: 'GET',
            url: '/users/3'
    });
    t.equal(response.statusCode, 404, 'Status code 404');
    t.equal(response.json().error, 'User not found');
    })

    // Test for updating user details
    t.test('PUT `/users/:id`', async (t) => {
        const response = await loginResponse(app, { username: 'testuser', password: 'testpassword' });
        const authToken = await response.json().token;
        t.equal(response.statusCode, 200, 'Status code 200');
        t.ok(authToken, 'Token is present');

        t.test('PUT `/users/2` returns 403 if unauthoritized', async (t) => {
            const response = await updateUserResponse(app, 2, authToken, { username: "new" });
            t.equal(response.statusCode, 403, 'Status code 403');
            t.equal(response.json().error, 'Unauthoritized to update user information');
        })

        t.test('PUT `/users/1` returns 403 if username already taken', async (t) => {
            const response = await updateUserResponse(app, 1, authToken, { username: "kim" });
            t.equal(response.statusCode, 400, 'Status code 400');
            t.equal(response.json().error, 'Username already taken');
        })

        t.test('PUT `/users/1` returns 403 if email already in use', async (t) => {
            const response = await updateUserResponse(app, 1, authToken, { email: "kim@email.com" });
            t.equal(response.statusCode, 400, 'Status code 400');
            t.equal(response.json().error, 'Email already in use');
        })

        
    })
})
}

export default runUserTests;