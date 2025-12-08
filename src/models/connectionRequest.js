const mongoose = require('mongoose');
const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum:{ 
            values: [ 'ignore', 'interested', 'rejected','accepted'], 
            message: '{VALUE} is not supported'
        },
        default: 'pending'
    }
}, 
{ timestamps: true }
);

connectionRequestSchema.pre('save', async function (next) {
    const connectionRequest = this;
   
    if (connectionRequest.fromUserId.toString() === connectionRequest.toUserId.toString()) {
        throw new Error('fromUserId and toUserId cannot be the same');
    }
    next();
});

module.exports = mongoose.model('ConnectionRequest', connectionRequestSchema);