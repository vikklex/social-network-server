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

  getAllPosts = async (req, res) => {
    const result = await postsService.getAllPosts(req.params.userId);

    console.log(result);
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

  uploadImage = async (req, res) => {
    const result = await postsService.uploadImage(req);
    res.status(result.status).send(result.body);
  };

  likePost = async (req, res) => {
    const result = await postsService.likePost(req.params.id, req.body.userId);
    res.status(result.status).send(result.body);
  };
}

const postsController = new PostsController();

module.exports = postsController;
