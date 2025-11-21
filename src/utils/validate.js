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

const validateProfileEdit = (req) => {
    const allowEdits = ['firstName', 'lastName', 'age', 'gender', 'about', 'skills', 'profilePicture'];
    const edits = Object.keys(req.body);
    const isValidEdit = edits.every((edit) => allowEdits.includes(edit));
    if (!isValidEdit) {
        throw new Error('Invalid edits!');
    }
    
}

module.exports = {
    validateSIgnUp,
    validateProfileEdit
};
