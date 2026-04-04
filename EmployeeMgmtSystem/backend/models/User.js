const mongoose = require('mongoose');

// Define the structure of our User data for the database
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

// Create and export the User model so it can be used in other files
const User = mongoose.model('User', userSchema);
module.exports = User;
