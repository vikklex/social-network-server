const Router = require('express').Router;
const postsController = require('./posts.controller');
const filesMiddleware = require('./../middleware/files.middleware');

const router = new Router();

router
  .post('/', filesMiddleware.single('img'), postsController.createPost)
  .get('/:id', postsController.getPost)
  .get('/profile/:first_name', postsController.getAllUserPosts)
  .get('/timeline/:userId', postsController.getAllPosts)
  .delete('/:id', postsController.deletePost)
  .put('/:id', postsController.updatePost)
  .put('/:id/like', postsController.likePost)
  .put(
    '/:id/post-image',
    filesMiddleware.array('img', 6),
    postsController.uploadImage,
  );

module.exports = router;
