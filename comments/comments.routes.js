const Router = require('express').Router;
const authMiddleware = require('./../middleware/auth.middleware');

const commentsController = require('./comments.controller');

const router = new Router();

router
  .post('/', commentsController.createComment)
  .get('/timeline/:postId', commentsController.getComments)
  .put('/:id', commentsController.updateComment);

module.exports = router;

module.exports = router;
