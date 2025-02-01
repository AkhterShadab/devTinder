const express = require('express');
const User = require('../model/user.js');
const validateUser = require('../utils/validation.js');
const bcrypt = require('bcrypt');

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    validateUser(req);
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    console.log('p', passwordHash);
    const user = new User({
      firstName: firstName,
      lastName: lastName,
      emailId: emailId,
      password: passwordHash,
    });
    await user.save();
    res.send('data saved successfully');
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.post('/login', async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error('Invalid Username or Password');
    }
    const validUser = await user.validatePassword(password);
    if (validUser) {
      const jwtToken = await user.getJWT();
      console.log(jwtToken);
      res.cookie('token', jwtToken, { expires: new Date(Date.now() + 360000) });
      res.send('Login Successful');
    } else {
      throw new Error('Invalid Username or Password');
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;
