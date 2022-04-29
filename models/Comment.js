const { default: mongoose } = require('mongoose');
const { Schema, model } = require('mongoose');

const Comment = new Schema(
  {
    desc: {
      type: String,
    },
    tag: { type: Object },
    reply: mongoose.Types.ObjectId,
    likes: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
    user: { type: mongoose.Types.ObjectId, ref: 'user' },
    postId: { type: mongoose.Types.ObjectId, ref: 'Post' },
  },
  { timestamps: true },
);
module.exports = model('Comment', Comment);
