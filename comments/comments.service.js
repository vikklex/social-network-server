const Comment = require('../models/Comment');
const User = require('../models/User');

const NOT_FOUNDED = { status: '404', body: 'Post not founded' };
const SERVER_ERROR = { status: '500', body: 'Server error' };

const setCommentBody = (comment) => {
  return {
    id: comment._id,
    desc: comment.desc,
    userId: comment.userId,
    userData: comment.userData,
    postAuthor: comment.postAuthor,
    postId: comment.postId,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
  };
};

const setUserBody = (user) => {
  return {
    id: user._id,
    first_name: user.first_name,
    last_name: user.last_name,
    avatar: user.avatar,
  };
};

class CommentsService {
  async createComment(body) {
    const newComment = new Comment(body);

    try {
      await newComment.save();
      return { status: '200', body: setCommentBody(newComment) };
    } catch (err) {
      return SERVER_ERROR;
    }
  }

  async getComments(id) {
    try {
      const comments = await Comment.find({
        postId: id,
      });

      for (const comment of comments) {
        const userData = await User.findById(comment.userId);
        comment.userData = setUserBody(userData);
      }

      const result = [];
      comments.map((comment) => {
        result.push(setCommentBody(comment));
      });

      return { status: '200', body: result };
    } catch (err) {
      return SERVER_ERROR;
    }
  }

  async updateComment(id, body) {
    try {
      const comment = await Comment.findById(id);

      if (comment.userId.toString() === body.userId) {
        await comment.updateOne({ $set: body });
        return { status: '200', body: 'Comment has been updated' };
      } else {
        return { status: '403', body: 'You can update only your comment!' };
      }
    } catch (err) {
      return SERVER_ERROR;
    }
  }

  async deleteComment(id) {
    try {
      const comment = await Comment.findById(id);

      await comment.deleteOne();
      return { status: '200', body: 'Comment has been deleted' };
    } catch (err) {
      return SERVER_ERROR;
    }
  }
}
const commentsService = new CommentsService();

module.exports = commentsService;
