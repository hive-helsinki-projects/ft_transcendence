import db from '../models/database.js';

// Get all friends of the current user
const getFriends = async (req, reply) => {
    const user_id = req.user.id;

    try {
        // Fetch friends from the database where the user is either the user_id or friend_id
        const friends = db.prepare(`
            SELECT * 
            FROM friends 
            WHERE user_id = ? OR friend_id = ?
        `).all(user_id, user_id);

        // If no friends are found, return an error
        if (friends.length === 0) {
            return reply.code(404).send({ error: 'No friends found for this user' });
        }

        // Send the list of friends if found
        return reply.code(200).send(friends);
    } catch (error) {
        return reply.code(500).send({ error: 'Failed to fetch friends' });
    }
}

// Delete a friend from the user's friend list
const deleteFriend = async (req, reply) => {
    const user_id = req.user.id;
    const friend_id = parseInt(req.params.id);

    try {
        // Remove the friendship from the database by matching both user_id and friend_id
        const result = db.prepare(`
            DELETE FROM friends 
            WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)
        `).run(user_id, friend_id, friend_id, user_id);

        // If no changes were made, the friend wasn't found or the user was not authorized to delete the friend
        if (result.changes === 0) {
            return reply.code(404).send({ error: 'Friend not found or user not authorized to delete friend' });
        }

        // Successfully removed the friend
        return reply.code(200).send({ message: 'Friend removed successfully' });
    } catch (error) {
        console.log(error);
        return reply.code(500).send({ error: 'Failed to remove friend' });
    }
}

// Send a friend request to another user
const sendFriendRequest = async (req, reply) => {
    const user_id = req.user.id;
    const friend_id = parseInt(req.params.id);

    try {
        // Prevent the user from sending a friend request to themselves
        if (user_id === friend_id) {
            return reply.code(400).send({ error: 'Cannot send friend request to yourself' });
        }

        // Check if there is already an accepted friend relationship between the two users
        const existingRequest = db.prepare(`
            SELECT status 
            FROM friends 
            WHERE user_id = ? AND friend_id = ?
            OR friend_id = ? AND user_id = ?
        `).get(friend_id, user_id, friend_id, user_id);

        // If already friends, prevent sending a new request
        if (existingRequest && existingRequest.status === 'accepted') {
            return reply.code(400).send({ error: 'Already friends' });
        }

        // Insert the friend request into the database (status will default to null or pending)
        db.prepare(`
            INSERT INTO friends (user_id, friend_id)
            VALUES (?, ?)
        `).run(user_id, friend_id);

        // Fetch the newly inserted friend request
        const friend = db.prepare(`
            SELECT * FROM friends 
            WHERE user_id = ? AND friend_id = ?
        `).get(user_id, friend_id);

        // Return the friend request details
        return reply.code(200).send({ 
            message: 'Friend request sent successfully', 
            item: friend
        });
    } catch (error) {
        // Handle case where a duplicate friend request already exists
        if (error.message.includes('UNIQUE constraint failed')) {
            return reply.code(409).send({ error: 'Friend request already exists' });
        }
        console.log(error);
        return reply.code(500).send({ error: 'Failed to send friend request' });
    }
}

// Accept a pending friend request
const acceptFriendRequest = async (req, reply) => {
    const user_id = req.user.id;
    const friend_id = parseInt(req.params.id);

    try {
        // Check if there is an existing request from user_id to friend_id
        let existingRequest = db.prepare(`SELECT * FROM friends WHERE user_id = ? AND friend_id = ?`).get(user_id, friend_id);
        if (existingRequest) {
            // If already accepted, return an error
            if (existingRequest.status === 'accepted') {
                return reply.code(400).send({ error: 'Already friends' });
            }
            return reply.code(400).send({ error: 'Waiting for friend to accept request' });
        }

        // Check if there is an existing request from friend_id to user_id
        existingRequest = db.prepare(`SELECT * FROM friends WHERE user_id = ? AND friend_id = ?`).get(friend_id, user_id);
        if (!existingRequest) {
            // If no request found, return an error
            return reply.code(404).send({ error: 'Friend request not found' });
        } else if (existingRequest && existingRequest.status === 'accepted') {
            // If already accepted, return an error
            return reply.code(400).send({ error: 'Already friends' });
        }

        // Update the request status to 'accepted'
        db.prepare(`
            UPDATE friends 
            SET status = 'accepted' 
            WHERE user_id = ? AND friend_id = ?
        `).run(friend_id, user_id);

        // Fetch the updated friend relationship details
        const friend = db.prepare(`
            SELECT * FROM friends 
            WHERE user_id = ? AND friend_id = ?
        `).get(friend_id, user_id);

        // Return the successful acceptance message and friend details
        return reply.code(200).send({ 
            message: 'Friend request accepted successfully', 
            item: friend
        });
    } catch (error) {
        console.log(error);
        return reply.code(500).send({ error: 'Failed to accept friend request' });
    }
}

// Get the current online status of friend (e.g., online, offline)
const getFriendOnlineStatus = async (req, reply) => {
    const user_id = req.user.id;
    const friend_id = parseInt(req.params.id);

    try {
        // Fetch the status of the relationship from the database
        const friends = db.prepare(`
            SELECT status 
            FROM friends 
            WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)
        `).get(user_id, friend_id, friend_id, user_id);

        // If no relationship found, return an error
        if (!friends) {
            return reply.code(404).send({ error: 'Friend not found' });
        } else if (friends.status === 'pending') {
            // If the relationship is pending, return a specific message
            return reply.code(400).send({ error: 'Friend request pending' });
        }

        // Fetch the friend's details, including their username and online status
        const friend = db.prepare(`
            SELECT username, online_status FROM users 
            WHERE id = ?
        `).get(friend_id);

        // Return the friend's details
        return reply.code(200).send(friend);
    } catch (error) {
        console.log(error);
        return reply.code(500).send({ error: 'Failed to fetch friend status' });
    }
}

// Get the current status of the friend relationship (e.g., pending, accepted)
const getFriendStatus = async (req, reply) => {
    const user_id = req.user.id;
    const friend_id = parseInt(req.params.id);

    try {
        // Fetch the status of the relationship from the database
        const friends = db.prepare(`
            SELECT * 
            FROM friends 
            WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)
        `).get(user_id, friend_id, friend_id, user_id);

        // If no relationship found, return an error
        if (!friends) {
            return reply.code(404).send({ error: 'Friendship not found' });
        }
        
        return reply.code(200).send({ item: friends });
    } catch (error) {
        console.log(error);
        return reply.code(500).send({ error: 'Failed to fetch friend status' });
    }
}

export default {
    getFriends,
    sendFriendRequest,
    deleteFriend,
    acceptFriendRequest,
    getFriendOnlineStatus,
    getFriendStatus
};
