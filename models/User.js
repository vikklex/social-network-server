const { mongoose } = require('mongoose');
const { Schema, model, ObjectId } = require('mongoose');

const User = new Schema(
  {
    first_name: { type: String, required: true, min: 3, max: 20 },
    last_name: { type: String, required: true, min: 3, max: 20 },
    job: { type: String, default: '' },
    birthday: { type: Date },
    email: { type: String, required: true, unique: true },
    password_hash: { type: String, require: true },
    avatar: { type: String, default: '' },
    followers: { type: Array, default: [] },
    followings: { type: Array, default: [] },
    is_admin: { type: Boolean, default: false },
    desc: { type: String, max: 150 },
    city: { type: String, max: 50 },
    from: { type: String, max: 50 },
    relationships: {
      type: String,
      enum: ['single', 'married', 'fall in love'],
    },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    friends: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true },
);

module.exports = model('User', User);
