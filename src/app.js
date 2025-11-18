const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { validateSIgnUp } = require('./utils/validate');
const connectDB = require('./config/db');
const User = require('./models/user');
const userAuth = require('./middlewares/auth');

const app = express();
app.use(express.json());

app.use(cookieParser());





connectDB().then(() => {
    console.log('MongoDB connected');
    app.listen(7777, () => {
        console.log('Server is running on port 7777');
    });
}).catch((err) => {
    console.error('MongoDB connection failed:', err);
    process.exit(1);
});



app.post("/signup", async (req, res) => {
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
    user.save().then(() => {
        res.send('User signed up successfully');
    }).catch((err) => {
        res.status(400).send(err.message);
    })
})

app.post("/login", async (req, res) => {
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
        res.cookie('token', token, { httpOnly: true ,});
        res.send('User logged in successfully');
    } catch (err) {
        res.status(400).send(err.message);
    }
})

app.get("/profile", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    } catch (err) {
        res.status(400).send('Error fetching profile', err);
    }
})

app.get("/users", async (req, res) => {
    try {
        const users = await User.find();
        res.send(users);
    } catch (err) {
        res.status(400).send('Error fetching users', err);
    }
})


app.post("/send-connection-request", userAuth, async (req, res) => {

})

app.get("/user", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.send(user);
    } catch (err) {
        res.status(400).send('Error fetching user', err);
    }
})


app.patch("/user", async (req, res) => {



    try {
        const ALLOWED_UPDATE_FIELDS = ['profilePicture', 'about', 'age', 'gender', 'skills'];
        const updateFields = Object.keys(req.body);
        const isValidUpdate = updateFields.every(field => ALLOWED_UPDATE_FIELDS.includes(field));

        if (!isValidUpdate) {
            throw new Error('Invalid update fields');
        }
        const user = await User.findByIdAndUpdate({ _id: req.body.userId }, req.body);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.send('User updated successfully');
    } catch (err) {
        res.status(400).send('Error updating user', err.message);
    }
})

app.delete("/user", async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.body.userId);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.send('User deleted successfully');
    } catch (err) {
        res.status(400).send('Error deleting user', err);
    }
})


