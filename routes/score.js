const path = require('path');
const router = require('express').Router();

router.get('/', (req, res) => {
  res.status(200).sendFile(path.resolve(__dirname, '../public/score.html'));
});

module.exports = router;
