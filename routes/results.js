const merge = require('lodash/merge');

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

router.post('/', async (req, res) => {
  const result = new Result({
    ...req.body,
  });
  try {
    const savedResult = await result.save();
    res.status(200).json(savedResult);
  } catch (err) {
    console.log(err);
    res.status(err.status || 500).json({ message: err.message });
  }
});

router.put('/:resultID', async (req, res) => {
  console.log(req.params);
  const { resultID } = req.params;
  try {
    const existedResult = await Result.findOne({
      _id: resultID,
    });
    console.log(resultID);
    console.log(existedResult);
    const mergedResult = merge(existedResult, req.body);
    console.log(mergedResult);
    const updatedResult = await Result.updateOne(
      { _id: resultID },
      {
        $set: mergedResult,
      }
    );
    res.status(202).json(updatedResult);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
});

module.exports = router;
