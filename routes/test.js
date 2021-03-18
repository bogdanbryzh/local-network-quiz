const path = require('path');
const router = require('express').Router();

router.get('/', (req, res) => {
  res.status(200).sendFile(path.resolve(__dirname, '../public/test.html'));
});

router.post('/', (req, res) => {
  if (req.query.final) {
    console.log(req.body);
    console.log('tpr: ', req.body.rps);
  }
  res.status(200).json({ message: '[ OK ]' });
});

module.exports = router;
