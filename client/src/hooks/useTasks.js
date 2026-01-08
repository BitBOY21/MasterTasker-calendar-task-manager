import { useState, useEffect, useCallback } from 'react';
import { taskService } from '../services/taskService';

export const useTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch Tasks
    const fetchTasks = useCallback(async () => {
        try {
            setLoading(true);
            const data = await taskService.getAll();
            
            // Defensive check: Ensure data is an array
            if (Array.isArray(data)) {
                setTasks(data);
            } else {
                console.error("API returned non-array data:", data);
                setTasks([]); // Fallback to empty array
                setError("Invalid data format from server");
            }
            setError(null);
        } catch (err) {
            console.error("Error fetching tasks:", err);
            setError(err.message || "Failed to fetch tasks");
            setTasks([]); // Ensure tasks is always an array on error
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial Load
    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    // Add Task
    const addTask = async (newTask) => {
        try {
            const createdTask = await taskService.create(newTask);
            
            if (newTask.recurrence && newTask.recurrence !== 'none') {
                await fetchTasks(); // Refetch to get all instances
            } else {
                setTasks(prev => [createdTask, ...prev]);
            }

            return createdTask;
        } catch (err) {
            console.error("Error adding task:", err);
            throw err;
        }
    };

    // Update Task
    const updateTask = async (id, updatedData) => {
        try {
            // Optimistic Update - update immediately for better UX
            setTasks(prev => prev.map(t => {
                // Handle both string and ObjectId comparison
                const taskId = typeof t._id === 'string' ? t._id : t._id?.toString();
                const updateId = typeof id === 'string' ? id : id?.toString();
                return taskId === updateId ? { ...t, ...updatedData } : t;
            }));
            
            // Send update to server
            const result = await taskService.update(id, updatedData);
            
            // Re-sync with server response to ensure consistency
            setTasks(prev => prev.map(t => {
                const taskId = typeof t._id === 'string' ? t._id : t._id?.toString();
                const resultId = typeof result._id === 'string' ? result._id : result._id?.toString();
                return taskId === resultId ? result : t;
            }));
            return result;
        } catch (err) {
            console.error("Error updating task:", err);
            // Revert on error by refetching from server
            fetchTasks(); 
            throw err;
        }
    };

    // Delete Task
    const deleteTask = async (id, deletePolicy) => {
        try {
            console.log("🗑️ useTasks: Raw ID received:", id);

            let safeId = id;
            
            // Handle object ID (e.g. if passed incorrectly)
            if (typeof id === 'object' && id !== null) {
                console.warn("⚠️ useTasks: Received object as ID, attempting to extract string ID");
                if (id._id) {
                    safeId = id._id.toString();
                } else {
                    safeId = id.toString();
                }
            }

            // Final check
            if (safeId === '[object Object]') {
                console.error("❌ useTasks: Failed to extract valid ID. Aborting delete.");
                return;
            }

            console.log("🗑️ useTasks: Deleting task with Safe ID:", safeId, "Policy:", deletePolicy);

            // If deleting a series, we should refetch because multiple tasks might be deleted
            if (deletePolicy === 'series') {
                 await taskService.delete(safeId, deletePolicy);
                 await fetchTasks();
            } else {
                // Optimistic Update for single delete
                setTasks(prev => prev.filter(t => {
                    const taskId = typeof t._id === 'string' ? t._id : t._id?.toString();
                    return taskId !== safeId;
                }));
                await taskService.delete(safeId, deletePolicy);
            }
        } catch (err) {
            console.error("Error deleting task:", err);
            fetchTasks(); // Revert
            throw err;
        }
    };

    // Generate AI
    const generateAI = async (id) => {
        try {
            const updatedTask = await taskService.generateAI(id);
            setTasks(prev => prev.map(t => t._id === id ? updatedTask : t));
            return updatedTask;
        } catch (err) {
            console.error("AI Error:", err);
            throw err;
        }
    };

    return {
        tasks,
        loading,
        error,
        fetchTasks,
        addTask,
        updateTask,
        deleteTask,
        generateAI
    };
};