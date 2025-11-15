const express = require('express');
const connectDB = require('./config/db');
const User = require('./models/user');

const app = express();
app.use(express.json());





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
    user.save().then(() => {
        res.send('User signed up successfully');
    }).catch((err) => {
        res.status(400).send('Error signing up user', err.message);
    })
})

app.get("/users", async (req, res) => {
    try {
        const users = await User.find();
        res.send(users);
    } catch (err) {
        res.status(400).send('Error fetching users', err);
    }
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
        const user = await User.findByIdAndUpdate({ _id: req.body.userId }, req.body);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.send('User updated successfully');
    } catch (err) {
        res.status(400).send('Error updating user', err);
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


