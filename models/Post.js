const { default: mongoose } = require('mongoose');
const { Schema, model, ObjectId } = require('mongoose');

const Post = new Schema(
  {
    userId: { type: String, required: true },
    desc: { type: String, max: 500 },
    img: { type: [String] },
  },
  { timestamps: true },
);
module.exports = model('Post', Post);
