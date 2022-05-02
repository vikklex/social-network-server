const Router = require('express').Router;
const reactionsController = require('./reactions.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = new Router();

router
  .post('/', authMiddleware, reactionsController.createReaction)
  .get('/:id', authMiddleware, reactionsController.getAllPostReactions)
  .get('/user/:id', authMiddleware, reactionsController.getAllUserReactions);

module.exports = router;
