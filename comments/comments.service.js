const Comment = require('../models/Comment');
const Post = require('../models/Post');
const User = require('../models/User');

const NOT_FOUNDED = { status: '404', body: 'Post not founded' };
const SERVER_ERROR = { status: '500', body: 'Server error' };

class CommentsService {
  async createComment(body) {
    const newComment = new Comment({
      user: body.user._id, //?
      desc: body.desc,
      tag: body.tag,
      reply: body.reply,
    });

    const post = await Post.findById(body.postId);

    await post.updateOne({ $push: { comments: newComment._id } });

    try {
      const savedComment = await newComment.save();
      return { status: '200', body: savedComment };
    } catch (err) {
      return SERVER_ERROR;
    }
  }

  async getComments(id) {
    try {
      const post = await Post.findById(id);
      const comments = await Comment.find({ postId: post._id });
      return { status: '200', body: { comments } };
    } catch (err) {
      return SERVER_ERROR;
    }
  }

  async deleteComment(id, userId) {
    try {
      const post = await Post.findById(id);
      if (post.userId === userId) {
        await post.deleteOne();
        return { status: '200', body: 'Post has been deleted' };
      } else {
        return { status: '403', body: 'You can delete only your post!' };
      }
    } catch (err) {
      return SERVER_ERROR;
    }
  }

  async updatePost(id, body) {
    try {
      const post = await Post.findById(id);
      if (post.userId === body.userId) {
        await post.updateOne({ $set: body });
        return { status: '200', body: 'Post has been updated' };
      } else {
        return { status: '403', body: 'You can update only your post!' };
      }
    } catch (err) {
      return SERVER_ERROR;
    }
  }
}
const commentsService = new CommentsService();

module.exports = commentsService;
