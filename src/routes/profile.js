const express = require('express');
const { userValidation } = require('../middlewares/auth');
const { validateEditProfileData } = require('../utils/validation');
const router = express.Router();

router.get('/profile/view', userValidation, async (req, res) => {
  try {
    res.send(req.user);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.patch('/profile/edit', userValidation, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error('Invalid Edit request');
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    res.json({ message: 'Data Saved', data: loggedInUser });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
