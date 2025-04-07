import db from '../models/database.js';

const getFriends = async (req, reply) => {
    const user_id = req.user.id;

    try {
        const friends = db.prepare(`
            SELECT * 
            FROM friends 
            WHERE user_id = ? OR friend_id = ?
        `).all(user_id, user_id);
        if (friends.length === 0) {
            return reply.code(404).send({ error: 'No friends found for this user' });
        }
        return reply.code(200).send(friends);
    } catch (error) {
        return reply.code(500).send({ error: 'Failed to fetch friends' });
    }
}

const deleteFriend = async (req, reply) => {
    const user_id = req.user.id;
    const friend_id = parseInt(req.params.id);

    try {
        const result = db.prepare(`
            DELETE FROM friends 
            WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)
        `).run(user_id, friend_id, friend_id, user_id);
        if (result.changes === 0) {
            return reply.code(404).send({ error: 'Friend not found user not authoritized to delete friend' });
        }
        return reply.code(200).send({ message: 'Friend removed successfully' });
    } catch (error) {
        console.log(error);
        return reply.code(500).send({ error: 'Failed to remove friend' });
    }
}

const sendRequest = async (req, reply) => {
    const user_id = req.user.id;
    const friend_id = parseInt(req.params.id);

    try {
        if (user_id === friend_id) {
            return reply.code(400).send({ error: 'Cannot send friend request to yourself' });
        }

        const existingRequest = db.prepare(`
            SELECT status 
            FROM friends 
            WHERE user_id = ? AND friend_id = ? OR friend_id = ? AND user_id = ?
        `).get(user_id, friend_id, user_id, friend_id);

        if (existingRequest === 'pending') {
            return reply.code(400).send({ error: 'Friend request already exists' });
        } else if (existingRequest === 'accepted') {
            return reply.code(400).send({ error: 'Already friends' });
        }
        const result = db.prepare(`
            INSERT INTO friends (user_id, friend_id)
            VALUES (?, ?)
        `).run(user_id, friend_id);

        return reply.code(200).send({ message: 'Friend request sent successfully' });
    } catch (error) {
        return reply.code(500).send({ error: 'Failed to send friend request' });
    }
}

// const acceptRequest = async (req, reply) => {
    
// }

export default {
    getFriends,
    sendRequest,
    deleteFriend
}