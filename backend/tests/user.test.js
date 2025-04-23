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
    t.test('PUT `/users/:id` updates user info', async (t) => {

    })
})

}

export default runUserTests;