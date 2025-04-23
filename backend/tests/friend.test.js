import { getFriendStatusResponse, loginResponse, sendFriendRequestResponse, acceptFriendResponse } from './utils/helpers.js';

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

        t.test('PATCH `/friends-requests/2` returns 404 when friend request not found', async (t) => {
            response = await acceptFriendResponse(app, 2, authToken);
            t.equal(response.statusCode, 404, 'Status code 404');
            t.equal(response.json().error, 'Friend request not found');
        })

        // Test send friend requests (pending)
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

            t.test('POST `/friend-requests/2` returns 400 when friend request already exist', async (t) => {
                response = await sendFriendRequestResponse(app, 2, authToken);
                t.equal(response.statusCode, 409, 'Status code 409');
                t.equal(response.json().error, 'Friend request already exists');
            })
        })

        // Test get friend status when friend request (pending)
        t.test('GET `/friends/:id/status`', async (t) => {
            t.test('GET `/friends/:id/status` returns 404 when friend not found', async (t) => {
                response = await getFriendStatusResponse(app, 6, authToken);
                t.equal(response.statusCode, 404, 'Status code 404');
                t.equal(response.json().error, 'Friend not found');
            })

            t.test('GET `/friends/:id/status` returns 400 when friend request pending', async (t) => {
                response = await getFriendStatusResponse(app, 2, authToken);
                t.equal(response.statusCode, 400, 'Status code 400');
                t.equal(response.json().error, 'Friend request pending');
            })
        })

        // Test after accepting friend requests
        t.test('PATCH `/friends-requests/2` returns 400 waiting for friend to accept request', async (t) => {
            response = await acceptFriendResponse(app, 2, authToken);
            t.equal(response.statusCode, 400, 'Status code 400');
            t.equal(response.json().error, 'Waiting for friend to accept request');
        })

        t.test('PATCH `/friends-requests/2` returns 200 accept friend request', async (t) => {
            response = await loginResponse(app, { username: 'kim', password: 'password' });
            const authSecondToken = await response.json().token;

            response = await acceptFriendResponse(app, 1, authSecondToken);
            const data = response.json();

            t.equal(response.statusCode, 200, 'Status code 200');
            t.equal(data.message, 'Friend request accepted successfully');
            t.same(data.item, {
                user_id: 1,
                friend_id: 2,
                status: 'accepted'
            })

            t.test('PATCH `/friend-requests/2` returns 400 when already friends', async (t) => {
                response = await acceptFriendResponse(app, 1, authSecondToken);
                t.equal(response.statusCode, 400, 'Status code 400');
                t.equal(response.json().error, 'Already friends');
            })
        })

        t.test('PATCH `/friend-requests/2` returns 400 when already friends', async (t) => {
            response = await acceptFriendResponse(app, 2, authToken);
            t.equal(response.statusCode, 400, 'Status code 400');
            t.equal(response.json().error, 'Already friends');
        })

        t.test('POST `/friend-requests/2` returns 400 when already friends', async (t) => {
            response = await sendFriendRequestResponse(app, 2, authToken);
            t.equal(response.statusCode, 400, 'Status code 400');
            t.equal(response.json().error, 'Already friends');
        })

        t.test('GET `/friends/:id/status` returns 400 when friend request pending', async (t) => {
            response = await getFriendStatusResponse(app, 2, authToken);
            t.equal(response.statusCode, 200, 'Status code 200');
            t.same(response.json(), {
                username: 'kim',
                online_status: '1',
            })
        })

        t.test('GET `/friends` returns 200 returning all friends', async (t) => {
            response = await app.inject({
                method: 'GET',
                url: '/friends',
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
    
            t.equal(response.statusCode, 200, 'Status code 200');
            const friends = response.json();
            t.same(friends[0], {
                user_id: 1,
                friend_id: 2,
                status: 'accepted'
            })
        })

        // Test delete friend or deny request
        t.test('DELETE `/friends/:id` returns 404 when unauthoritized action', async (t) => {
            response = await app.inject({
                method: 'DELETE',
                url: '/friends/4',
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
    
            t.equal(response.statusCode, 404, 'Status code 404');
            t.equal(response.json().error, 'Friend not found user not authoritized to delete friend')
        })

        t.test('DELETE `/friends/:id` returns 200 when friend removed', async (t) => {
            response = await app.inject({
                method: 'DELETE',
                url: '/friends/2',
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
    
            t.equal(response.statusCode, 200, 'Status code 200');
            t.equal(response.json().message, 'Friend removed successfully')
        })
    })


}

export default runFriendTests;