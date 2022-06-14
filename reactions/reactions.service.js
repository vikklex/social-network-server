const Reaction = require('../models/Reaction');
const User = require('../models/User');

const SERVER_ERROR = { status: '500', body: 'Server error' };

const setReactionBody = (reaction) => {
  return {
    id: reaction._id,
    reactionType: reaction.reactionType,
    contentType: reaction.contentType,
    userId: reaction.userId,
    likedUser: reaction.likedUser,
    postId: reaction.postId,
    createdAt: reaction.createdAt,
    updatedAt: reaction.updatedAt,
  };
};

const getReactionData = (user, reaction) => {
  return {
    id: reaction.id,
    userId: reaction.userId,
    reactionType: reaction.reactionType,
    contentType: reaction.contentType,
    postId: reaction.postId,
    createdAt: reaction.createdAt,
    updatedAt: reaction.updatedAt,
    first_name: user.first_name,
    last_name: user.last_name,
    avatar: user.avatar,
    gender: user.gender,
  };
};

class ReactionsService {
  async createReaction(body) {
    const duplicateReaction = await Reaction.findOneAndRemove({
      reactionType: body.reactionType,
      userId: body.userId,
      likedUser: body.likedUser,
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

  async getAllReactionsForUser(id) {
    try {
      const reactions = await Reaction.find({
        contentType: { $exists: false },
        likedUser: id,
      });

      const result = [];
      const data = [];

      reactions.map((reaction) => {
        result.push(setReactionBody(reaction));
      });

      for (const res of result) {
        await Reaction.find({ id: res.id, likedUser: id }).then(
          await User.findById(res.userId).then(async (user) => {
            data.push(getReactionData(user, res));
          }),
        );
      }

      return { status: '200', body: data };
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

  async getReactionsFromDate(id, startDate, endDate) {
    try {
      const reactions = await Reaction.find({
        likedUser: id,
        createdAt: { $gte: startDate, $lte: endDate },
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
