const express = require('express');
const { userValidation } = require('../middlewares/auth');
const router = express.Router();

router.get('/profile', userValidation, async (req, res) => {
  try {
    res.send(req.user);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
