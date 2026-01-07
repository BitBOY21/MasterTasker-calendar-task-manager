const authService = require('../services/authService');
const asyncHandler = require('../middleware/asyncHandler');

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 */
const registerUser = asyncHandler(async (req, res) => {
    // Validation handled by middleware
    const { name, email, password } = req.body;
    const user = await authService.register({ name, email, password });
    res.status(201).json(user);
});

/**
 * @desc    Authenticate a user (Login)
 * @route   POST /api/auth/login
 */
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await authService.login(email, password);
    res.json(user);
});

module.exports = {
    registerUser,
    loginUser
};