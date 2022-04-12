const Router = require('express').Router;
const usersController = require('./users.controller');
const authMiddleware = require('./../middleware/auth.middleware');
const filesMiddleware = require('./../middleware/files.middleware');

const router = new Router();

router
  .get('/:id', usersController.getUser)
  .get('/search/search', usersController.searchUser)
  .delete('/:id', usersController.deleteUser)
  .put('/:id', usersController.updateUser)
  .put('/:id/follow', usersController.followUser)
  .put('/:id/unfollow', usersController.unfollowUser)
  .put(
    '/:id/user-profile',
    filesMiddleware.single('avatar'),
    usersController.uploadAvatar,
  );
module.exports = router;
