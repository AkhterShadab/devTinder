const express = require('express');
const { userValidation } = require('../middlewares/auth');
const router = express.Router();

router.post('/sendConnectionRequest', userValidation, (req, res) => {
  res.send('ConnectionRequest');
});

module.exports = router;
