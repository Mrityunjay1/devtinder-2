const express = require('express');
const connectDB = require('./config/db');

const app = express();
app.use(express.json());



const User = require('./models/user');

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
    const userObj = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        age: req.body.age,
        gender: req.body.gender
    }
    const user = new User(userObj);
    try {
        await user.save();
        res.send('User signed up successfully');
    } catch (err) {
        res.status(400).send('Error signing up user');
    }
})


