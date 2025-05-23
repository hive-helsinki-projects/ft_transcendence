import db from '../models/database.js';
import bcrypt from 'bcryptjs';
import speakeasy from 'speakeasy';

const login2fa = async (req, reply) => {
    const { userId, code } = req.body;

    try {
        // Check if the user has 2FA set up
        const row = db.prepare(`SELECT two_fa_secret FROM users WHERE id = ?`).get(userId);
        if (!row || !row.two_fa_secret) {
            return reply.code(400).send({ error: '2FA is not set up' });
        }

        // Verify the provided TOTP code
        const verified = speakeasy.totp.verify({
            secret:   row.two_fa_secret,
            encoding: 'base32',
            token:    code,
            window:   1,
        });

        if (!verified) {
            return reply.code(400).send({ error: 'Invalid 2FA code' });
        }

        // Generate a JWT token for the user
        const token = await reply.jwtSign({ id: userId });
        return reply.send({ token });
    } catch (error) {
        return reply.code(500).send({ error: 'Internal Server Error' });
    }
}

// Login a user by verifying username and password
const loginUser = async (req, reply) => {
    const { username, password } = req.body;

    try {
        // Check if the user exists by username
        const user = db.prepare(`SELECT * FROM users WHERE username = ?`).get(username);
        if (!user) {
            return reply.code(401).send({ error: 'Invalid username or password' });
        }

        // Compare the provided password with the stored password hash
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return reply.code(401).send({ error: 'Invalid username or password' });
        }

        const { two_fa_enabled } = db
            .prepare(`SELECT two_fa_enabled FROM users WHERE id = ?`)
            .get(user.id);

        if (two_fa_enabled) {
            return reply.code(206).send({
                message: 'Two-factor authentication required',
                userId: user.id,
            });
        }

        // Create a payload for the JWT token
        const userForToken = {
            username: user.username,
            id: user.id,
        };

        // Sign the JWT token with a 1-hour expiry
        const token = await reply.jwtSign(userForToken, { expiresIn: '1h' });

        // Update the user's online status to TRUE
        db.prepare(`UPDATE users
            SET online_status = TRUE
            WHERE id = ?
            AND online_status = FALSE
        `).run(user.id);

        return reply.send({ token, username: user.username, id: user.id });
    } catch (error) {
        return reply.code(500).send({ error: 'Internal Server Error' });
    }
};

// Log out a user by setting online_status to FALSE
const logoutUser = async (req, reply) => {
    const userId = req.user.id;

    try {
        // Check if the user exists in the database
        const userExist = db.prepare(`SELECT COUNT(*) AS count FROM users WHERE id = ?`).get(userId);
        if (!userExist.count) {
            return reply.code(404).send({ error: 'User not found' });
        }

        // Update the user's online status to FALSE
        const result = db.prepare(`UPDATE users
            SET online_status = FALSE
            WHERE id = ?
            AND online_status = TRUE
        `).run(userId);

        // If no changes were made, the user was already logged out
        if (result.changes === 0) {
            return reply.code(404).send({ error: 'User already logged out' });
        }

        return reply.code(200).send({ message: 'Logout successful' });
    } catch (error) {
        return reply.code(500).send({ error: 'Internal Server Error' });
    }
};

// Create a new user and insert into the database
const createUser = async (req, reply) => {
    const { username, email, password } = req.body;
    const saltRounds = parseInt(process.env.SALT_ROUNDS, 10) || 10;

    try {
        // Hash the user's password before saving it to the database
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Insert the new user into the database
        const result = db.prepare('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)').run(username, email, passwordHash);

        // Fetch the newly created user to return in the response
        const user = db.prepare('SELECT id, username, email, online_status, two_fa_enabled, created_at FROM users WHERE id = ?').get(result.lastInsertRowid);

        return reply.code(201).send({
            message: 'User created successfully',
            user
        });
    } catch (error) {
        // Handle the case where the username or email already exists
        if (error.message.includes('UNIQUE constraint failed')) {
            return reply.code(409).send({ error: 'Username or email already exists' });
        }
        return reply.code(500).send({ error: 'Internal server error' });
    }
};

export default {
    loginUser,
    login2fa,
    logoutUser,
    createUser
};
