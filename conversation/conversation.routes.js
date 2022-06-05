const Router = require('express').Router;
const conversationController = require('./conversation.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = new Router();

router
  .get('/:id', /*authMiddleware,*/ conversationController.getConversation)
  .post('/', /*authMiddleware,*/ conversationController.createConversation);

module.exports = router;
