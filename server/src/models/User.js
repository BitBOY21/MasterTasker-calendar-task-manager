const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true, // No two users can have the same email
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Please add a password']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);