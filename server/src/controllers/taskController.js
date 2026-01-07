const taskService = require('../services/taskService');
const asyncHandler = require('../middleware/asyncHandler');

// --- Controller Functions ---

const getTasks = asyncHandler(async (req, res) => {
    const tasks = await taskService.getAllTasks(req.user.id);
    res.status(200).json(tasks);
});

const createTask = asyncHandler(async (req, res) => {
    // Validation is now handled by middleware, so we can skip the check here
    const task = await taskService.createTask(req.user.id, req.body);
    res.status(201).json(task);
});

const updateTask = asyncHandler(async (req, res) => {
    const updatedTask = await taskService.updateTask(req.user.id, req.params.id, req.body);
    res.status(200).json(updatedTask);
});

const deleteTask = asyncHandler(async (req, res) => {
    const result = await taskService.deleteTask(req.user.id, req.params.id);
    res.status(200).json(result);
});

const generateAiSuggestions = asyncHandler(async (req, res) => {
    const task = await taskService.generateAiSuggestions(req.user.id, req.params.id);
    res.status(200).json(task);
});

const reorderTasks = asyncHandler(async (req, res) => {
    const result = await taskService.reorderTasks(req.user.id, req.body.tasks);
    res.status(200).json(result);
});

module.exports = {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
    generateAiSuggestions,
    reorderTasks
};