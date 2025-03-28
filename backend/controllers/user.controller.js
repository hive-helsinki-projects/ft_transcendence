import db from '../models/database.js';
import bcrypt from 'bcryptjs';

const getUsers = async (req, reply) => {
	try {
		const users = db.prepare('SELECT * FROM users').all();
		return reply.send(users);
	} catch (error) {
		return reply.code(500).send({ error: 'Failed to fetch users' });
	}
}

const getUser = async (req, reply) => {
	const { username } = req.params
	try {
		const stmt = db.prepare('SELECT * FROM users WHERE username = ?')
		const user = stmt.get(username);
		
		if (!user) {
			return reply.code(404).send({ error: 'User not found' })
		}
		return reply.send(user)
	} catch (error) {
			return reply.code(500).send({ error: 'Failed to fetch user' })
	}
}

const createUser = async (req, reply) => {
	const { username, email, password } = req.body;
	const saltRounds = parseInt(process.env.SALT_ROUNDS, 10) || 10;

	try {
		const passwordHash = await bcrypt.hash(password, saltRounds);
		db.prepare('INSERT INTO users (username, email, password) VALUES (?, ?, ?)').run(username, email, passwordHash);
		return reply.status(201).send({ message: 'User created successfully' });
	} catch (error) {
		if (error.message.includes('UNIQUE constraint failed')) {
			return reply.code(409).send({ error: 'Username or email already exists' });
		}
		return reply.code(500).send({ error: 'Database error' })
	}
}

export default { 
	getUsers, 
	getUser, 
	createUser 
};
