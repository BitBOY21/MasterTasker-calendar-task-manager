import React, { useState, useEffect } from 'react';
import { taskService } from '../../services/taskService';
import TaskFormModal from './TaskFormModal';
import TaskListSidebar from './TaskListSidebar';
import DailySummaryAI from './DailySummaryAI';
import { FaPlus, FaFire, FaCheckCircle, FaHourglassHalf, FaClock } from 'react-icons/fa';

// --- Live Clock Component (Inside a Card) ---
const LiveClockCard = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Force English Locale
    const timeString = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    const dateString = time.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });

    return (
        <div style={{...styles.statCard, borderLeft: '4px solid #007bff'}}>
            <div style={{...styles.statIconBox, backgroundColor: '#e3f2fd', color: '#007bff'}}>
                <FaClock />
            </div>
            <div>
                <span style={styles.statLabel}>{dateString}</span>
                <div style={styles.statValue}>{timeString}</div>
            </div>
        </div>
    );
};

// --- Top Row Component (Clock + Stats) ---
const TopStatsRow = ({ tasks }) => {
    // Filter for TODAY only
    const todayTasks = tasks.filter(t => {
        if (!t.dueDate) return false;
        const d = new Date(t.dueDate);
        const today = new Date();
        return d.getDate() === today.getDate() &&
               d.getMonth() === today.getMonth() &&
               d.getFullYear() === today.getFullYear();
    });

    const totalToday = todayTasks.length;
    
    // Urgent Logic
    const totalUrgent = todayTasks.filter(t => t.priority === 'High').length;
    const pendingUrgent = todayTasks.filter(t => t.priority === 'High' && !t.isCompleted).length;

    // Completed Logic
    const completedCount = todayTasks.filter(t => t.isCompleted).length;

    // Pending Logic
    const pendingCount = todayTasks.filter(t => !t.isCompleted).length;

    return (
        <div style={styles.statsRow}>
            {/* 1. Clock Card */}
            <LiveClockCard />

            {/* 2. Pending Card */}
            <div style={{...styles.statCard, borderLeft: '4px solid #ffc107'}}>
                <div style={{...styles.statIconBox, color: '#ffc107'}}><FaHourglassHalf /></div>
                <div>
                    <span style={styles.statLabel}>Pending</span>
                    <div style={styles.statValue}>
                        {pendingCount} <span style={styles.subValue}>/ {totalToday}</span>
                    </div>
                </div>
            </div>

            {/* 3. Urgent Card */}
            <div style={{...styles.statCard, borderLeft: '4px solid #dc3545'}}>
                <div style={{...styles.statIconBox, color: '#dc3545'}}><FaFire /></div>
                <div>
                    <span style={styles.statLabel}>Urgent Left</span>
                    <div style={styles.statValue}>
                        {pendingUrgent} <span style={styles.subValue}>/ {totalUrgent}</span>
                    </div>
                </div>
            </div>

            {/* 4. Completed Card */}
            <div style={{...styles.statCard, borderLeft: '4px solid #28a745'}}>
                <div style={{...styles.statIconBox, color: '#28a745'}}><FaCheckCircle /></div>
                <div>
                    <span style={styles.statLabel}>Completed</span>
                    <div style={styles.statValue}>
                        {completedCount} <span style={styles.subValue}>/ {totalToday}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Dashboard = ({ onChangeView, user }) => { 
    const [tasks, setTasks] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [editingTask, setEditingTask] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';
    const userName = user?.name || 'User'; 

    const fetchTasks = async () => {
        try {
            const data = await taskService.getAll();
            setTasks(data);
        } catch (error) { console.error("Error fetching tasks:", error); }
    };

    const handleAddTask = async (newTask) => {
        try {
            if (selectedDate && !newTask.dueDate) {
                const d = new Date(selectedDate);
                const offset = d.getTimezoneOffset() * 60000;
                const localISOTime = (new Date(d - offset)).toISOString();
                newTask.dueDate = localISOTime;
            }
            await taskService.create(newTask);
            await fetchTasks();
        } catch (error) { console.error("Error adding task:", error); }
    };

    const handleDelete = async (id) => {
        try {
            await taskService.delete(id);
            setTasks(tasks.filter(task => task._id !== id));
            if (editingTask && editingTask._id === id) setEditingTask(null);
        } catch (error) { console.error("Error deleting task:", error); }
    };

    const handleUpdateTask = async (taskId, updatedData) => {
        try {
            setTasks(prev => prev.map(t => t._id === taskId ? { ...t, ...updatedData } : t));
            await taskService.update(taskId, updatedData);
            if (editingTask && editingTask._id === taskId) setEditingTask(prev => ({ ...prev, ...updatedData }));
        } catch (error) { fetchTasks(); }
    };

    const handleGenerateAI = async (id) => {
        try {
            const updatedTask = await taskService.generateAI(id);
            setTasks(tasks.map(t => t._id === id ? updatedTask : t));
        } catch (error) { alert("AI Failed"); }
    };

    const handleListDragEnd = async (result) => {
        if (!result.destination) return;
    };

    useEffect(() => { fetchTasks(); }, []);

    const todayTasks = tasks.filter(t => {
        if (!t.dueDate) return false;
        const d = new Date(t.dueDate);
        const today = new Date();
        return d.getDate() === today.getDate() &&
               d.getMonth() === today.getMonth() &&
               d.getFullYear() === today.getFullYear();
    });

    const sortedTodayTasks = [...todayTasks].sort((a, b) => {
        const timeA = new Date(a.dueDate).getTime();
        const timeB = new Date(b.dueDate).getTime();
        if (timeA !== timeB) return timeA - timeB;
        const priorityMap = { 'High': 3, 'Medium': 2, 'Low': 1 };
        return priorityMap[b.priority] - priorityMap[a.priority];
    });

    return (
        <div style={styles.container}>
            
            <div style={styles.headerContainer}>
                <h1 style={styles.greeting}>
                    {greeting}, <span className="text-gradient">{userName}</span> 👋
                </h1>
                <p style={styles.subGreeting}>Here's your daily overview</p>
            </div>

            <div style={styles.contentWrapper}>
                
                {/* 1. Top Row: Clock + 3 Stats */}
                <TopStatsRow tasks={tasks} />

                {/* 2. Today's Focus List */}
                <div style={styles.sectionContainer}>
                    <div style={styles.sectionHeader}>
                        <h3 style={styles.sectionTitle}>📅 Today's Focus</h3>
                        <span style={styles.badge}>{sortedTodayTasks.length} tasks</span>
                    </div>
                    
                    <div style={styles.listWrapper}>
                        {sortedTodayTasks.length > 0 ? (
                            <TaskListSidebar
                                tasks={sortedTodayTasks}
                                onDelete={handleDelete}
                                onUpdate={handleUpdateTask}
                                onGenerateAI={handleGenerateAI}
                                onDragEnd={handleListDragEnd}
                            />
                        ) : (
                            <div style={styles.emptyState}>
                                <span style={{fontSize: '2rem'}}>☕</span>
                                <p>No tasks scheduled for today. Enjoy!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* 3. AI Daily Insight */}
                <DailySummaryAI tasks={tasks} />

            </div>

            <button onClick={() => { setSelectedDate(new Date()); setIsAddModalOpen(true); }} style={styles.fabButton} title="Add New Task">
                <FaPlus />
            </button>

            <TaskFormModal 
                isOpen={isAddModalOpen || !!editingTask} 
                onClose={() => {
                    setIsAddModalOpen(false);
                    setEditingTask(null);
                }}
                onAdd={handleAddTask}
                onUpdate={handleUpdateTask}
                onDelete={handleDelete}
                taskToEdit={editingTask}
                initialDate={selectedDate} 
            />
        </div>
    );
};

const styles = {
    container: { maxWidth: '1000px', margin: '0 auto', padding: '20px', position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f4f6f9' },
    
    headerContainer: { textAlign: 'center', marginBottom: '25px' },
    greeting: { margin: 0, fontSize: '2.2rem', fontWeight: '800', color: '#333' },
    subGreeting: { margin: '5px 0 0 0', fontSize: '1.1rem', color: '#666' },

    contentWrapper: { display: 'flex', flexDirection: 'column', gap: '25px', paddingBottom: '80px' },

    // Stats Row (4 Columns, Equal Gap)
    statsRow: { 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: '20px', 
        width: '100%'
    },
    
    statCard: { 
        backgroundColor: 'white', 
        padding: '15px 20px', 
        borderRadius: '16px', 
        boxShadow: '0 4px 15px rgba(0,0,0,0.03)', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '15px', 
        minHeight: '90px',
        width: '100%' 
    },
    statIconBox: { width: '45px', height: '45px', borderRadius: '12px', backgroundColor: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 },
    statLabel: { fontSize: '0.85rem', color: '#666', display: 'block', marginBottom: '2px', fontWeight: '600', whiteSpace: 'nowrap' },
    statValue: { fontSize: '1.4rem', fontWeight: '800', color: '#333', lineHeight: '1' },
    subValue: { fontSize: '0.9rem', color: '#999', fontWeight: '500' }, // New style for the "/ Total" part

    // Section Styles
    sectionContainer: { backgroundColor: 'white', borderRadius: '16px', padding: '25px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' },
    sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #f0f0f0', paddingBottom: '15px' },
    sectionTitle: { margin: 0, fontSize: '1.3rem', fontWeight: '700', color: '#333' },
    badge: { backgroundColor: '#e3f2fd', color: '#007bff', padding: '4px 12px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: '600' },
    
    listWrapper: { minHeight: '200px' },
    emptyState: { textAlign: 'center', padding: '40px', color: '#888' },

    fabButton: {
        position: 'fixed', bottom: '30px', right: '30px', width: '60px', height: '60px',
        borderRadius: '50%', background: 'linear-gradient(135deg, #007bff, #6f42c1)', color: 'white',
        border: 'none', fontSize: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 6px 20px rgba(0,123,255,0.4)', cursor: 'pointer', zIndex: 1500
    },
};

export default Dashboard;