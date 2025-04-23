import { loginResponse, sendFriendRequestResponse } from './utils/helpers.js';

function runFriendTests(app, t) {
    t.test('', async (t) => {
        let response = await loginResponse(app, { username: 'lumi', password: 'newpassword' });
        const authToken = await response.json().token;

        t.test('GET `/friends` returns 404 when no friends found for user', async (t) => {
            response = await app.inject({
                method: 'GET',
                url: '/friends',
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
    
            t.equal(response.statusCode, 404, 'Status code 404');
            t.equal(response.json().error, 'No friends found for this user');
        })

        // Test send friend requests
        t.test('POST `/friend-requests/:id`', async(t) => {
            t.test('POST `/friend-requests/1` returns 400 when request to itself', async (t) => {
                response = await sendFriendRequestResponse(app, 1, authToken);
        
                t.equal(response.statusCode, 400, 'Status code 400');
                t.equal(response.json().error, 'Cannot send friend request to yourself');
            })

            t.test('POST `/friend-requests/0` returns 500 when invalid id', async (t) => {
                response = await sendFriendRequestResponse(app, 0, authToken);
        
                t.equal(response.statusCode, 500, 'Status code 500');
                t.equal(response.json().error, 'Failed to send friend request');
            })

            t.test('POST `/friend-requests/2` returns 200 when succefully sent', async (t) => {
                response = await sendFriendRequestResponse(app, 2, authToken);
                
                const data = await response.json();

                t.equal(response.statusCode, 200, 'Status code 200');
                t.equal(data.message, 'Friend request sent successfully');
                t.same(data.item, {
                    user_id: 1,
                    friend_id: 2,
                    status: 'pending'
                })
            })
        } )
    })


}

export default runFriendTests;