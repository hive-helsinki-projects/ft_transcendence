import db from '../models/database.js';

const getUsers = async (request, reply) => {
  const users = db.prepare('SELECT * FROM users').all();
  reply.send(users);
};

const createUser = async (request, reply) => {
  const { username } = request.body;
  if (!username) return reply.status(400).send({ error: 'Username is required' });

  try {
    db.prepare('INSERT INTO users (username) VALUES (?)').run(username);
    reply.status(201).send({ message: 'User created successfully' });
  } catch (err) {
    reply.status(500).send({ error: 'Username already exists' });
  }
};

export default { getUsers, createUser };
