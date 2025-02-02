const mongoose = require('mongoose');

const connectionRequest = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ['ignored', 'interested', 'accepted', 'rejected'],
        message: `{VALUE} is incorrect status type`,
      },
    },
  },
  {
    timestamps: true,
  }
);

connectionRequest.index({ fromUserId: 1, toUserId: 1 });

connectionRequest.pre('save', function (next) {
  const request = this;
  if (request.fromUserId.equals(request.toUserId)) {
    throw new Error('Can not send request to yourself');
  }
  next();
});

const connectionRequestModel = new mongoose.model(
  'connectionRequest',
  connectionRequest
);

module.exports = connectionRequestModel;
