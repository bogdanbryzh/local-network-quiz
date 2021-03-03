const router = require('express').Router();

const Result = require('./../models/Result');

router.get('/', async (req, res) => {
  try {
    const results = await Result.find().sort({ score: -1, timedate: 1 });
    res.status(200).json(results);
  } catch (err) {
    res.status(error.status || 500).json({ message: err.message });
  }
});

router.post('/submit', async (req, res) => {
  const result = new Result({
    ...req.body,
  });
  try {
    const savedResult = await result.save();
    res.status(200).json(savedResult);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
});

module.exports = router;
