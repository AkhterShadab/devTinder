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

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    'firstName',
    'lastName',
    'age',
    'gender',
    'photoUrl',
    'about',
    'skills',
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );

  return isEditAllowed;
};

module.exports = { validateUser, validateEditProfileData };
