const { default: mongoose } = require('mongoose');
const { Schema, model } = require('mongoose');

const Message = new Schema(
  {
    conversationId: { type: String },
    sender: { type: String },
    text: { type: String },
  },

  {
    timestamps: true,
  },
);

module.exports = model('Message', Message);
