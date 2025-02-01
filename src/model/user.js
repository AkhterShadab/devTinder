const mongoose = require('mongoose');
const { Schema } = mongoose;
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 20,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid Email');
        }
      },
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!['male', 'female', 'others'].includes(value)) {
          throw new Error('Invalid Gender');
        }
      },
    },
    photoUrl: {
      type: String,
      default: 'https://google.com',
    },
    about: {
      type: String,
      default: 'This is about description',
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, 'dev@tinder', {
    expiresIn: '1d',
  });
  console.log(token);
  return token;
};

userSchema.methods.validatePassword = async function (passwordByUser) {
  const user = this;
  const isValid = await bcrypt.compare(passwordByUser, user.password);
  return isValid;
};
const User = mongoose.model('User', userSchema);

module.exports = User;
