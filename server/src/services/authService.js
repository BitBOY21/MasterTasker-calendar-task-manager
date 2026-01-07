const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// --- Helper Function: Create JWT ---
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// --- Service Functions ---

const register = async (userData) => {
    const { name, email, password } = userData;

    // 1. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        throw new Error('User already exists');
    }

    // 2. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create the user
    const user = await User.create({
        name,
        email,
        password: hashedPassword
    });

    if (user) {
        return {
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        };
    } else {
        throw new Error('Invalid user data');
    }
};

const login = async (email, password) => {
    // 1. Check if user exists
    const user = await User.findOne({ email });

    // 2. Compare password
    if (user && (await bcrypt.compare(password, user.password))) {
        return {
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        };
    } else {
        throw new Error('Invalid credentials');
    }
};

module.exports = {
    register,
    login
};