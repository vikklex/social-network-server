const messagesService = require('./messages.service');

class MessagesController {
  createMessage = async (req, res) => {
    const result = await messagesService.createMessage(req.body);
    res.status(result.status).send(result.body);
  };

  getMessage = async (req, res) => {
    const result = await messagesService.getMessage(req.params.id);
    res.status(result.status).send(result.body);
  };
}

const messagesController = new MessagesController();

module.exports = messagesController;
