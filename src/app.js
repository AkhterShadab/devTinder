const express = require('express');
const connectDB = require('./connection/database');
const User = require('./model/user');
const validateUser = require('./utils/validation.js');
const bcrypt = require('bcrypt');
const app = express();

app.use(express.json());

app.get('/user', async (req, res) => {
  const email = req.body.emailId;

  try {
    const users = await User.find({ emailId: email });
    if (users.length > 0) {
      res.send(users);
    } else {
      res.status(404).send('user not found');
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.get('/feed', async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(400).send('Something went Wrong');
  }
});

app.patch('/user/:userId', async (req, res) => {
  const id = req.params?.userId;
  const data = req.body;
  console.log(id, data);

  try {
    const ALLOWED_UPDATES = ['photoUrl', 'about', 'skills', 'gender', 'age'];
    const isAllowedUpdate = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isAllowedUpdate) {
      throw new Error('Updates not allowed');
    }
    if (data?.skills?.length > 10) {
      throw new Error('Skills can not be more than 10');
    }
    const user = await User.findByIdAndUpdate(id, data, {
      returnDocument: 'after',
      runValidators: true,
    });
    console.log(user);
    if (user) {
      res.send(user);
    } else {
      throw new Error('User not found with Id');
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.delete('/user', async (req, res) => {
  try {
    const id = req.body.id;
    const user = await User.findByIdAndDelete({ _id: req.body.id });
    console.log(user);
    if (user) {
      res.send(user);
    } else {
      throw new Error('User not found with Id');
    }
  } catch (error) {
    res.status(400).send('User not found with Id');
  }
});

app.post('/signup', async (req, res) => {
  try {
    validateUser(req);
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
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

app.post('/login', async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error('Invalid Username or Password');
    }
    const validUser = await bcrypt.compare(password, user.password);
    if (validUser) {
      res.send('Valid User');
    } else {
      throw new Error('Invalid Username or Password');
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

connectDB()
  .then(() => {
    console.log('connected');
    app.listen(3000, () => {
      console.log('server started');
    });
  })
  .catch((err) => console.log('err', err));
