const Router = require('express').Router;
const authMiddleware = require('./../middleware/auth.middleware');

const commentsController = require('./comments.controller');

const router = new Router();

router
  .post('/', authMiddleware, commentsController.createComment)
  .get('/timeline/:postId', authMiddleware, commentsController.getComments)
  .put('/:id', commentsController.updateComment)
  .delete('/:id', commentsController.deleteComment);

module.exports = router;

module.exports = router;
