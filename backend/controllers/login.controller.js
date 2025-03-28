import db from '../models/database.js';
import bcrypt from 'bcryptjs';

const loginUser = async (req, reply) => {
	const { username, password } = req.body;
	
	try {
		const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
		if (!user) {
			return reply.code(401).send({ error: 'Invalid username or password' })
		}
		
		const isMatch = await bcrypt.compare(password, user.password)
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
		
		return reply.send({ token, username: user.username })
	} catch (error) {
		return reply.code(500).send({ error: 'Internal Server Error' })
	}
}

export default {
	loginUser,
}
