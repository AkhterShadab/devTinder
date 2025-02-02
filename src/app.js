const express = require('express');
const connectDB = require('./connection/database');
const app = express();
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(cookieParser());

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/requests');
const userRouter = require('./routes/user');

// app.get('/user', async (req, res) => {
//   const email = req.body.emailId;

//   try {
//     const users = await User.find({ emailId: email });
//     if (users.length > 0) {
//       res.send(users);
//     } else {
//       res.status(404).send('user not found');
//     }
//   } catch (error) {
//     res.status(400).send(error.message);
//   }
// });

// app.get('/feed', async (req, res) => {
//   try {
//     const users = await User.find({});
//     res.send(users);
//   } catch (error) {
//     res.status(400).send('Something went Wrong');
//   }
// });

// app.patch('/user/:userId', async (req, res) => {
//   const id = req.params?.userId;
//   const data = req.body;
//   console.log(id, data);

//   try {
//     const ALLOWED_UPDATES = ['photoUrl', 'about', 'skills', 'gender', 'age'];
//     const isAllowedUpdate = Object.keys(data).every((k) =>
//       ALLOWED_UPDATES.includes(k)
//     );
//     if (!isAllowedUpdate) {
//       throw new Error('Updates not allowed');
//     }
//     if (data?.skills?.length > 10) {
//       throw new Error('Skills can not be more than 10');
//     }
//     const user = await User.findByIdAndUpdate(id, data, {
//       returnDocument: 'after',
//       runValidators: true,
//     });
//     console.log(user);
//     if (user) {
//       res.send(user);
//     } else {
//       throw new Error('User not found with Id');
//     }
//   } catch (error) {
//     res.status(400).send(error.message);
//   }
// });

// app.delete('/user', async (req, res) => {
//   try {
//     const id = req.body.id;
//     const user = await User.findByIdAndDelete({ _id: req.body.id });
//     console.log(user);
//     if (user) {
//       res.send(user);
//     } else {
//       throw new Error('User not found with Id');
//     }
//   } catch (error) {
//     res.status(400).send('User not found with Id');
//   }
// });

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);

connectDB()
  .then(() => {
    console.log('connected');
    app.listen(3000, () => {
      console.log('server started');
    });
  })
  .catch((err) => console.log('err', err));
