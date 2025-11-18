const validator = require('validator');



const validateSIgnUp = (req) => {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
        throw new Error('All fields are required.');
    }
    else if (!validator.isEmail(email)) {
        throw new Error('Invalid email address.');
    }
    else if (!validator.isStrongPassword(password)) {
        throw new Error('Password must be strong.');
    }
}

module.exports = {
    validateSIgnUp
}