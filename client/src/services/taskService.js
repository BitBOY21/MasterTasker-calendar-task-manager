import api from '../api';

// Central service for managing tasks

export const taskService = {
    getAll: async () => {
        const response = await api.get('/tasks');
        return response.data;
    },

    create: async (taskData) => {
        const response = await api.post('/tasks', taskData);
        return response.data;
    },

    update: async (id, updateData) => {
        const response = await api.put(`/tasks/${id}`, updateData);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/tasks/${id}`);
        return response.data;
    },

    // Legacy function (can be kept for backward compatibility or removed later)
    generateAI: async (id) => {
        const response = await api.post(`/tasks/${id}/ai-assist`);
        return response.data;
    },

    // New function to get task breakdown from AI (before creation)
    getAiBreakdown: async (title) => {
        const response = await api.post('/ai/breakdown', { title });
        return response.data.steps; // Returns an array of strings
    },

    reorder: async (tasks) => {
        const tasksOrder = tasks.map((task, index) => ({
            id: task._id,
            order: index
        }));
        
        const response = await api.put('/tasks/reorder', { tasks: tasksOrder });
        return response.data;
    }
};