const express = require('express');
const connectDB = require('./connection/database');
const User = require('./model/user');
const app = express();

app.post('/signup', async (req, res) => {
  const userDetails = {
    firstName: 'Sachin',
    lastName: 'Tendulkar',
    emailId: 'Sachin@gmail.com',
    age: 57,
    password: 'Sachin',
    gender: 'Male',
  };
  const user = new User(userDetails);
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
