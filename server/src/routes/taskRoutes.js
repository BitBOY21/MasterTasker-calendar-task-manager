const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const { taskSchema } = require('../utils/validationSchemas');

const {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
    generateAiSuggestions,
    reorderTasks
} = require('../controllers/taskController');

// Special route for reordering
router.put('/reorder', protect, reorderTasks);

router.route('/')
    .get(protect, getTasks)
    .post(protect, validate(taskSchema), createTask); // Added Validation

router.route('/:id')
    .put(protect, validate(taskSchema), updateTask) // Added Validation
    .delete(protect, deleteTask);

router.post('/:id/ai-assist', protect, generateAiSuggestions);

module.exports = router;