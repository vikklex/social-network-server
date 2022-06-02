const { mongoose } = require('mongoose');
const { Schema, model } = require('mongoose');

const Comment = new Schema(
  {
    desc: {
      type: String,
    },

    userId: {
      ref: 'User',
      type: mongoose.Types.ObjectId,
    },

    userData: {
      type: Object,
    },

    postAuthor: {
      ref: 'User',
      type: mongoose.Types.ObjectId,
    },

    postId: {
      ref: 'Post',
      type: mongoose.Types.ObjectId,
    },
  },
  { timestamps: true },
);

module.exports = model('Comment', Comment);
