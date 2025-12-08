const express = require('express');
const { validateSIgnUp } = require('../utils/validate');
const User = require('../models/user');
const bcrypt = require('bcrypt');

const authRouter = express.Router();
const isProd = process.env.NODE_ENV === 'production';

authRouter.post("/signup", async (req, res) => {
    try {
        validateSIgnUp(req);
    } catch (err) {
        return res.status(400).send(err.message);
    }

    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);


    const userObj = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPassword,
        age: req.body.age,
        gender: req.body.gender ? req.body.gender.toLowerCase() : undefined
    }
    const user = new User(userObj);
    const savedUser = await user.save();
    const token = await savedUser.getJWT();
    res.cookie('token', token, { httpOnly: true , secure: isProd, sameSite: isProd ? 'none' : 'lax' });
    res.status(201).send(savedUser);
})
authRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send('User not found');
        }
        const isPasswordValid = await user.verifyPassword(password);
        if (!isPasswordValid) {
            return res.status(401).send('Invalid password');
        }
        const token = await user.getJWT();
        res.cookie('token', token, { httpOnly: true , secure: isProd, sameSite: isProd ? 'none' : 'lax' });
        res.send(user);
    } catch (err) {
        res.status(400).send(err.message);
    }
})

authRouter.post("/logout", (req, res) => {
    res.clearCookie('token');
    res.send('User logged out successfully');
})

module.exports = authRouter;