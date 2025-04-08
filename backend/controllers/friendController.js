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

const sendFriendRequest = async (req, reply) => {
    const user_id = req.user.id;
    const friend_id = parseInt(req.params.id);

    try {
        if (user_id === friend_id) {
            return reply.code(400).send({ error: 'Cannot send friend request to yourself' });
        }

        const existingRequest = db.prepare(`
            SELECT status 
            FROM friends 
            WHERE user_id = ? AND friend_id = ?
        `).get(friend_id, user_id);
        if (existingRequest && existingRequest.status === 'pending') {
            return reply.code(400).send({ error: 'Friend request already exists' });
        } else if (existingRequest && existingRequest.status === 'accepted') {
            return reply.code(400).send({ error: 'Already friends' });
        }
        db.prepare(`
            INSERT INTO friends (user_id, friend_id)
            VALUES (?, ?)
        `).run(user_id, friend_id);

        const friend = db.prepare(`
            SELECT * FROM friends 
            WHERE user_id = ? AND friend_id = ?
        `).get(user_id, friend_id);

        return reply.code(200).send({ 
            message: 'Friend request sent successfully', 
            friend
        });
    } catch (error) {
        if (error.message.includes('UNIQUE constraint failed')) {
            return reply.code(409).send({ error: 'Friend request already exists' });
        }
        console.log(error);
        return reply.code(500).send({ error: 'Failed to send friend request' });
    }
}

const acceptFriendRequest = async (req, reply) => {
    const user_id = req.user.id;
    const friend_id = parseInt(req.params.id);

    try {
        let existingRequest = db.prepare(`SELECT * FROM friends WHERE user_id = ? AND friend_id = ?`).get(user_id, friend_id);
        if (existingRequest) {
            if (existingRequest.status === 'accepted') {
                return reply.code(400).send({ error: 'Already friends' });
            }
            return reply.code(400).send({ error: 'Waiting for friend to accept request' });
        }

        existingRequest = db.prepare(`SELECT * FROM friends WHERE user_id = ? AND friend_id = ?`).get(friend_id, user_id);
        if (!existingRequest) {
            return reply.code(404).send({ error: 'Friend request not found' });
        } else if (existingRequest && existingRequest.status === 'accepted') {
            return reply.code(400).send({ error: 'Already friends' });
        }

        db.prepare(`
            UPDATE friends 
            SET status = 'accepted' 
            WHERE user_id = ? AND friend_id = ?
        `).run(friend_id, user_id);

        const friend = db.prepare(`
            SELECT * FROM friends 
            WHERE user_id = ? AND friend_id = ?
        `).get(friend_id, user_id);
        return reply.code(200).send({ 
            message: 'Friend request accepted successfully', 
            friend
        });
    } catch (error) {
        console.log(error);
        return reply.code(500).send({ error: 'Failed to accept friend request' });
    }
}

const getFriendStatus = async (req, reply) => {
    const user_id = req.user.id;
    const friend_id = parseInt(req.params.id);

    try {
        const friends = db.prepare(`
            SELECT status 
            FROM friends 
            WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)
        `).get(user_id, friend_id, friend_id, user_id);
        if (!friends) {
            return reply.code(404).send({ error: 'Friend not found' });
        } else if (friends.status === 'pending') {
            return reply.code(400).send({ error: 'Friend request pending' });
        }

        const friend = db.prepare(`
            SELECT username, online_status FROM users 
            WHERE id = ?
        `).get(friend_id);
        return reply.code(200).send(friend);
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
    getFriendStatus
}