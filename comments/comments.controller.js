const commentsService = require('./comments.service');

class CommentsController {
  createComment = async (req, res) => {
    const result = await commentsService.createComment(req.body);
    res.status(result.status).send(result.body);
  };

  getComments = async (req, res) => {
    const result = await commentsService.getComments(req.params.postId);
    res.status(result.status).send(result.body);
  };

  updateComment = async (req, res) => {
    const result = await commentsService.updateComment(req.params.id, req.body);
    res.status(result.status).send(result.body);
  };
}

const commentsController = new CommentsController();

module.exports = commentsController;
