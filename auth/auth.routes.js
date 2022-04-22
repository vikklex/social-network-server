const { check } = require('express-validator');
const Router = require('express').Router;

const authController = require('./auth.controller');
const authMiddleware = require('./../middleware/auth.middleware');
const filesMiddleware = require('./../middleware/files.middleware');

const router = new Router();

const check_utils = [
  check('email', 'Non-correct email').isEmail(),
  check(
    'password_hash',
    'Password must be longer than 6 and shorter than 12',
  ).isLength({ min: 6, max: 15 }),
];

router
  .post(
    '/registration',
    filesMiddleware.single('avatar'),
    authController.createUser,
  )
  .post('/login', authController.loginUser)
  .get('/authorization', authMiddleware, authController.authUser)
  .post('/logout', authController.logoutUser)
  .post('/refresh_token', authController.generateAccessToken);

module.exports = router;
