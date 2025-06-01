import db from '../models/database.js';
import bcrypt from 'bcryptjs';

// Fetch all users
const getUsers = async (req, reply) => {
    try {
        const users = db.prepare('SELECT * FROM users').all();
        return reply.send(users);
    } catch (error) {
        console.error(error);
        return reply.code(500).send({ error: 'Failed to fetch users' });
    }
};

// Fetch a single user by ID
const getUser = async (req, reply) => {
    const { id } = req.params;

    try {
        const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
        if (!user) {
            return reply.code(404).send({ error: 'User not found' });
        }
        return reply.send(user);
    } catch (error) {
        console.error(error);
        return reply.code(500).send({ error: 'Failed to fetch user' });
    }
};

// Update user information
const updateUser = async (req, reply) => {
    const { id } = req.params;
    const { username, password, email, avatar_url } = req.body;

    // Check if the authenticated user matches the user being updated
    if (req.user.id !== parseInt(id)) {
        return reply.code(403).send({ error: 'Unauthorized to update this user\'s information' });
    }

    try {
        const user = db.prepare('SELECT * FROM users WHERE id = ?').get(parseInt(id));
        if (!user) {
            return reply.code(404).send({ error: 'User not found' });
        }

        // Check if the new username already exists
        if (username && username !== user.username) {
            const existingUser = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
            if (existingUser) {
                return reply.code(400).send({ error: 'Username already taken' });
            }
        }

        // Check if the new email already exists
        if (email && email !== user.email) {
            const existingEmail = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
            if (existingEmail) {
                return reply.code(400).send({ error: 'Email already in use' });
            }
        }

        // Prepare the user data for update
        const updateUser = {
            username: username ?? user.username,
            password_hash: user.password_hash,
            email: email ?? user.email,
            avatar_url: avatar_url ?? user.avatar_url,
        };

        // Hash new password if provided
        if (password) {
            const saltRounds = parseInt(process.env.SALT_ROUNDS, 10) || 10;
            updateUser.password_hash = await bcrypt.hash(password, saltRounds);
        }

        // Update the user record in the database
        db.prepare(`
            UPDATE users
            SET username = ?, password_hash = ?, email = ?, avatar_url = ?
            WHERE id = ?
        `).run(updateUser.username, updateUser.password_hash, updateUser.email, updateUser.avatar_url, parseInt(id));

        const fullUser = db.prepare(`
            SELECT
                id,
                username,
                email,
                avatar_url,
                online_status,
                created_at,
                two_fa_enabled
            FROM users
            WHERE id = ?
        `).get(parseInt(id));

        fullUser.avatar_url = fullUser.avatar_url ?? '';
        fullUser.online_status = Boolean(fullUser.online_status);
        fullUser.two_fa_enabled = Boolean(fullUser.two_fa_enabled);

        return reply.send({
            message: 'User updated successfully',
            item: fullUser,
        });
    } catch (error) {
        console.error(error);
        return reply.code(500).send({ error: 'Internal server error' });
    }
};

// Delete a friend from the user's friend list
const deleteUser = async (req, reply) => {
    const user_id = req.user.id;

    try {
        // Remove the user
        const result = db.prepare(`
            DELETE FROM users
            WHERE id = ?
        `).run(user_id);

        console.log("deleting user");
        if (result.changes === 0) {
            return reply.code(404).send({ error: 'User not authorized to delete friend' });
        }

        // Successfully removed the user
        return reply.code(200).send({ message: 'User removed successfully' });
    } catch (error) {
        console.log(error);
        return reply.code(500).send({ error: 'Failed to delete user' });
    }
}

export default {
    getUsers,
    getUser,
    updateUser,
    deleteUser
};
