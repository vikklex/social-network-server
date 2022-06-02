const { mongoose } = require('mongoose');
const { Schema, model, ObjectId } = require('mongoose');

const User = new Schema(
  {
    first_name: { type: String, required: true, min: 3, max: 20 },
    last_name: { type: String, required: true, min: 3, max: 20 },

    email: { type: String, required: true, unique: true },
    password_hash: { type: String, require: true },

    job: { type: String, default: '' },
    birthday: { type: Date },
    avatar: { type: String, default: '' },
    album: { type: [String] },
    followings: { type: Array, default: [] },
    followers: { type: Array, default: [] },
    desc: { type: String, max: 150 },
    city: { type: String, max: 50 },
    from: { type: String, max: 50 },
    status: { type: String, default: '', max: 50 },
    relationships: {
      type: String,
      enum: ['Single', 'Married', 'Fall in love'],
    },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },

    posts_visibility: { type: Boolean, default: true },
    friends_visibility: { type: Boolean, default: true },
    album_visibility: { type: Boolean, default: true },

    is_admin: { type: Boolean, default: false },
    is_blocked: { type: Boolean, default: false },
  },

  { timestamps: true },
);

module.exports = model('User', User);
