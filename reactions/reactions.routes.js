const Router = require('express').Router;
const reactionsController = require('./reactions.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = new Router();

router
  .get('/:id', authMiddleware, reactionsController.getAllPostReactions)
  .get(
    '/likedUser/:id',
    authMiddleware,
    reactionsController.getAllReactionsForUser,
  )
  .get('/user/:id', authMiddleware, reactionsController.getAllUserReactions)

  .post('/', authMiddleware, reactionsController.createReaction)
  .post('/date/:id', authMiddleware, reactionsController.getReactionsFromDate);

module.exports = router;
