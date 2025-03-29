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

const updateUser = async (req, reply) => {
	const { username } = req.params;
	const { newUsername, password, email, avatar_url, status } = req.body;
	
	if (req.user.username !== username) {
		return reply.code(403).send({ error: 'Unauthoritized to update user information' })
	}
	
	const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
		if (!user) {
			return reply.code(404).send({ error: 'User not found' });
		}
	
	try {
		if (newUsername && newUsername !== user.username) {
			const existingUser = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
			if (existingUser) {
				return reply.code(400).send({ error: 'Username already taken '});
			}
		}
		
		const updateUser = {
			username: newUsername ?? user.username,
			password: user.password,
			email: email ?? user.email,
			avatar_url: avatar_url ?? user.avatar_url,
			status: status ?? user.status,
		}
		
		if (password) {
			const saltRounds = parseInt(process.env.SALT_ROUNDS, 10) || 10;
			updateUser.password = await bcrypt.hash(password, saltRounds)
		}
		
		db.prepare(`
			UPDATE users
			set username = ?, password = ?, email = ?, avatar_url = ?, status = ?
			WHERE username = ?
		`).run(updateUser.username, updateUser.password, updateUser.email, updateUser.avatar_url, updateUser.status, user.username)
		
		return reply.send({
			message: 'User updated successfully',
			user: {
				username: updateUser.username,
				email: updateUser.email,
				avatar_url: updateUser.avatar_url,
				status: updateUser.status,
			},
		});
	} catch (error) {
		return reply.code(500).send({ error: 'Internal server error '})
	}
};

export default { 
	getUsers, 
	getUser, 
	createUser,
	updateUser,
};
