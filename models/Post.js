const { Schema, model, ObjectId } = require('mongoose');

const Post = new Schema(
  {
    userId: { type: String, required: true },
    desc: { type: String, max: 500 },
    img: { type: String },
    likes: { type: Array, default: [] },
    dislikes: { type: Array, default: [] },
  },
  { timestamps: true },
);
module.exports = model('Post', Post);
