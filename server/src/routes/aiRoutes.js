const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getTaskBreakdown } = require('../controllers/aiController');

// All AI routes are protected
router.post('/breakdown', protect, getTaskBreakdown);

module.exports = router;