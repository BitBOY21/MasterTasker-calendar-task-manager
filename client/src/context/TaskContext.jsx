import React, { createContext, useContext } from 'react';
import { useTasks } from '../hooks/useTasks';

// 1. Create Context
const TaskContext = createContext(null);

// 2. Create Provider Component
export const TaskProvider = ({ children }) => {
    // Use our existing hook logic
    const taskLogic = useTasks();

    return (
        <TaskContext.Provider value={taskLogic}>
            {children}
        </TaskContext.Provider>
    );
};

// 3. Create Custom Hook for easy access
export const useTaskContext = () => {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error("useTaskContext must be used within a TaskProvider");
    }
    return context;
};