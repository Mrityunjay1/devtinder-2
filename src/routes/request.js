const express = require('express');
const userAuth = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const requestRouter = express.Router();
const User = require('../models/user');



requestRouter.post("/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatuses = ['ignore', 'interested'];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status value' });
        }

        // Check if a connection request already exists between these users
        const existingRequest = await ConnectionRequest.findOne({
            $or: [
                {fromUserId: fromUserId, toUserId: toUserId},
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });

        if (existingRequest) {
            return res.status(400).json({ error: 'Connection request already exists' });
        }

        

       
        const toUser = await User.findById(toUserId);
        if (!toUser) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });

        await connectionRequest.save();
        res.status(201).json({ message: req.user.firstName + ' ' + status + " connection request", connectionRequest });
    } catch (err) {
        res.status(400).json({ error: 'Error sending connection request', message: err.message });
    }
    
})

requestRouter.post("/respond/:status/:requestId", userAuth, async (req, res) => {
    try {
    const loggedInUserId = req.user;
    const { status, requestId } = req.params;



    const allowedStatuses = ['accepted', 'rejected'];
    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status value' });
    }

    const connectionRequest = await ConnectionRequest.findOne({ _id: requestId, toUserId: loggedInUserId._id, status: 'interested' });
    if (!connectionRequest) {
        return res.status(404).json({ error: 'Connection request not found' });
    }

    connectionRequest.status = status;
    await connectionRequest.save();

    res.json({ message: `Connection request ${status} successfully`, connectionRequest });

} catch (err) {
    res.status(400).json({ error: 'Error responding to connection request', message: err.message });
}
});

module.exports = requestRouter;