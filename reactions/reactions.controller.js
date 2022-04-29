const reactionsService = require('./reactions.service');

class ReactionsController {
  createReaction = async (req, res) => {
    const result = await reactionsService.createReaction(req.body);
    res.status(result.status).send(result.body);
  };

  getAllPostReactions = async (req, res) => {
    const result = await reactionsService.getAllPostReactions(req.params.id);
    res.status(result.status).send(result.body);
  };

  getAllUserReactions = async (req, res) => {
    const result = await reactionsService.getAllUserReactions(req.params.id);
    res.status(result.status).send(result.body);
  };
}

const reactionsController = new ReactionsController();

module.exports = reactionsController;
