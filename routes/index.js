import express from 'express'
const router = express.Router();

router.get('/', function(req, res) {
  res.send({ title: 'Author Domain Basic API ' });
});

module.exports = router;
