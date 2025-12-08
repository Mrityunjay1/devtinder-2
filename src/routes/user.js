const express = require('express');
const userAuth = require('../middlewares/auth');
const connectionRequest = require('../models/connectionRequest');
const User = require('../models/user');
const userRouter = express.Router();


userRouter.get('/requests/received',userAuth, async(req, res) => {
    try {
        const user = req.user;
        const connectionRequests = await connectionRequest.find({ toUserId: user._id,status:'interested'  }).populate('fromUserId', 'firstName age gender profilePicture skills about');
        res.json(connectionRequests);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
userRouter.get('/connections',userAuth, async(req, res) => {
    try {
        const user = req.user;
        const connections = await connectionRequest.find({ 
            $or: [
                { fromUserId: user._id, status: 'accepted' },
                { toUserId: user._id, status: 'accepted' }
            ]
        }).populate('fromUserId toUserId', 'firstName age gender profilePicture skills about');
        const data = connections.map(conn => {
            if (conn.fromUserId._id.toString() === user._id.toString()) {
                return conn.toUserId;
            } else {
                return conn.fromUserId;
            }
        });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

userRouter.get('/feed',userAuth, async(req, res) => {
    try {
        const user = req.user;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;


        // find all connection requests (sent and received) 
        const connectionRequests = await connectionRequest.find({ 
            $or: [
                { fromUserId: user._id },
                { toUserId: user._id }
            ]
        }).select('fromUserId toUserId');

        const hideUserIds = new Set();
        connectionRequests.forEach(req => {
            hideUserIds.add(req.fromUserId.toString());
            hideUserIds.add(req.toUserId.toString());
        });
       const users = await User.find({ 
        $and: [
            { _id: { $ne: user._id } },
            { _id: { $nin: Array.from(hideUserIds) } }
        ]
       }).select('firstName age gender profilePicture skills about').skip((page - 1) * limit).limit(limit);

        res.json(users);


    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
})

module.exports = userRouter;