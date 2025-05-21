import friendController from '../controllers/friendController.js';
import { getFriendsOpts, getFriendOnlineStatusOpts, getFriendStatusOpts, deleteFriendOpts, postFriendOpts, patchFriendOpts } from '../models/friendSchemas.js'; 

function friendRoutes(fastify, options) {
    // Get all friends of a user
    fastify.get('/friends', {
        ...getFriendsOpts,
        onRequest: [fastify.jwtAuth],
        handler: friendController.getFriends
    });

    // Get a friends online status
    fastify.get('/friends/:id/online-status', {
        ...getFriendOnlineStatusOpts,
        onRequest: [fastify.jwtAuth],
        handler: friendController.getFriendOnlineStatus
    });

        // Get a friend request status
    fastify.get('/friends/:id/status', {
        ...getFriendStatusOpts,
        onRequest: [fastify.jwtAuth],
        handler: friendController.getFriendStatus
    });

    // Remove a friend or deny friend request
    fastify.delete('/friends/:id', {
        ...deleteFriendOpts,
        onRequest: [fastify.jwtAuth],
        handler: friendController.deleteFriend
    });

    // Send a friend request
    fastify.post('/friend-requests/:id', {
        ...postFriendOpts,
        onRequest: [fastify.jwtAuth],
        handler: friendController.sendFriendRequest
    });

    // Accept a friend request
    fastify.patch('/friend-requests/:id', {
        ...patchFriendOpts,
        onRequest: [fastify.jwtAuth],
        handler: friendController.acceptFriendRequest
    });
}

export default friendRoutes;
