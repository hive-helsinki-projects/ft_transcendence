import userController from '../controllers/user.controller.js';

async function userRoutes(fastify, options) {
  fastify.get('/users', userController.getUsers);
  fastify.post('/users', userController.createUser);
}

export default userRoutes;
