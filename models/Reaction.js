const { default: mongoose } = require('mongoose');
const { Schema, model } = require('mongoose');

const Reaction = new Schema(
  {
    reactionType: {
      type: String,
      enum: ['like', 'dislike'],
    },
    userId: {
      ref: 'User',
      type: mongoose.Types.ObjectId,
    },
    likedUser: {
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
module.exports = model('Reaction', Reaction);
