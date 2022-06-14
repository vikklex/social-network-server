const conversationService = require('./conversation.service');

class ConversationController {
  createConversation = async (req, res) => {
    const result = await conversationService.createConversation(req.body);
    res.status(result.status).send(result.body);
  };

  getConversation = async (req, res) => {
    const result = await conversationService.getConversation(req.params.id);
    res.status(result.status).send(result.body);
  };
}

const conversationController = new ConversationController();

module.exports = conversationController;
