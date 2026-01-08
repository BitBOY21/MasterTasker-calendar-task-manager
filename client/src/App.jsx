import React, { useState, useEffect } from 'react';
// 1. ייבוא הראוטר
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

// --- רכיב פנימי שמנהל את הניווט אחרי התחברות ---
const AppLayout = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const location = useLocation();

    // חישוב המסך הנוכחי מתוך ה-URL עבור ה-Sidebar
    // לדוגמה: אם הכתובת היא /calendar, המשתנה יהיה 'calendar'
    const currentPath = location.pathname.replace('/', '');
    const currentView = currentPath === '' || currentPath === 'dashboard' ? 'dashboard' : currentPath;

    const { tasks, addTask, updateTask, deleteTask } = useTaskContext();

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);

    // State for delete confirmation modals
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isRecurringDeleteModalOpen, setIsRecurringDeleteModalOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);

    // פונקציית גישור: כשהסרגל הצדדי מבקש לשנות מסך, אנחנו משנים את ה-URL
    const handleViewChange = (view) => {
        navigate(`/${view}`);
    };

    const handleTaskClick = (task) => {
        setSelectedTask(task);
        setIsDrawerOpen(true);
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

    // Modified delete handler to check for recurrence
    const handleRequestDelete = (taskOrId) => {
        console.log("🗑️ handleRequestDelete called with:", taskOrId);

        // Protection: If we received an Event object by mistake - ignore it
        if (taskOrId && taskOrId.preventDefault) {
            console.error("❌ Error: Received Event object instead of Task ID");
            return;
        }

        let task = null;
        
        // Case A: Received ID as string (most common)
        if (typeof taskOrId === 'string') {
            task = tasks.find(t => t._id === taskOrId);
        }
        // Case B: Received full task object (has _id field)
        else if (typeof taskOrId === 'object' && taskOrId !== null && taskOrId._id) {
            task = taskOrId;
        }
        
        // Check if we found a valid task to delete
        if (task) {
            setTaskToDelete(task);
            if (task.recurrence && task.recurrence !== 'none') {
                setIsRecurringDeleteModalOpen(true);
            } else {
                setIsDeleteModalOpen(true);
            }
        } else if (typeof taskOrId === 'string') {
             // Fallback if task not found in list (e.g. calendar view might have different data source or sync issue)
             console.warn("⚠️ Task not found in list, assuming single delete for ID:", taskOrId);
             setTaskToDelete({ _id: taskOrId });
             setIsDeleteModalOpen(true);
        } else {
             console.error("⚠️ Could not find task to delete for input:", taskOrId);
        }
    };

    // Actual delete function called by simple modal
    const handleConfirmDelete = async () => {
        if (taskToDelete) {
            // Ensure we have a string ID
            const id = typeof taskToDelete._id === 'object' ? taskToDelete._id.toString() : taskToDelete._id;
            await deleteTask(id);
            setIsDrawerOpen(false); // Close drawer if open
        }
        setIsDeleteModalOpen(false);
        setTaskToDelete(null);
    };

    // Delete function for recurring tasks
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

            {/* ה-Sidebar מקבל את המיקום מה-URL ומשתמש ב-navigate לשינוי */}
            <Sidebar
                currentView={currentView}
                onChangeView={handleViewChange}
                onLogout={onLogout}
            />

            <div style={styles.mainContent}>
                {/* הגדרת הנתיבים (Routes) במקום Switch Case */}
                <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<DashboardPage onChangeView={handleViewChange} user={user} />} />

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

                    <Route path="/list" element={<AnalyticsPage user={user} />} />
                    <Route path="/stats" element={<AnalyticsPage user={user} />} />
                    <Route path="/history" element={<HistoryPage />} />
                    <Route path="/settings" element={<SettingsPage user={user} />} />

                    {/* נתיב ברירת מחדל לכל כתובת לא מוכרת */}
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>

                {/* כפתור הפלוס מופיע רק אם אנחנו לא ב-dashboard */}
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
                onDelete={handleRequestDelete} // Pass the new handler
            />

            <TaskForm
                isOpen={isAddModalOpen}
                onClose={() => {
                    setIsAddModalOpen(false);
                    setSelectedDate(null);
                }}
                onAdd={handleAddTask}
                onRequestDelete={handleRequestDelete} // FIXED: Changed prop name from onDelete to onRequestDelete
                onUpdate={handleUpdateTask}
                taskToEdit={selectedTask}
                initialDate={selectedDate}
            />

            {/* Confirmation Modal for single tasks */}
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Task?"
            />

            {/* New Modal for recurring tasks */}
            <DeleteRecurringModal
                isOpen={isRecurringDeleteModalOpen}
                onClose={() => setIsRecurringDeleteModalOpen(false)}
                onConfirm={handleConfirmRecurringDelete}
            />
        </div>
    );
};

// --- הרכיב הראשי ---
function App() {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState({ name: 'User' });

    const { fetchTasks } = useTaskContext();

    useEffect(() => {
        const savedToken = authService.getToken();
        if (savedToken) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
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

    // אם אין טוקן, מציגים את הלוגין (מחוץ לראוטר, או בתוכו - לבחירתך. כאן השארתי כמו שהיה)
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

    // ברגע שמחוברים, עוטפים ב-BrowserRouter כדי לאפשר ניווט מבוסס URL
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