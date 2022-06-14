const { default: mongoose } = require('mongoose');
const { Schema, model } = require('mongoose');

const Conversation = new Schema(
  {
    participants: { type: Array },
  },
  {
    timestamps: true,
  },
);

module.exports = model('Conversation', Conversation);
