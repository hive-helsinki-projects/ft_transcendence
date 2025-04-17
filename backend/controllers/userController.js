import db from '../models/database.js';
import bcrypt from 'bcryptjs';

const getUsers = async (req, reply) => {
	try {
		const users = db.prepare(`SELECT * FROM users`).all()
		return reply.send(users);
	} catch (error) {
		return reply.code(500).send({ error: 'Failed to fetch users' });
	}
}

const getUser = async (req, reply) => {
	const { id } = req.params

	try {
		const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id)
		
		if (!user) {
			return reply.code(404).send({ error: 'User not found' })
		}
		return reply.send(user)
	} catch (error) {
			return reply.code(500).send({ error: 'Failed to fetch user' })
	}
}

const updateUser = async (req, reply) => {
	const { id } = req.params;
	const { username, password, email, avatar_url } = req.body;

	if (req.user.id !== parseInt(id)) {
		return reply.code(403).send({ error: 'Unauthoritized to update user information' })
	}
	
	try {
		const user = db.prepare('SELECT * FROM users WHERE id = ?').get(parseInt(id));
		if (!user) {
			return reply.code(404).send({ error: 'User not found' });
		}
		
		if (username && username !== user.username) {
			const existingUser = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
			if (existingUser) {
				return reply.code(400).send({ error: 'Username already taken '});
			}
		}
		
		const updateUser = {
			username: username ?? user.username,
			password_hash: user.password_hash,
			email: email ?? user.email,
			avatar_url: avatar_url ?? user.avatar_url
		}
		
		if (password) {
			const saltRounds = parseInt(process.env.SALT_ROUNDS, 10) || 10;
			updateUser.password_hash = await bcrypt.hash(password, saltRounds)
		}
		
		db.prepare(`
			UPDATE users
			SET username = ?, password_hash = ?, email = ?, avatar_url = ?
			WHERE username = ?
		`).run(updateUser.username, updateUser.password_hash, updateUser.email, updateUser.avatar_url, user.username)
		
		return reply.code(200).send({
			message: 'User updated successfully',
			item: updateUser
		});
	} catch (error) {
		console.log(error)
		return reply.code(500).send({ error: 'Internal server error '})
	}
};

export default { 
	getUsers, 
	getUser,
	updateUser
};
