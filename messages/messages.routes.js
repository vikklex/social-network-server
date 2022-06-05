const Router = require('express').Router;
const messagesController = require('./messages.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = new Router();

router
  .post('/', /*authMiddleware, */ messagesController.createMessage)
  .get('/:id', /*authMiddleware, */ messagesController.getMessage);

module.exports = router;
