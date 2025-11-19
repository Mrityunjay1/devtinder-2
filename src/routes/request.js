const express = require('express');
const userAuth = require('../middlewares/auth');
const requestRouter = express.Router();


requestRouter.post("/send-connection-request", userAuth, async (req, res) => {

})

module.exports = requestRouter;