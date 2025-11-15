const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 3,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        min: 18,
    },
    gender: {
        type: String,
        validate: {
            validator: (gender) => gender === 'male' || gender === 'female',
            message: 'Gender must be either male or female.'
        }
    },
    profilePicture: {
        type: String,
        default: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
    },
    about: {
        type: String,
        default: 'This user has not updated their profile yet.'
    },
    skills: {
        type: [String],
    },
},
    {
        timestamps: true
    }
);

const User = mongoose.model('User', userSchema);

module.exports = User;