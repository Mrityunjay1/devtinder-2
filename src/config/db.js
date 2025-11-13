const mongoose = require('mongoose');


const connectDB = async () => {

    await mongoose.connect('mongodb+srv://singhmrityunjay32:abhishek123@devtinder.7qr9s.mongodb.net/?appName=devtinder');


};

module.exports = connectDB;