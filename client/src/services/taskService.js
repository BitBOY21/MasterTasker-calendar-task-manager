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

    delete: async (id, deletePolicy) => {
        // Send scope as query param to match controller expectation
        const queryString = deletePolicy ? `?scope=${deletePolicy}` : '';
        const response = await api.delete(`/tasks/${id}${queryString}`);
        return response.data;
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