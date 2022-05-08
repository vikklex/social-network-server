const { default: mongoose } = require('mongoose');
const { Schema, model } = require('mongoose');

const Meeting = new Schema(
  {
    userId: {
      ref: 'User',
      type: mongoose.Types.ObjectId,
    },
    participants: { type: Array, default: [] },
    title: { type: String },
    description: { type: String },
    date: { type: Date },
    startTime: { type: Date },
    endTime: { type: Date },
  },

  { timestamps: true },
);
module.exports = model('Meeting', Meeting);
