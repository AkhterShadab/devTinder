const jwt = require('jsonwebtoken');
const User = require('../model/user');

const userValidation = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error('Invalid Token');
    }
    const decodeMessage = await jwt.verify(token, 'dev@tinder');
    const { _id } = decodeMessage;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error('User not found');
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(500).send(error.message);
  }
};
module.exports = { userValidation };
