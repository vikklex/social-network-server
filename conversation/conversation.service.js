const Conversation = require('../models/Conversation');

const SERVER_ERROR = { status: '500', body: 'Server error' };

const setConversationBody = (conversation) => {
  return {
    id: conversation._id,
    participants: conversation.participants,
    createdAt: conversation.createdAt,
    updatedAt: conversation.updatedAt,
  };
};

class ConversationService {
  async createConversation(body) {
    const newConversation = new Conversation({
      participants: [body.senderId, body.receiverId],
    });

    const sameConversation = await Conversation.findOne({
      participants: { $all: [body.receiverId, body.senderId] },
    });

    try {
      if (sameConversation) {
        return { status: '200', body: setConversationBody(sameConversation) };
      } else {
        const savedConversation = await newConversation.save();

        return { status: '200', body: setConversationBody(savedConversation) };
      }
    } catch (err) {
      return SERVER_ERROR;
    }
  }

  async getConversation(id) {
    try {
      const conversations = await Conversation.find({
        participants: { $in: [id] },
      });

      const conversation = [];

      conversations.forEach((p) => {
        conversation.push(setConversationBody(p));
      });

      return { status: '200', body: conversation };
    } catch (err) {
      return SERVER_ERROR;
    }
  }
}
const conversationService = new ConversationService();

module.exports = conversationService;
