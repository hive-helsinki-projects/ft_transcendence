import db from '../models/database.js';
import bcrypt from 'bcryptjs';

const getUsers = async (req, reply) => {
	try {
		const users = db.prepare(`
			SELECT * FROM users`).all()
		return reply.send(users);
	} catch (error) {
		return reply.code(500).send({ error: 'Failed to fetch users' });
	}
}

const getUser = async (req, reply) => {
	const { id } = req.params

	try {
		const stmt = db.prepare('SELECT * FROM users WHERE id = ?')
		const user = stmt.get(id);
		
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
		return reply.code(500).send({ error: 'Database error' });
	}
}

const updateUser = async (req, reply) => {
	const { id } = req.params;
	const { username, password, email, online_status } = req.body;

	if (req.user.id !== parseInt(id)) {
		return reply.code(403).send({ error: 'Unauthoritized to update user information' })
	}
	
	const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
	if (!user) {
		return reply.code(404).send({ error: 'User not found' });
	}
	
	try {
		if (username && username !== user.username) {
			const existingUser = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
			if (existingUser) {
				return reply.code(400).send({ error: 'Username already taken '});
			}
		}
		
		const updateUser = {
			username: username ?? user.username,
			password_hash: user.password_hash,
			email: email ?? user.email
		}
		
		if (password) {
			const saltRounds = parseInt(process.env.SALT_ROUNDS, 10) || 10;
			updateUser.password_hash = await bcrypt.hash(password, saltRounds)
		}
		
		db.prepare(`
			UPDATE users
			SET username = ?, password_hash = ?, email = ?
			WHERE username = ?
		`).run(updateUser.username, updateUser.password_hash, updateUser.email, user.username)
		
		return reply.code(200).send({
			message: 'User updated successfully',
			user: updateUser
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
