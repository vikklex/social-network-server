const Router = require('express').Router;
const reactionsController = require('./reactions.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = new Router();

router
  .post('/', reactionsController.createReaction)
  .post('/date/:id', authMiddleware, reactionsController.getReactionsFromDate)
  .get('/:id', authMiddleware, reactionsController.getAllPostReactions)
  .get('/likedUser/:id', reactionsController.getAllReactionsForUser)
  .get('/user/:id', authMiddleware, reactionsController.getAllUserReactions);

module.exports = router;
