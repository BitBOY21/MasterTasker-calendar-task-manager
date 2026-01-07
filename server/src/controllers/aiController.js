const aiService = require('../services/aiService');

/**
 * @desc    Generate subtasks breakdown (without saving to DB)
 * @route   POST /api/ai/breakdown
 */
const getTaskBreakdown = async (req, res) => {
    try {
        // שלוף את כל הפרטים הרלוונטיים, לא רק כותרת
        const { title, description, priority, tags } = req.body;

        if (!title) {
            return res.status(400).json({ message: 'Please provide a task title' });
        }

        // שלח את כל המידע ל-Service כדי לקבל תשובה מדויקת יותר
        const steps = await aiService.generateBreakdown({ title, description, priority, tags });

        res.status(200).json({ steps });

    } catch (error) {
        console.error("Controller Error:", error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getTaskBreakdown
};