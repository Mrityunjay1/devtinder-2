const express = require('express');
const userAuth = require('../middlewares/auth');
const profileRouter = express.Router();

profileRouter.get("/", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    } catch (err) {
        res.status(400).send('Error fetching profile', err);
    }
})

module.exports = profileRouter;