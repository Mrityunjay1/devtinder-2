const express = require('express');
const cookieParser = require('cookie-parser');

const connectDB = require('./config/db');
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');


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

app.use('/auth', authRouter);
app.use('/profile', profileRouter);
app.use('/request', requestRouter);











