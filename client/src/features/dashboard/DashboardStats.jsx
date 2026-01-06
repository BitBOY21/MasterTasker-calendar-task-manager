import React from 'react';
import { cardStyle, colors, gradientText, shadows } from '../../components/ui/DesignSystem';

const DashboardStats = ({ tasks, user }) => {
    // --- Greeting ---
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return { text: 'Good Morning', icon: '☀️' };
        if (hour < 18) return { text: 'Good Afternoon', icon: '🌤️' };
        return { text: 'Good Evening', icon: '🌙' };
    };
    const { text: greetingText, icon: greetingIcon } = getGreeting();
    const userName = user?.name || 'User';

    // --- Data ---
    const total = tasks.length;
    const completed = tasks.filter(t => t.isCompleted).length;
    const pending = total - completed;
    const highPriorityOpen = tasks.filter(t => t.priority === 'High' && !t.isCompleted).length;

    const upcomingTasks = tasks
        .filter(t => !t.isCompleted && t.dueDate)
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 3);

    const formatDateTime = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB') + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '8px', fontWeight: '800' }}>
                    <span className="text-gradient">
                        {greetingText}, {userName}!
                    </span>
                    <span> {greetingIcon}</span>
                </h1>
                <p style={styles.subtitle}>Here's what's happening today.</p>
            </div>

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

            {/* Next Up - only remains in HOME */}
            <div style={styles.section}>
                <h3 style={styles.sectionTitle}>📅 Next Up</h3>
                <div style={styles.listContainer}>
                    {upcomingTasks.length > 0 ? (
                        upcomingTasks.map(task => (
                            <div key={task._id} style={styles.taskRow}>
                                <div style={styles.timeBox}>{formatDateTime(task.dueDate)}</div>
                                <div style={styles.taskInfo}><span style={styles.taskTitle}>{task.title}</span></div>
                                <span style={{...styles.tag, backgroundColor: task.priority === 'High' ? '#ffebee' : '#e3f2fd', color: task.priority === 'High' ? '#c62828' : '#1565c0'}}>
                                    {task.priority}
                                </span>
                            </div>
                        ))
                    ) : <div style={styles.emptyState}>No upcoming tasks. You are free! 🎉</div>}
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
        background: '#f4f6f9',
        minHeight: '100vh'
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
    sectionTitle: { 
        fontSize: '1.3rem', 
        marginBottom: '20px', 
        color: '#333', 
        fontWeight: '700' 
    },
    listContainer: { 
        display: 'flex', 
        flexDirection: 'column' 
    },
    taskRow: { 
        display: 'flex', 
        alignItems: 'center', 
        padding: '16px 0', 
        borderBottom: '1px solid #f0f0f0',
        transition: 'background 0.2s ease'
    },
    timeBox: { 
        fontSize: '0.9rem', 
        color: '#666', 
        width: '160px', 
        fontWeight: '500' 
    },
    taskInfo: { 
        flex: 1 
    },
    taskTitle: { 
        fontSize: '1rem', 
        color: '#333', 
        fontWeight: '600' 
    },
    tag: { 
        padding: '6px 14px', 
        borderRadius: '12px', 
        fontSize: '0.75rem', 
        fontWeight: '600' 
    },
    emptyState: { 
        padding: '24px', 
        textAlign: 'center', 
        color: '#999', 
        fontStyle: 'italic', 
        fontSize: '0.95rem' 
    }
};

export default DashboardStats;