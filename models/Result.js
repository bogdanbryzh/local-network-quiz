const { Schema, model } = require('mongoose');

const ResultSchema = Schema({
  username: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  timedate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model('Result', ResultSchema);
