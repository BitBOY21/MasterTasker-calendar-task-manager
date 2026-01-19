import React, {useState} from 'react';
import NewSummaryFilters from './NewSummaryFilters'; // Updated import
import TaskFormModal from './TaskFormModal';
import Card from '../../components/ui/Card';
import SummaryStats from './components/summary/SummaryStats';
import SummaryCharts from './components/summary/SummaryCharts';
import ActivityLog from './components/summary/ActivityLog';
import {FaSortAmountDown, FaEdit, FaTrash, FaCheck} from 'react-icons/fa';
import {isToday, isThisWeek, isThisMonth, isWithinInterval, startOfDay, endOfDay} from 'date-fns';

const MySummary = ({tasks, user, onUpdate, onDelete}) => {
    const userName = user?.name || 'User';

    // Filter States
    const [filter, setFilter] = useState('All'); // Status
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [activeTags, setActiveTags] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState('all'); // 'today', 'week', 'month', 'custom'
    const [customStartDate, setCustomStartDate] = useState('');
    const [customEndDate, setCustomEndDate] = useState('');

    const [visibleTasksCount, setVisibleTasksCount] = useState(5);
    const [sortBy, setSortBy] = useState('date_desc');

    const [editingTask, setEditingTask] = useState(null);

    // --- Filtering Logic ---
    const filteredTasks = tasks
        .filter(task => {
            // Status
            if (filter === 'Completed' && !task.isCompleted) return false;
            if (filter === 'Pending' && task.isCompleted) return false;

            // Priority
            if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;

            // Tags
            if (activeTags.length > 0) {
                const hasTag = task.tags && task.tags.some(t => activeTags.includes(t));
                if (!hasTag) return false;
            }

            // Search
            if (searchTerm && !task.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;

            // Date Filter
            if (dateFilter && dateFilter !== 'all') {
                if (!task.dueDate) return false;
                const taskDate = new Date(task.dueDate);

                switch (dateFilter) {
                    case 'today':
                        if (!isToday(taskDate)) return false;
                        break;
                    case 'week':
                        if (!isThisWeek(taskDate, {weekStartsOn: 0})) return false;
                        break;
                    case 'month':
                        if (!isThisMonth(taskDate)) return false;
                        break;
                    case 'custom':
                        if (customStartDate && customEndDate) {
                            const start = startOfDay(new Date(customStartDate));
                            const end = endOfDay(new Date(customEndDate));
                            if (!isWithinInterval(taskDate, {start, end})) return false;
                        } else if (customStartDate) {
                            const start = startOfDay(new Date(customStartDate));
                            if (taskDate < start) return false;
                        } else if (customEndDate) {
                            const end = endOfDay(new Date(customEndDate));
                            if (taskDate > end) return false;
                        }
                        break;
                    default:
                        break;
                }
            }

            return true;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'date_desc':
                    return new Date(b.dueDate || 0) - new Date(a.dueDate || 0);
                case 'date_asc':
                    return new Date(a.dueDate || 0) - new Date(b.dueDate || 0);
                case 'priority': {
                    const pMap = {'High': 3, 'Medium': 2, 'Low': 1};
                    return pMap[b.priority] - pMap[a.priority];
                }
                case 'name':
                    return a.title.localeCompare(b.title);
                default:
                    return 0;
            }
        });

    const toggleTag = (tag) => {
        setActiveTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
    };

    const handleResetAll = () => {
        setFilter('All');
        setPriorityFilter('all');
        setActiveTags([]);
        setSearchTerm('');
        setDateFilter('all');
        setCustomStartDate('');
        setCustomEndDate('');
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={{fontSize: '2.5rem', marginBottom: '8px', fontWeight: '800'}}>
                    <span className="text-gradient">Your Summary, {userName}</span> 📊
                </h1>
                <p style={styles.subtitle}>A detailed look at your overall performance.</p>
            </div>

            {/* 1. Stats Row */}
            <SummaryStats tasks={tasks}/>

            {/* 2. Unified All Tasks Section */}
            <Card style={{padding: '25px', marginBottom: '20px'}}>
                <div style={styles.sectionHeader}>
                    <h3 style={styles.sectionTitle}>📋 All Tasks ({filteredTasks.length})</h3>

                    <div style={styles.sortBox}>
                        <FaSortAmountDown color="#999"/>
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={styles.sortSelect}>
                            <option value="date_desc">Newest First</option>
                            <option value="date_asc">Oldest First</option>
                            <option value="priority">Priority</option>
                            <option value="name">Name (A-Z)</option>
                        </select>
                    </div>
                </div>

                <div style={styles.filtersWrapper}>
                    <NewSummaryFilters
                        statusFilter={filter} setStatusFilter={setFilter}
                        priorityFilter={priorityFilter} setPriorityFilter={setPriorityFilter}
                        activeTags={activeTags} toggleTag={toggleTag}
                        searchTerm={searchTerm} setSearchTerm={setSearchTerm}
                        dateFilter={dateFilter} setDateFilter={setDateFilter}
                        customStartDate={customStartDate} setCustomStartDate={setCustomStartDate}
                        customEndDate={customEndDate} setCustomEndDate={setCustomEndDate}
                        onReset={handleResetAll}
                    />
                </div>

                <div style={styles.scrollableList}>
                    {filteredTasks.length > 0 ? (
                        filteredTasks.slice(0, visibleTasksCount).map(task => (
                            <div key={task._id} style={styles.taskRow}>
                                <button
                                    onClick={() => onUpdate(task._id, {isCompleted: !task.isCompleted})}
                                    style={{
                                        ...styles.checkBtn,
                                        backgroundColor: task.isCompleted ? '#4caf50' : 'transparent',
                                        borderColor: task.isCompleted ? '#4caf50' : '#ccc'
                                    }}
                                >
                                    {task.isCompleted && <FaCheck color="white" size={10}/>}
                                </button>

                                <div style={styles.taskInfo}>
                                    <span style={{
                                        ...styles.taskTitle,
                                        textDecoration: task.isCompleted ? 'line-through' : 'none',
                                        color: task.isCompleted ? '#999' : '#333'
                                    }}>
                                        {task.title}
                                    </span>
                                    <span
                                        style={styles.taskDate}>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : ''}</span>
                                </div>

                                <span style={{
                                    ...styles.tag,
                                    backgroundColor: task.priority === 'High' ? '#ffebee' : '#e3f2fd',
                                    color: task.priority === 'High' ? '#c62828' : '#1565c0'
                                }}>
                                    {task.priority}
                                </span>

                                <div style={styles.actions}>
                                    <button onClick={() => setEditingTask(task)} style={styles.iconBtn} title="Edit">
                                        <FaEdit/></button>
                                    <button onClick={() => {
                                        if (window.confirm('Delete?')) onDelete(task._id)
                                    }} style={{...styles.iconBtn, color: '#dc3545'}} title="Delete"><FaTrash/></button>
                                </div>
                            </div>
                        ))
                    ) : <p style={styles.emptyText}>No tasks match your filters.</p>}

                    {filteredTasks.length > visibleTasksCount && (
                        <div style={styles.moreText} onClick={() => setVisibleTasksCount(prev => prev + 5)}>
                            + Load more tasks...
                        </div>
                    )}
                </div>
            </Card>

            {/* 3. Graphs */}
            <SummaryCharts tasks={tasks}/>

            {/* 4. Activity Log */}
            <ActivityLog tasks={tasks}/>

            <TaskFormModal
                isOpen={!!editingTask}
                onClose={() => setEditingTask(null)}
                onUpdate={onUpdate}
                onDelete={onDelete}
                taskToEdit={editingTask}
            />
        </div>
    );
};

