const express = require('express');
const router = express.Router();
const validate = require('../middleware/validateMiddleware');
const { registerSchema, loginSchema } = require('../utils/validationSchemas');
const { registerUser, loginUser } = require('../controllers/authController');

router.post('/register', validate(registerSchema), registerUser);
router.post('/login', validate(loginSchema), loginUser);

module.exports = router;