const express = require('express');
const connectDB = require('./connection/database');
const User = require('./model/user');
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
    res.status(400).send('Something went Wrong');
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

app.patch('/user', async (req, res) => {
  try {
    const id = req.body.id;
    const user = await User.findByIdAndUpdate(
      { _id: req.body.id },
      { firstName: 'Put Request' },
      {
        returnDocument: 'after',
      },
      {
        runValidators: true,
      }
    );
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
  const user = new User(req.body);
  try {
    await user.save();
    res.send('data saved successfully');
  } catch (err) {
    res.status(400).send('error in saving data');
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
