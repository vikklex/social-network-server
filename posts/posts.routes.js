const Router = require('express').Router;
const postsController = require('./posts.controller');

const router = new Router();

router
  .post('/', postsController.createPost)
  .get('/:id', postsController.getPost)
  .get('/profile/:first_name', postsController.getAllUserPosts)
  .get('/timeline/:userId', postsController.getAllFollowingsPosts)
  .delete('/:id', postsController.deletePost)
  .put('/:id', postsController.updatePost)
  .put('/:id/like', postsController.likePost);

module.exports = router;
