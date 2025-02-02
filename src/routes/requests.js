const express = require('express');
const { userValidation } = require('../middlewares/auth');
const ConnectionRequest = require('../model/connectionRequest');
const router = express.Router();
const User = require('../model/user');

router.post(
  '/request/send/:status/:toUserId',
  userValidation,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      if (!['interested', 'ignored'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status type' });
      }
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const isUserFound = await User.findById(toUserId);
      if (!isUserFound) {
        return res.status(404).json({ message: 'User not found' });
      }

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionRequest) {
        return res
          .status(400)
          .json({ message: 'Connection request already exist' });
      }

      const data = await connectionRequest.save();
      res.json({ message: status + ' Connection Request send', data });
    } catch (error) {
      res.status(400).send(error.message);
    }
  }
);

router.post(
  '/request/review/:status/:requestId',
  userValidation,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;
      const allowedStatus = ['accepted', 'rejected'];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: 'Invalid Status' });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        fromUserId: requestId,
        toUserId: loggedInUser._id,
        status: 'interested',
      });
      console.log('requestId', requestId);
      console.log('loggedInUser._id', loggedInUser._id);
      console.log('status', status);
      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: 'Connection Request not found ' });
      }

      connectionRequest.status = status;

      const data = await connectionRequest.save();

      res.status(200).json({ message: 'Connection Request ' + status, data });
    } catch (error) {
      res.status(400).send(error.message);
    }
  }
);

module.exports = router;
