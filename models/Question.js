const { Schema, model } = require('mongoose');

const QuestionSchema = Schema({
  question: {
    type: String,
    required: true,
  },
  answers: [
    {
      text: {
        type: String,
        required: true,
      },
      isAnswer: {
        type: Boolean,
      },
    },
  ],
});

module.exports = model('Question', QuestionSchema);
