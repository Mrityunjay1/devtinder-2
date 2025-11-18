const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


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
        validate: {
            validator: validator.isEmail,
            message: 'Invalid email address.'
        }
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: (password) => validator.isStrongPassword(password),
            message: 'Password must be strong.'
        }
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

userSchema.methods.getJWT=function () {
   
    const token = jwt.sign({ _id: this._id }, 'secretKey', { expiresIn: '1d' });
    return token;
}

userSchema.methods.verifyPassword= async function (password) {
   
    return await bcrypt.compare(password, this.password);
}

const User = mongoose.model('User', userSchema);

module.exports = User;