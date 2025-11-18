const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userAuth = async (req, res, next) => {
    try {
    const {token} = req.cookies;
    if (!token) {
        return res.status(401).json({message: 'Unauthorized: No token provided'});
    }
    const decoded = await jwt.verify(token, 'secretKey');
    const userId = decoded._id;
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({message: 'User not found'});
    }
    req.user = user;
    next();
} catch (err) {
    res.status(401).json({ "ERROR": err.message });
}
}

module.exports = userAuth;