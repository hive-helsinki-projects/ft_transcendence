import friendController from '../controllers/friendController.js';
import { getFriendsOpts, deleteFriendOpts, postFriendOpts, patchFriendOpts } from '../models/friendSchemas.js'; 

function friendRoutes(fastify, options) {
    // Route to get all friends of a user
    fastify.get('/friends', {
        ...getFriendsOpts,
        onRequest: [fastify.jwtAuth],
        handler: friendController.getFriends
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
        handler: friendController.sendRequest
    });

    // Route to accept a friend request
    fastify.patch('/friend-requests/:id', {
        ...patchFriendOpts,
        onRequest: [fastify.jwtAuth],
        handler: friendController.acceptRequest
    });
}

export default friendRoutes;
