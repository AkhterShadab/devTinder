const express = require('express');
const { userValidation } = require('../middlewares/auth');
const router = express.Router();
const ConnectionRequest = require('../model/connectionRequest');

const USER_SAFE_DATA = 'firstName lastName age about gender';

router.get('/user/requests/received', userValidation, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: 'interested',
    }).populate('fromUserId', USER_SAFE_DATA);
    res.json(connectionRequests);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get('/user/connections', userValidation, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connections = await ConnectionRequest.find({
      $or: [
        {
          fromUserId: loggedInUser._id,
          status: 'accepted',
        },
        {
          toUserId: loggedInUser._id,
          status: 'accepted',
        },
      ],
    })
      .populate('fromUserId', USER_SAFE_DATA)
      .populate('toUserId', USER_SAFE_DATA);

    const data = connections.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.status(200).json(data);
  } catch (error) {}
});

module.exports = router;
