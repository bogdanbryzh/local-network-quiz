const merge = require('lodash/merge');

const router = require('express').Router();

const Question = require('../models/Question');

router.get('/', async (req, res) => {
  try {
    const questions = await Question.find();
    res.status(200).json(questions);
  } catch (err) {
    res.status(error.status || 500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  console.log(req.body);
  const question = new Question({
    ...req.body,
  });
  try {
    const savedQuestion = await question.save();
    res.status(200).json(savedQuestion);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
});

router.patch('/:questionID', async (req, res) => {
  try {
    const existedQuestion = await Question.findOne({
      _id: req.params.questionID,
    });
    const mergedQuestion = merge(existedQuestion, req.body);
    const updatedQuestion = await Question.updateOne(
      { _id: req.params.questionID },
      {
        $set: mergedQuestion,
      }
    );
    res.status(202).json(updatedQuestion);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
});

router.delete('/:questionID', async (req, res) => {
  try {
    const removedQuestion = await Question.remove({
      _id: req.params.questionID,
    });
    res.status(202).json(removedQuestion);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
});

module.exports = router;
