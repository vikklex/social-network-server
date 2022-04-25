const Router = require('express').Router;

const authController = require('./auth.controller');
const filesMiddleware = require('./../middleware/files.middleware');

const router = new Router();

router
  .post(
    '/registration',
    filesMiddleware.single('avatar'),
    authController.createUser,
  )
  .post('/login', authController.loginUser)
  .post('/logout', authController.logoutUser)
  .post('/refresh_token', authController.generateAccessToken);

module.exports = router;
