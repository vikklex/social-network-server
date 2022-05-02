const Reaction = require('../models/Reaction');
const Post = require('../models/Post');
const User = require('../models/User');

const SERVER_ERROR = { status: '500', body: 'Server error' };

const setReactionBody = (reaction) => {
  return {
    id: reaction._id,
    reactionType: reaction.reactionType,
    userId: reaction.userId,
    postId: reaction.postId,
    createdAt: reaction.createdAt,
    updatedAt: reaction.updatedAt,
  };
};

class ReactionsService {
  async createReaction(body) {
    const duplicateReaction = await Reaction.findOneAndRemove({
      reactionType: body.reactionType,
      userId: body.userId,
      postId: body.postId,
    });

    if (duplicateReaction) {
      return this.getAllPostReactions(body.postId);
    }

    const difReaction = await Reaction.findOne({
      userId: body.userId,
      postId: body.postId,
    });

    if (
      difReaction &&
      difReaction.reactionType === 'like' &&
      body.reactionType === 'dislike'
    ) {
      await Reaction.findOneAndRemove({
        reactionType: 'like',
        userId: body.userId,
        postId: body.postId,
      });
    }
    if (
      difReaction &&
      difReaction.reactionType === 'dislike' &&
      body.reactionType === 'like'
    ) {
      await Reaction.findOneAndRemove({
        reactionType: 'dislike',
        userId: body.userId,
        postId: body.postId,
      });
    }

    const newReaction = new Reaction(body);

    try {
      await newReaction.save();
      return this.getAllPostReactions(body.postId);
    } catch (err) {
      return SERVER_ERROR;
    }
  }

  async getAllPostReactions(id) {
    try {
      const reactions = await Reaction.find({
        postId: id,
      });

      const result = [];
      reactions.map((reaction) => {
        result.push(setReactionBody(reaction));
      });

      return { status: '200', body: result };
    } catch (err) {
      return SERVER_ERROR;
    }
  }

  async getAllUserReactions(id) {
    try {
      const reactions = await Reaction.find({
        userId: id,
      });

      const result = [];
      reactions.map((reaction) => {
        result.push(setReactionBody(reaction));
      });

      return { status: '200', body: result };
    } catch (err) {
      return SERVER_ERROR;
    }
  }
}
const reactionsService = new ReactionsService();

module.exports = reactionsService;
