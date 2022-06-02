const Router = require('express').Router;
const authMiddleware = require('./../middleware/auth.middleware');

const commentsController = require('./comments.controller');

const router = new Router();

router
  .get('/timeline/:postId', authMiddleware, commentsController.getComments)

  .post('/', authMiddleware, commentsController.createComment)

  .put('/:id', authMiddleware, commentsController.updateComment)

  .delete('/:id', authMiddleware, commentsController.deleteComment);

module.exports = router;

module.exports = router;
