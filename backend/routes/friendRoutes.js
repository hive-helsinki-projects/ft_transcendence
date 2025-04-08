import friendController from '../controllers/friendController.js';
import { getFriendsOpts, getFriendStatusOpts, deleteFriendOpts, postFriendOpts, patchFriendOpts } from '../models/friendSchemas.js'; 

function friendRoutes(fastify, options) {
    // Route to get all friends of a user
    fastify.get('/friends', {
        ...getFriendsOpts,
        onRequest: [fastify.jwtAuth],
        handler: friendController.getFriends
    });

    // Route to get a friends status
    fastify.get('/friends/:id/status', {
        ...getFriendStatusOpts,
        onRequest: [fastify.jwtAuth],
        handler: friendController.getFriendStatus
    });

    // Route to remove a friend
    fastify.delete('/friends/:id', {
        ...deleteFriendOpts,
        onRequest: [fastify.jwtAuth],
        handler: friendController.deleteFriend
    });

    // Route to send a friend request
    fastify.post('/friend-requests/:id', {
        ...postFriendOpts,
        onRequest: [fastify.jwtAuth],
        handler: friendController.sendFriendRequest
    });

    // Route to accept a friend request
    fastify.patch('/friend-requests/:id', {
        ...patchFriendOpts,
        onRequest: [fastify.jwtAuth],
        handler: friendController.acceptFriendRequest
    });
}

export default friendRoutes;