const styles = {
    container: {
        padding: '30px',
        maxWidth: '1200px',
        margin: '0 auto',
        paddingBottom: '60px',
        height: '100%',
        overflowY: 'auto',
        background: '#f4f6f9'
    },
    header: {marginBottom: '25px', textAlign: 'center'},
    subtitle: {color: '#666', fontSize: '1.1rem', fontWeight: '400'},

    sectionHeader: {
        marginBottom: '15px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px'
    },
    sectionTitle: {fontSize: '1.3rem', color: '#333', fontWeight: '700', margin: 0},

    sortBox: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: '#f8f9fa',
        padding: '6px 12px',
        borderRadius: '8px',
        border: '1px solid #eee'
    },
    sortSelect: {
        border: 'none',
        background: 'transparent',
        outline: 'none',
        fontSize: '0.9rem',
        cursor: 'pointer',
        color: '#555'
    },

    filtersWrapper: {marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px solid #f0f0f0'},

    scrollableList: {maxHeight: '300px', overflowY: 'auto', paddingRight: '5px'},

    taskRow: {display: 'flex', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f0f0f0', gap: '15px'},
    checkBtn: {
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        border: '2px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        padding: 0
    },
    taskInfo: {flex: 1, display: 'flex', flexDirection: 'column'},
    taskTitle: {fontSize: '1rem', fontWeight: '500'},
    taskDate: {fontSize: '0.8rem', color: '#888'},
    tag: {padding: '4px 10px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: '600'},

    actions: {display: 'flex', gap: '8px', opacity: 0.6, transition: 'opacity 0.2s'},
    iconBtn: {background: 'none', border: 'none', cursor: 'pointer', color: '#666', fontSize: '0.9rem'},

    moreText: {
        textAlign: 'center',
        marginTop: '20px',
        color: '#007bff',
        fontSize: '0.95rem',
        cursor: 'pointer',
        fontWeight: '600',
        transition: 'color 0.2s ease'
    },
    emptyText: {textAlign: 'center', color: '#999', fontStyle: 'italic', padding: '20px'},
};

export default MySummary;