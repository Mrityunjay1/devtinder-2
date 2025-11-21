const moongoose = require('mongoose');
const connectionRequestSchema = new moongoose.Schema({
    fromUserId: {
        type: moongoose.Schema.Types.ObjectId,
        required: true
    },
    toUserId: {
        type: moongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        enum:{ 
            values: ['ignore', 'interested', 'rejected','accepted'], 
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

module.exports = moongoose.model('ConnectionRequest', connectionRequestSchema);