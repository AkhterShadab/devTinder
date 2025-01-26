const validator = require('validator');

const validateUser = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error('Enter Name');
  } else if (!validator.isEmail(emailId)) {
    throw new Error('Invalid Email');
  } else if (!validator.isStrongPassword(password)) {
    throw new Error('Password should be strong');
  }
};

module.exports = validateUser;
