const Message = require('../models/Message');

const SERVER_ERROR = { status: '500', body: 'Server error' };

const setMessageBody = (message) => {
  return {
    id: message._id,
    sender: message.sender,
    text: message.text,
    createdAt: message.createdAt,
    updatedAt: message.updatedAt,
  };
};

class MessagesService {
  async createMessage(body) {
    const newMessage = new Message(body);

    try {
      const savedMessage = await newMessage.save();

      return { status: '200', body: savedMessage };
    } catch (err) {
      return SERVER_ERROR;
    }
  }

  async getMessage(id) {
    try {
      const messages = await Message.find({
        conversationId: id,
      });

      const message = [];

      messages.forEach((m) => {
        message.push(setMessageBody(m));
      });

      return { status: '200', body: message };
    } catch (err) {
      return SERVER_ERROR;
    }
  }
}
const messagesService = new MessagesService();

module.exports = messagesService;
