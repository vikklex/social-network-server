const postsService = require('./posts.service');

class PostsController {
  createPost = async (req, res) => {
    const result = await postsService.createPost(req.body);
    res.status(result.status).send(result.body);
  };

  getPost = async (req, res) => {
    const result = await postsService.getPost(req.params.id);
    res.status(result.status).send(result.body);
  };

  getAllUserPosts = async (req, res) => {
    const result = await postsService.getAllUserPosts(req.params.first_name);
    res.status(result.status).send(result.body);
  };

  getAllFollowingsPosts = async (req, res) => {
    const result = await postsService.getAllFollowingsPosts(req.params.userId);
    res.status(result.status).send(result.body);
  };

  deletePost = async (req, res) => {
    const result = await postsService.deletePost(
      req.params.id,
      req.body.userId,
    );
    res.status(result.status).send(result.body);
  };

  updatePost = async (req, res) => {
    const result = await postsService.updatePost(req.params.id, req.body);
    res.status(result.status).send(result.body);
  };

  likePost = async (req, res) => {
    const result = await postsService.likePost(req.params.id, req.body.userId);
    res.status(result.status).send(result.body);
  };
}

const postsController = new PostsController();

module.exports = postsController;