import { loginResponse } from './utils/auth.helpers.js';
import {
    getFriendsResponse,
    deleteFriendResponse,
    getFriendStatusResponse,
    sendFriendRequestResponse,
    acceptFriendResponse,
} from './utils/friend.helpers.js';

// Group of tests for Friend routes
function runFriendTests(app, t) {
    t.test('POST `/login`', async (t) => {
        // Login as user `lumi`
        let response = await loginResponse(app, { username: 'lumi', password: 'newpassword' });
        const authToken = await response.json().token;

        // GET `/friends` when no friends found
        t.test('GET `/friends` returns 404 when no friends found for user', async (t) => {
            response = await getFriendsResponse(app, authToken);
            t.equal(response.statusCode, 404, 'Status code 404');
            t.equal(response.json().error, 'No friends found for this user');
        });

        // PATCH `/friends-requests/2` when no friend request found
        t.test('PATCH `/friends-requests/2` returns 404 when friend request not found', async (t) => {
            response = await acceptFriendResponse(app, 2, authToken);
            t.equal(response.statusCode, 404, 'Status code 404');
            t.equal(response.json().error, 'Friend request not found');
        });

        // POST `/friend-requests/:id`
        t.test('POST `/friend-requests/:id`', async (t) => {
            // Cannot send friend request to self
            t.test('POST `/friend-requests/1` returns 400 when request to itself', async (t) => {
                response = await sendFriendRequestResponse(app, 1, authToken);
                t.equal(response.statusCode, 400, 'Status code 400');
                t.equal(response.json().error, 'Cannot send friend request to yourself');
            });

            // Invalid friend ID
            t.test('POST `/friend-requests/0` returns 500 when invalid id', async (t) => {
                response = await sendFriendRequestResponse(app, 0, authToken);
                t.equal(response.statusCode, 500, 'Status code 500');
                t.equal(response.json().error, 'Failed to send friend request');
            });

            // Send friend request successfully
            t.test('POST `/friend-requests/2` returns 200 when successfully sent', async (t) => {
                response = await sendFriendRequestResponse(app, 2, authToken);
                const data = await response.json();
                t.equal(response.statusCode, 200, 'Status code 200');
                t.equal(data.message, 'Friend request sent successfully');
                t.same(data.item, {
                    user_id: 1,
                    friend_id: 2,
                    status: 'pending',
                });
            });

            // Duplicate friend request
            t.test('POST `/friend-requests/2` returns 409 when friend request already exists', async (t) => {
                response = await sendFriendRequestResponse(app, 2, authToken);
                t.equal(response.statusCode, 409, 'Status code 409');
                t.equal(response.json().error, 'Friend request already exists');
            });
        });

        // GET `/friends/:id/status`
        t.test('GET `/friends/:id/status`', async (t) => {
            // Friend not found
            t.test('GET `/friends/:id/status` returns 404 when friend not found', async (t) => {
                response = await getFriendStatusResponse(app, 6, authToken);
                t.equal(response.statusCode, 404, 'Status code 404');
                t.equal(response.json().error, 'Friend not found');
            });

            // Friend request pending
            t.test('GET `/friends/:id/status` returns 400 when friend request pending', async (t) => {
                response = await getFriendStatusResponse(app, 2, authToken);
                t.equal(response.statusCode, 400, 'Status code 400');
                t.equal(response.json().error, 'Friend request pending');
            });
        });

        // PATCH `/friends-requests/2` before request is accepted
        t.test('PATCH `/friends-requests/2` returns 400 waiting for friend to accept request', async (t) => {
            response = await acceptFriendResponse(app, 2, authToken);
            t.equal(response.statusCode, 400, 'Status code 400');
            t.equal(response.json().error, 'Waiting for friend to accept request');
        });

        // Accept friend request
        t.test('PATCH `/friends-requests/2` returns 200 accept friend request', async (t) => {
            response = await loginResponse(app, { username: 'kim', password: 'password' });
            const authSecondToken = await response.json().token;

            response = await acceptFriendResponse(app, 1, authSecondToken);
            const data = await response.json();

            t.equal(response.statusCode, 200, 'Status code 200');
            t.equal(data.message, 'Friend request accepted successfully');
            t.same(data.item, {
                user_id: 1,
                friend_id: 2,
                status: 'accepted',
            });

            // Try accepting again after already friends
            t.test('PATCH `/friend-requests/2` returns 400 when already friends', async (t) => {
                response = await acceptFriendResponse(app, 1, authSecondToken);
                t.equal(response.statusCode, 400, 'Status code 400');
                t.equal(response.json().error, 'Already friends');
            });
        });

        // Accept already accepted request
        t.test('PATCH `/friend-requests/2` returns 400 when already friends', async (t) => {
            response = await acceptFriendResponse(app, 2, authToken);
            t.equal(response.statusCode, 400, 'Status code 400');
            t.equal(response.json().error, 'Already friends');
        });

        // Send request to existing friend
        t.test('POST `/friend-requests/2` returns 400 when already friends', async (t) => {
            response = await sendFriendRequestResponse(app, 2, authToken);
            t.equal(response.statusCode, 400, 'Status code 400');
            t.equal(response.json().error, 'Already friends');
        });

        // GET friend status after accepted
        t.test('GET `/friends/:id/status` returns 200 when already friends', async (t) => {
            response = await getFriendStatusResponse(app, 2, authToken);
            t.equal(response.statusCode, 200, 'Status code 200');
            t.same(response.json(), {
                username: 'kim',
                online_status: '1',
            });
        });

        // GET all friends
        t.test('GET `/friends` returns 200 returning all friends', async (t) => {
            response = await getFriendsResponse(app, authToken);
            t.equal(response.statusCode, 200, 'Status code 200');
            const friends = await response.json();
            t.same(friends[0], {
                user_id: 1,
                friend_id: 2,
                status: 'accepted',
            });
        });

        // DELETE friend - unauthorized
        t.test('DELETE `/friends/:id` returns 404 when unauthorized action', async (t) => {
            response = await deleteFriendResponse(app, authToken, 4);
            t.equal(response.statusCode, 404, 'Status code 404');
            t.equal(response.json().error, 'Friend not found or user not authorized to delete friend');
        });

        // DELETE friend - success
        t.test('DELETE `/friends/:id` returns 200 when friend removed', async (t) => {
            response = await deleteFriendResponse(app, authToken, 2);
            t.equal(response.statusCode, 200, 'Status code 200');
            t.equal(response.json().message, 'Friend removed successfully');
        });
    });
}

export default runFriendTests;
