import db from '../models/database.js';
import bcrypt from 'bcryptjs';

const loginUser = async (req, reply) => {
	const { username, password } = req.body;
	
	try {
		const user = db.prepare(`SELECT * FROM users WHERE username = ?`).get(username);
		if (!user) {
			return reply.code(401).send({ error: 'Invalid username or password' })
		}

		const isMatch = await bcrypt.compare(password, user.password_hash)
		if (!isMatch) {
			return reply.code(401).send({ error: 'Invalid username or password' })
		}
		
		const userForToken = {
			username: user.username,
			id: user.id,
		}

		const token = await reply.jwtSign(
			userForToken, 
			{ expiresIn: '1h' }
		)
		
		db.prepare(`UPDATE users
			SET online_status = TRUE
			WHERE id = ? 
			AND online_status = FALSE
			`).run(user.id)

		return reply.send({ token, username: user.username })
	} catch (error) {
		return reply.code(500).send({ error: 'Internal Server Error' })
	}
}

const logoutUser = async (req, reply) => {
	const userId = req.user.id;
	
	try {
		const userExist = db.prepare(`SELECT COUNT(*) AS count FROM users WHERE id = ?`).get(userId);
		if (!userExist.count) {
			return reply.code(404).send({ error: 'User not found' });
		}

		const result = db.prepare(`UPDATE users 
			SET online_status = FALSE 
			WHERE id = ? 
			AND online_status = TRUE
			`).run(userId);
		if (result.changes === 0) {
			return reply.code(404).send({ error: 'User already logged out' });
		}
		return reply.code(200).send({ message: 'Logged out successfully' })
	} catch (error) {
		reply.code(500).send({ error: 'Internal Server Error' })
	}
}

const createUser = async (req, reply) => {
	const { username, email, password } = req.body;
	const saltRounds = parseInt(process.env.SALT_ROUNDS, 10) || 10;

	try {
		const passwordHash = await bcrypt.hash(password, saltRounds);
		const result = db.prepare('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)').run(username, email, passwordHash);

		const user = db.prepare('SELECT id, username, email FROM users WHERE id = ?').get(result.lastInsertRowid);

		return reply.code(201).send({ 
			message: 'User created successfully',
			user
		});
	} catch (error) {
		if (error.message.includes('UNIQUE constraint failed')) {
			return reply.code(409).send({ error: 'Username or email already exists' });
		}
		return reply.code(500).send({ error: 'Internal server error' });
	}
}

export default {
	loginUser,
	logoutUser,
	createUser
}
 