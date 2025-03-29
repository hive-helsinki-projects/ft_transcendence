import db from '../models/database.js';
import bcrypt from 'bcryptjs';

const getUsers = async (req, reply) => {
	try {
		const users = db.prepare(`
			SELECT * 
			FROM users u
			LEFT JOIN user_online_status uos ON u.id = uos.user_id
			LEFT JOIN user_stats us ON u.id = us.user_id;`).all()

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
		const result = db.prepare('INSERT INTO users (username, display_name, email, password_hash) VALUES (?, ?, ?, ?)').run(username, username, email, passwordHash);
		
		const userId = parseInt(result.lastInsertRowid)
		
		db.prepare('INSERT INTO user_online_status (user_id) VALUES (?)').run(userId);
		db.prepare('INSERT INTO user_stats (user_id) VALUES (?)').run(userId);
		
		return reply.status(201).send({ message: 'User created successfully' });
	} catch (error) {
		if (error.message.includes('UNIQUE constraint failed')) {
			return reply.code(409).send({ error: 'Username or email already exists' });
		}
		return reply.code(500).send({ error: 'Database error' })
	}
}

const updateUser = async (req, reply) => {
	const { id } = req.params;
	const { newUsername, password, email, avatar_url, status } = req.body;

	if (req.user.id !== parseInt(id)) {
		return reply.code(403).send({ error: 'Unauthoritized to update user information' })
	}
	
	const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
	if (!user) {
		return reply.code(404).send({ error: 'User not found' });
	}
	
	try {
		if (newUsername && newUsername !== user.username) {
			const existingUser = db.prepare('SELECT * FROM users WHERE username = ?').get(newUsername);
			if (existingUser) {
				return reply.code(400).send({ error: 'Username already taken '});
			}
		}
		
		const updateUser = {
			username: newUsername ?? user.username,
			password_hash: user.password_hash,
			email: email ?? user.email,
			avatar_url: avatar_url ?? user.avatar_url,
		}
		
		if (password) {
			const saltRounds = parseInt(process.env.SALT_ROUNDS, 10) || 10;
			updateUser.password_hash = await bcrypt.hash(password, saltRounds)
		}
		
		db.prepare(`
			UPDATE users
			set username = ?, password_hash = ?, email = ?, avatar_url = ?, updated_at = CURRENT_TIMESTAMP
			WHERE username = ?
		`).run(updateUser.username, updateUser.password_hash, updateUser.email, updateUser.avatar_url, user.username)
		
		return reply.send({
			message: 'User updated successfully',
			user: {
				username: updateUser.username,
				email: updateUser.email,
				avatar_url: updateUser.avatar_url
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
