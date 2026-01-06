import React, { useState } from 'react';
import { 
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie 
} from 'recharts';
import SummaryFilters from './SummaryFilters';
import { cardStyle, colors, gradientText } from '../../components/ui/DesignSystem';

const MySummary = ({ tasks, user }) => {
    const userName = user?.name || 'User';
    const [filter, setFilter] = useState('All'); 
    const [visibleTasksCount, setVisibleTasksCount] = useState(5); 
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [activeTags, setActiveTags] = useState([]);

    // --- חישוב נתונים ---
    const total = tasks.length;
    const completed = tasks.filter(t => t.isCompleted).length;
    const pending = total - completed;
    const highPriorityOpen = tasks.filter(t => t.priority === 'High' && !t.isCompleted).length;
    
    // נתונים לגרפים
    const priorityData = [
        { name: 'High', value: highPriorityOpen, color: '#ff4d4d' },
        { name: 'Medium', value: tasks.filter(t => t.priority === 'Medium' && !t.isCompleted).length, color: '#ffad33' },
        { name: 'Low', value: tasks.filter(t => t.priority === 'Low' && !t.isCompleted).length, color: '#28a745' },
    ].filter(d => d.value > 0);

    const weeklyActivity = [
        { day: 'Sun', tasks: 2 }, { day: 'Mon', tasks: 5 }, { day: 'Tue', tasks: 3 },
        { day: 'Wed', tasks: completed > 5 ? 6 : completed }, { day: 'Thu', tasks: 4 },
        { day: 'Fri', tasks: 1 }, { day: 'Sat', tasks: 0 },
    ];

    // --- לוגיקת סינון ---
    const filteredTasks = tasks.filter(task => {
        // 1. Status
        if (filter === 'Completed' && !task.isCompleted) return false;
        if (filter === 'Pending' && task.isCompleted) return false;
        if (filter === 'High Priority' && task.priority !== 'High') return false;

        // 2. Priority Filter (מהרכיב החדש)
        if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;

        // 3. Tags
        if (activeTags.length > 0) {
            const hasTag = task.tags && task.tags.some(t => activeTags.includes(t));
            if (!hasTag) return false;
        }

        return true;
    });

    const toggleTag = (tag) => {
        setActiveTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
    };

    // --- פעילות אחרונה ---
    const recentActivity = tasks
        .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
        .slice(0, 10)
        .map(t => ({
            id: t._id,
            action: t.isCompleted ? 'Completed' : 'Created',
            taskTitle: t.title,
            time: new Date(t.updatedAt || t.createdAt).toLocaleDateString('en-GB')
        }));

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '8px', fontWeight: '800' }}>
                    <span className="text-gradient">Your Summary, {userName}</span> 📊
                </h1>
                <p style={styles.subtitle}>A detailed look at your performance.</p>
            </div>

            {/* כרטיסים */}
            <div style={styles.cardsGrid}>
                <div style={{...styles.card, borderLeftColor: '#4caf50'}}>
                    <h3 style={styles.cardTitle}>Completed</h3>
                    <div style={styles.bigNumber}>{completed}<span style={styles.totalNumber}>/{total}</span></div>
                </div>
                <div style={{...styles.card, borderLeftColor: '#ff9800'}}>
                    <h3 style={styles.cardTitle}>Pending</h3>
                    <div style={styles.bigNumber}>{pending}</div>
                </div>
                <div style={{...styles.card, borderLeftColor: '#f44336'}}>
                    <h3 style={styles.cardTitle}>Urgent</h3>
                    <div style={{...styles.bigNumber, background: 'linear-gradient(135deg, #f44336, #d32f2f)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'}}>🔥 {highPriorityOpen}</div>
                </div>
            </div>

            {/* --- 1. Advanced Filters --- */}
            <SummaryFilters 
                statusFilter={filter} setStatusFilter={setFilter}
                priorityFilter={priorityFilter} setPriorityFilter={setPriorityFilter}
                activeTags={activeTags} toggleTag={toggleTag}
            />

            {/* --- 2. All Tasks List --- */}
            <div style={styles.section}>
                <div style={styles.sectionHeader}>
                    <h3 style={styles.sectionTitle}>📋 All Tasks ({filteredTasks.length})</h3>
                </div>
                
                <div style={styles.scrollableList}>
                    {filteredTasks.length > 0 ? (
                        filteredTasks.slice(0, visibleTasksCount).map(task => (
                            <div key={task._id} style={styles.taskRow}>
                                <span style={{
                                    ...styles.statusDot, 
                                    backgroundColor: task.isCompleted ? '#4caf50' : '#ff9800'
                                }}></span>
                                <span style={styles.taskTitle}>{task.title}</span>
                                <span style={styles.taskDate}>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : ''}</span>
                                <span style={{
                                    ...styles.tag, 
                                    backgroundColor: task.priority === 'High' ? '#ffebee' : '#e3f2fd',
                                    color: task.priority === 'High' ? '#c62828' : '#1565c0'
                                }}>
                                    {task.priority}
                                </span>
                            </div>
                        ))
                    ) : <p style={styles.emptyText}>No tasks match your filters.</p>}
                    
                    {filteredTasks.length > visibleTasksCount && (
                        <div 
                            style={styles.moreText} 
                            onClick={() => setVisibleTasksCount(prev => prev + 5)}
                        >
                            + Load more tasks...
                        </div>
                    )}
                </div>
            </div>

            {/* --- 3. Graphs --- */}
            <div style={styles.chartsRow}>
                <div style={styles.chartCard}>
                    <h3 style={styles.chartTitle}>Task Priorities</h3>
                    <div style={{ width: '100%', height: 200 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie data={priorityData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60}>
                                    {priorityData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div style={styles.legend}>
                        {priorityData.map(d => <span key={d.name} style={{color: d.color, fontSize:'0.85rem', margin:'0 5px'}}>● {d.name}</span>)}
                    </div>
                </div>

                <div style={styles.chartCard}>
                    <h3 style={styles.chartTitle}>Weekly Activity</h3>
                    <div style={{ width: '100%', height: 200 }}>
                        <ResponsiveContainer>
                            <BarChart data={weeklyActivity}>
                                <XAxis dataKey="day" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip cursor={{fill: 'transparent'}} />
                                <Bar dataKey="tasks" fill="#007bff" radius={[4, 4, 0, 0]} barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* --- 4. My Activity --- */}
            <div style={styles.section}>
                <h3 style={styles.sectionTitle}>📜 My Activity</h3>
                <div style={styles.scrollableList}>
                    {recentActivity.map(item => (
                        <div key={item.id} style={styles.activityItem}>
                            <div style={styles.activityIcon}>
                                {item.action === 'Completed' ? '✅' : '✨'}
                            </div>
                            <div style={styles.activityContent}>
                                <span style={styles.activityText}>
                                    You <strong>{item.action}</strong> the task "{item.taskTitle}"
                                </span>
                                <span style={styles.activityTime}>{item.time}</span>
                            </div>
                        </div>
                    ))}
                    {recentActivity.length === 0 && <div style={styles.emptyText}>No recent activity.</div>}
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: { 
        padding: '40px', 
        maxWidth: '1200px', 
        margin: '0 auto', 
        paddingBottom: '80px', 
        height: '100%', 
        overflowY: 'auto',
        background: '#f4f6f9'
    },
    header: { 
        marginBottom: '40px', 
        textAlign: 'center' 
    },
    // Removed welcome style as it's now inline with class
    subtitle: { 
        color: '#666', 
        fontSize: '1.1rem',
        fontWeight: '400'
    },
    
    cardsGrid: { 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
        gap: '24px', 
        marginBottom: '32px' 
    },
    card: { 
        ...cardStyle,
        padding: '28px',
        borderLeft: '4px solid',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
    },
    cardTitle: { 
        fontSize: '0.85rem', 
        color: '#888', 
        fontWeight: '700', 
        textTransform: 'uppercase', 
        marginBottom: '12px',
        letterSpacing: '0.5px'
    },
    bigNumber: { 
        fontSize: '2.8rem', 
        fontWeight: '800', 
        color: '#333',
        lineHeight: '1.2'
    },
    totalNumber: { 
        fontSize: '1.3rem', 
        color: '#ccc', 
        fontWeight: '500' 
    },

    section: { 
        ...cardStyle,
        padding: '32px',
        marginBottom: '32px'
    },
    sectionHeader: { 
        marginBottom: '24px' 
    },
    sectionTitle: { 
        fontSize: '1.3rem', 
        color: '#333', 
        fontWeight: '700', 
        margin: 0 
    },
    
    scrollableList: { 
        maxHeight: '300px', 
        overflowY: 'auto', 
        paddingRight: '5px' 
    },

    taskRow: { 
        display: 'flex', 
        alignItems: 'center', 
        padding: '16px 0', 
        borderBottom: '1px solid #f0f0f0' 
    },
    statusDot: { 
        width: '12px', 
        height: '12px', 
        borderRadius: '50%', 
        marginRight: '16px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    taskTitle: { 
        flex: 1, 
        fontSize: '1rem', 
        color: '#333', 
        fontWeight: '500' 
    },
    taskDate: { 
        fontSize: '0.9rem', 
        color: '#888', 
        marginRight: '20px' 
    },
    tag: { 
        padding: '6px 14px', 
        borderRadius: '12px', 
        fontSize: '0.75rem', 
        fontWeight: '600' 
    },
    moreText: { 
        textAlign: 'center', 
        marginTop: '20px', 
        color: '#007bff', 
        fontSize: '0.95rem', 
        cursor: 'pointer', 
        fontWeight: '600',
        transition: 'color 0.2s ease'
    },
    emptyText: { 
        textAlign: 'center', 
        color: '#999', 
        fontStyle: 'italic', 
        padding: '20px' 
    },

    chartsRow: { 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
        gap: '24px', 
        marginBottom: '32px' 
    },
    chartCard: { 
        ...cardStyle,
        padding: '28px',
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center' 
    },
    chartTitle: { 
        fontSize: '1.1rem', 
        color: '#333', 
        marginBottom: '16px', 
        fontWeight: '700' 
    },
    legend: { 
        marginTop: '16px', 
        textAlign: 'center' 
    },

    activityItem: { 
        display: 'flex', 
        alignItems: 'center', 
        gap: '16px', 
        padding: '16px 0', 
        borderBottom: '1px solid #f0f0f0' 
    },
    activityIcon: { 
        background: 'linear-gradient(135deg, rgba(0,123,255,0.1), rgba(111,66,193,0.1))',
        width: '48px', 
        height: '48px', 
        borderRadius: '50%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        fontSize: '1.3rem' 
    },
    activityContent: { 
        display: 'flex', 
        flexDirection: 'column' 
    },
    activityText: { 
        fontSize: '0.95rem', 
        color: '#333',
        fontWeight: '500'
    },
    activityTime: { 
        fontSize: '0.85rem', 
        color: '#999',
        marginTop: '4px'
    }
};

export default MySummary;