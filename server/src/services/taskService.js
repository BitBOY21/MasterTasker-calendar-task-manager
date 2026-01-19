const Task = require('../models/Task');
const { calculateUrgency } = require('../utils/taskUtils');

/**
 * Retrieves all tasks for a specific user, sorted by order and urgency.
 * @param {string} userId 
 */
const getAllTasks = async (userId) => {
    return await Task.find({ user: userId })
        .sort({ order: 1, urgencyScore: -1, createdAt: -1 });
};

/**
 * Creates a new task with calculated urgency and order.
 * @param {string} userId 
 * @param {Object} taskData 
 */
const createTask = async (userId, taskData) => {
    const { title, description, dueDate, endDate, location, tags, priority, subtasks, isAllDay, recurrence, recurrenceId } = taskData;
    
    const score = calculateUrgency(dueDate, priority);
    const lastTask = await Task.findOne({ user: userId }).sort({ order: -1 });
    const newOrder = lastTask && lastTask.order !== undefined ? lastTask.order + 1 : 1;

    const newTaskData = {
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
        subtasks: subtasks || [],
        isAllDay: isAllDay || false,
        recurrence: recurrence || 'none'
    };

    if (recurrenceId) {
        newTaskData.recurrenceId = recurrenceId;
    }

    return await Task.create(newTaskData);
};

/**
 * Updates an existing task and recalculates its urgency score.
 * @param {string} userId 
 * @param {string} taskId 
 * @param {Object} updateData 
 */
const updateTask = async (userId, taskId, updateData) => {
    const task = await Task.findById(taskId);
    if (!task) throw new Error('Task not found');
    if (task.user.toString() !== userId) throw new Error('User not authorized');

    if (updateData.title) task.title = updateData.title;
    if (updateData.description !== undefined) task.description = updateData.description;
    if (updateData.isCompleted !== undefined) task.isCompleted = updateData.isCompleted;
    if (updateData.priority) task.priority = updateData.priority;
    if (updateData.dueDate !== undefined) task.dueDate = updateData.dueDate;
    if (updateData.endDate !== undefined) task.endDate = updateData.endDate;
    if (updateData.location !== undefined) task.location = updateData.location;
    if (updateData.tags !== undefined) task.tags = updateData.tags;
    if (updateData.subtasks) task.subtasks = updateData.subtasks; 
    if (updateData.aiSuggestions) task.aiSuggestions = updateData.aiSuggestions;
    if (updateData.isAllDay !== undefined) task.isAllDay = updateData.isAllDay;
    if (updateData.recurrence !== undefined) task.recurrence = updateData.recurrence;
    if (updateData.recurrenceId !== undefined) task.recurrenceId = updateData.recurrenceId;

    task.urgencyScore = calculateUrgency(task.dueDate, task.priority);

    return await task.save();
};

/**
 * Deletes a task after verifying ownership.
 * @param {string} userId 
 * @param {string} taskId 
 */
const deleteTask = async (userId, taskId) => {
    const task = await Task.findById(taskId);
    if (!task) throw new Error('Task not found');
    if (task.user.toString() !== userId) throw new Error('User not authorized');

    await task.deleteOne();
    return { id: taskId, message: 'Task deleted successfully' };
};

/**
 * Updates the order of multiple tasks in bulk.
 * @param {string} userId 
 * @param {Array} tasksOrder 
 */
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
    reorderTasks
};