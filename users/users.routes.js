const Router = require('express').Router;
const usersController = require('./users.controller');
const authMiddleware = require('./../middleware/auth.middleware');
const filesMiddleware = require('./../middleware/files.middleware');

const router = new Router();

router
  .get('/:id', /*authMiddleware,*/ usersController.getUser)
  .put('/search/search', authMiddleware, usersController.searchUser)
  .put('/:id', authMiddleware, usersController.updateUser)
  .put('/:id/follow', usersController.followUser)
  .put('/:id/unfollow', usersController.unfollowUser)
  .put(
    '/:id/user-profile',
    filesMiddleware.single('avatar'),
    authMiddleware,
    usersController.uploadAvatar,
  )
  .put(
    '/:id/user-album',
    filesMiddleware.array('album', 10),
    authMiddleware,
    usersController.uploadAlbum,
  )
  .delete('/:id', authMiddleware, usersController.deleteUser)
  .delete('/:id/user-avatar', authMiddleware, usersController.deleteAvatar)
  .delete(
    '/:id/album-image',
    authMiddleware,
    usersController.deleteImageFromAlbum,
  );

module.exports = router;
