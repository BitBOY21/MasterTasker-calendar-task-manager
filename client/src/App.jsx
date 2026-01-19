import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useTaskContext } from './context/TaskContext';
import Sidebar from './components/layout/Sidebar';
import TaskDrawer from './components/layout/TaskDrawer';
import DashboardPage from './pages/DashboardPage';
import WorkPage from './pages/WorkPage';
import AnalyticsPage from './pages/AnalyticsPage';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';
import TaskForm from './features/tasks/components/TaskForm';
import Login from './features/auth/Login';
import { authService } from './services/authService';
import { FaPlus } from 'react-icons/fa';
import ConfirmationModal from './components/ui/ConfirmationModal';
import DeleteRecurringModal from './components/ui/DeleteRecurringModal';
import './index.css';

/**
 * Main layout component for authenticated users.
 * Handles navigation, task management state, and global modals.
 */
const AppLayout = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const currentPath = location.pathname.replace('/', '');
    const currentView = currentPath === '' || currentPath === 'dashboard' ? 'dashboard' : currentPath;

    const { tasks, addTask, updateTask, deleteTask } = useTaskContext();

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isRecurringDeleteModalOpen, setIsRecurringDeleteModalOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);

    const handleViewChange = (view) => {
        navigate(`/${view}`);
    };

    const handleTaskClick = (task) => {
        setSelectedTask(task);
        setIsDrawerOpen(true);
    };

    const handleEditTask = (task) => {
        setSelectedTask(task);
        setIsAddModalOpen(true);
    };

    const handleAddTask = async (newTask) => {
        await addTask(newTask);
        setIsAddModalOpen(false);
        setSelectedDate(null);
    };

    const handleUpdateTask = async (taskId, updatedData) => {
        await updateTask(taskId, updatedData);
        if (selectedTask && selectedTask._id === taskId) {
            setSelectedTask(prev => ({ ...prev, ...updatedData }));
        }
    };

    const handleRequestDelete = (taskOrId) => {
        if (taskOrId && taskOrId.preventDefault) {
            return;
        }

        let task = null;
        
        if (typeof taskOrId === 'string') {
            task = tasks.find(t => t._id === taskOrId);
        }
        else if (typeof taskOrId === 'object' && taskOrId !== null && taskOrId._id) {
            task = taskOrId;
        }
        
        if (task) {
            setTaskToDelete(task);
            if (task.recurrence && task.recurrence !== 'none') {
                setIsRecurringDeleteModalOpen(true);
            } else {
                setIsDeleteModalOpen(true);
            }
        } else if (typeof taskOrId === 'string') {
             setTaskToDelete({ _id: taskOrId });
             setIsDeleteModalOpen(true);
        }
    };

    const handleConfirmDelete = async () => {
        if (taskToDelete) {
            const id = typeof taskToDelete._id === 'object' ? taskToDelete._id.toString() : taskToDelete._id;
            await deleteTask(id);
            setIsDrawerOpen(false);
        }
        setIsDeleteModalOpen(false);
        setTaskToDelete(null);
    };

    const handleConfirmRecurringDelete = async (deletePolicy) => {
        if (taskToDelete) {
            const id = typeof taskToDelete._id === 'object' ? taskToDelete._id.toString() : taskToDelete._id;
            await deleteTask(id, deletePolicy);
            setIsDrawerOpen(false);
        }
        setIsRecurringDeleteModalOpen(false);
        setTaskToDelete(null);
    };

    const handleEventDrop = async ({ event, start, end }) => {
        await updateTask(event.id, { dueDate: start, endDate: end });
    };

    return (
        <div className="app-layout" style={styles.appContainer}>
            <Sidebar
                currentView={currentView}
                onChangeView={handleViewChange}
                onLogout={onLogout}
            />

            <div style={styles.mainContent}>
                <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<DashboardPage onChangeView={handleViewChange} user={user} onRequestDelete={handleRequestDelete} />} />

                    <Route path="/calendar" element={
                        <WorkPage
                            onDateSelect={(date) => {
                                setSelectedDate(date);
                                setIsAddModalOpen(true);
                            }}
                            onEventDrop={handleEventDrop}
                            onEventClick={handleTaskClick}
                            onRequestDelete={handleRequestDelete}
                        />
                    } />

                    <Route path="/list" element={<AnalyticsPage user={user} onRequestDelete={handleRequestDelete} onEditTask={handleEditTask} />} />
                    <Route path="/stats" element={<AnalyticsPage user={user} onRequestDelete={handleRequestDelete} onEditTask={handleEditTask} />} />
                    <Route path="/history" element={<HistoryPage />} />
                    <Route path="/settings" element={<SettingsPage user={user} />} />

                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>

                {currentView !== 'dashboard' && (
                    <button
                        onClick={() => {
                            setSelectedDate(new Date());
                            setIsAddModalOpen(true);
                        }}
                        style={fabStyle}
                        title="Add New Task"
                    >
                        <FaPlus />
                    </button>
                )}
            </div>

            <TaskDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                task={selectedTask}
                onUpdate={handleUpdateTask}
                onDelete={handleRequestDelete}
            />

            <TaskForm
                isOpen={isAddModalOpen}
                onClose={() => {
                    setIsAddModalOpen(false);
                    setSelectedDate(null);
                    setSelectedTask(null);
                }}
                onAdd={handleAddTask}
                onRequestDelete={handleRequestDelete}
                onUpdate={handleUpdateTask}
                taskToEdit={selectedTask}
                initialDate={selectedDate}
            />

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Task?"
            />

            <DeleteRecurringModal
                isOpen={isRecurringDeleteModalOpen}
                onClose={() => setIsRecurringDeleteModalOpen(false)}
                onConfirm={handleConfirmRecurringDelete}
            />
        </div>
    );
};

function App() {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState({ name: 'User' });

    const { fetchTasks } = useTaskContext();

    useEffect(() => {
        const savedToken = authService.getToken();
        if (savedToken) {
            setToken(savedToken);
            setUser({ name: authService.getUserName() });
        }
    }, []);

    useEffect(() => {
        if (token) {
            fetchTasks();
        }
    }, [token, fetchTasks]);

    const handleLogout = () => {
        authService.logout();
        setToken(null);
        setUser({ name: 'User' });
    };

    if (!token) return <Login onLogin={(authData) => {
        if (typeof authData === 'string') {
            setToken(authData);
            setUser({ name: authService.getUserName() });
        } else {
            setToken(authData.token);
            setUser({ name: authData.name, email: authData.email });
            localStorage.setItem('token', authData.token);
            localStorage.setItem('userName', authData.name);
        }
    }} />;

    return (
        <BrowserRouter>
            <AppLayout user={user} onLogout={handleLogout} />
        </BrowserRouter>
    );
}

const styles = {
    appContainer: {
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    },
    mainContent: {
        flex: 1,
        position: 'relative',
        backgroundColor: 'transparent',
        overflow: 'hidden',
    }
};

const fabStyle = {
    position: 'absolute',
    bottom: '30px',
    right: '30px',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    fontSize: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 15px rgba(0,123,255,0.4)',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    zIndex: 1000
};

export default App;