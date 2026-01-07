const aiService = require('../services/aiService');

/**
 * @desc    Generate subtasks breakdown (without saving to DB)
 * @route   POST /api/ai/breakdown
 */
const getTaskBreakdown = async (req, res) => {
    try {
        const { title } = req.body;

        if (!title) {
            return res.status(400).json({ message: 'Please provide a task title' });
        }

        const steps = await aiService.generateBreakdown(title);
        res.status(200).json({ steps });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getTaskBreakdown
};