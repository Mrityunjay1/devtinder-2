const express = require('express');
const userAuth = require('../middlewares/auth');
const { validateProfileEdit } = require('../utils/validate');
const profileRouter = express.Router();

profileRouter.get("/", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    } catch (err) {
        res.status(400).send('Error fetching profile', err);
    }
})

profileRouter.patch("/edit", userAuth, async (req, res) => {
    
    try {
        // validateProfileEdit throws an Error when edits are invalid
        validateProfileEdit(req);

        const user = req.user;

        
        const updates = Object.keys(req.body);
        updates.forEach((field) => {
            user[field] = req.body[field];
        });

        await user.save();
        res.json({ message: 'User updated successfully', user });
    } catch (err) {
        res.status(400).json({ error: 'Error updating profile', message: err.message });
    }
})


//todo
profileRouter.patch("/edit/password", userAuth, async (req, res) => {

});

module.exports = profileRouter;