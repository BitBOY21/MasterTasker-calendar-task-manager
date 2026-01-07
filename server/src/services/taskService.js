const Task = require('../models/Task');
const aiService = require('./aiService');
const { calculateUrgency } = require('../utils/taskUtils');

// --- Service Functions ---

const getAllTasks = async (userId) => {
    return await Task.find({ user: userId })
        .sort({ order: 1, urgencyScore: -1, createdAt: -1 });
};

const createTask = async (userId, taskData) => {
    const { title, description, dueDate, endDate, location, tags, priority, subtasks } = taskData;
    
    const score = calculateUrgency(dueDate, priority);
    const lastTask = await Task.findOne({ user: userId }).sort({ order: -1 });
    const newOrder = lastTask && lastTask.order !== undefined ? lastTask.order + 1 : 1;

    return await Task.create({
        user: userId,
        title,
        description,
        dueDate,
        endDate,
        location,
        tags: tags || [],
        priority: priority || 'Medium',
        urgencyScore: score,
        order: newOrder,
        subtasks: subtasks || []
    });
};

const updateTask = async (userId, taskId, updateData) => {
    const task = await Task.findById(taskId);
    if (!task) throw new Error('Task not found');
    if (task.user.toString() !== userId) throw new Error('User not authorized');

    // Update fields
    if (updateData.title) task.title = updateData.title;
    if (updateData.description !== undefined) task.description = updateData.description;
    if (updateData.isCompleted !== undefined) task.isCompleted = updateData.isCompleted;
    if (updateData.priority) task.priority = updateData.priority;
    if (updateData.dueDate !== undefined) task.dueDate = updateData.dueDate;
    
    // Update additional fields
    if (updateData.endDate !== undefined) task.endDate = updateData.endDate;
    if (updateData.location !== undefined) task.location = updateData.location;
    if (updateData.tags !== undefined) task.tags = updateData.tags;
    if (updateData.subtasks) task.subtasks = updateData.subtasks; 
    if (updateData.aiSuggestions) task.aiSuggestions = updateData.aiSuggestions;

    // Recalculate urgency score
    task.urgencyScore = calculateUrgency(task.dueDate, task.priority);

    return await task.save();
};

const deleteTask = async (userId, taskId) => {
    const task = await Task.findById(taskId);
    if (!task) throw new Error('Task not found');
    if (task.user.toString() !== userId) throw new Error('User not authorized');

    await task.deleteOne();
    return { id: taskId, message: 'Task deleted successfully' };
};

const generateAiSuggestions = async (userId, taskId) => {
    const task = await Task.findById(taskId);
    if (!task) throw new Error('Task not found');
    if (task.user.toString() !== userId) throw new Error('User not authorized');

    // Use the centralized AI service
    const suggestions = await aiService.generateBreakdown(task.title);

    task.aiSuggestions = suggestions;
    return await task.save();
};

const reorderTasks = async (userId, tasksOrder) => {
    const bulkOps = tasksOrder.map((item, index) => ({
        updateOne: {
            filter: { _id: item.id, user: userId },
            update: { order: index }
        }
    }));
    if (bulkOps.length > 0) {
        await Task.bulkWrite(bulkOps);
    }
    return { message: 'Tasks reordered successfully' };
};

module.exports = {
    getAllTasks,
    createTask,
    updateTask,
    deleteTask,
    generateAiSuggestions,
    reorderTasks
};