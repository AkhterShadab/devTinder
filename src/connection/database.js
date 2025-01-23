const mongoose = require('mongoose');

const connectDB = async () => {
  await mongoose.connect(
    'mongodb+srv://tempryderop:Mongo1@devcluster.0z9in.mongodb.net/devTinder'
  );
};

module.exports = connectDB;
