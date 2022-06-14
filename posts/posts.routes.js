const Router = require('express').Router;
const postsController = require('./posts.controller');
const authMiddleware = require('./../middleware/auth.middleware');
const filesMiddleware = require('./../middleware/files.middleware');

const router = new Router();

router
  .get('/:id', authMiddleware, postsController.getPost)
  .get('/timeline/:userId', authMiddleware, postsController.getAllPosts)
  .get('/friendsPosts/:id', authMiddleware, postsController.getAllFriendsPosts)

  .post(
    '/',
    authMiddleware,
    filesMiddleware.single('img'),
    postsController.createPost,
  )

  .put('/:id', authMiddleware, postsController.updatePost)
  .put('/:id/like', authMiddleware, postsController.likePost)
  .put(
    '/:id/post-image',
    authMiddleware,
    filesMiddleware.array('img', 8),
    postsController.uploadImage,
  )

  .delete('/:id', authMiddleware, postsController.deletePost);

module.exports = router;
