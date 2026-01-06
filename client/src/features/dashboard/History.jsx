import React, { useState } from 'react';
import { cardStyle, buttonPrimary, colors, gradientText, inputStyle } from '../../components/ui/DesignSystem';
import { FaSearch, FaUndo } from 'react-icons/fa';

const History = ({ tasks, onRestore }) => {
    const [searchQuery, setSearchQuery] = useState('');
    
    // Filter completed tasks
    const completedTasks = tasks
        .filter(task => task.isCompleted)
        .filter(task => 
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .sort((a, b) => {
            const dateA = new Date(a.updatedAt || a.createdAt);
            const dateB = new Date(b.updatedAt || b.createdAt);
            return dateB - dateA;
        });

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '8px', fontWeight: '800' }}>
                    <span className="text-gradient">History</span> 📜
                </h1>
                <p style={styles.subtitle}>View and restore completed tasks</p>
            </div>

            {/* Search Card */}
            <div style={{...cardStyle, marginBottom: '24px'}}>
                <div style={styles.searchContainer}>
                    <FaSearch style={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Search completed tasks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            ...inputStyle,
                            paddingLeft: '45px'
                        }}
                        onFocus={(e) => {
                            e.target.style.background = colors.white;
                            e.target.style.borderColor = colors.primary;
                            e.target.style.boxShadow = '0 0 0 3px rgba(0,123,255,0.1)';
                        }}
                        onBlur={(e) => {
                            e.target.style.background = colors.gray;
                            e.target.style.borderColor = 'transparent';
                            e.target.style.boxShadow = 'none';
                        }}
                    />
                </div>
            </div>

            {/* Tasks List Card */}
            <div style={cardStyle}>
                <h3 style={styles.listTitle}>
                    Completed Tasks ({completedTasks.length})
                </h3>
                
                {completedTasks.length > 0 ? (
                    <div style={styles.listContainer}>
                        {completedTasks.map(task => (
                            <div key={task._id} style={styles.taskRow}>
                                <div style={styles.taskContent}>
                                    <div style={styles.taskHeader}>
                                        <span style={styles.taskTitle}>{task.title}</span>
                                        <span style={styles.taskDate}>
                                            {formatDate(task.updatedAt || task.createdAt)}
                                        </span>
                                    </div>
                                    {task.description && (
                                        <p style={styles.taskDescription}>{task.description}</p>
                                    )}
                                    <div style={styles.taskMeta}>
                                        {task.priority && (
                                            <span style={{
                                                ...styles.tag,
                                                backgroundColor: task.priority === 'High' 
                                                    ? '#ffebee' 
                                                    : task.priority === 'Medium' 
                                                    ? '#fff3e0' 
                                                    : '#e8f5e9',
                                                color: task.priority === 'High' 
                                                    ? '#c62828' 
                                                    : task.priority === 'Medium' 
                                                    ? '#e65100' 
                                                    : '#2e7d32'
                                            }}>
                                                {task.priority}
                                            </span>
                                        )}
                                        {task.tags && task.tags.map(tag => (
                                            <span key={tag} style={styles.tag}>
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <button
                                    onClick={() => onRestore && onRestore(task._id)}
                                    style={styles.restoreBtn}
                                    onMouseEnter={(e) => {
                                        e.target.style.background = colors.primary;
                                        e.target.style.color = colors.white;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background = 'transparent';
                                        e.target.style.color = colors.primary;
                                    }}
                                >
                                    <FaUndo /> Restore
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={styles.emptyState}>
                        {searchQuery ? 'No tasks match your search.' : 'No completed tasks yet.'}
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '40px',
        maxWidth: '1000px',
        margin: '0 auto',
        background: colors.background,
        height: '100%', // Changed from minHeight: 100vh to allow scrolling within parent
        overflowY: 'auto',
        paddingBottom: '80px' // Added padding at bottom
    },
    header: {
        marginBottom: '40px',
        textAlign: 'center'
    },
    subtitle: {
        color: colors.textSecondary,
        fontSize: '1.1rem',
        fontWeight: '400'
    },
    searchContainer: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center'
    },
    searchIcon: {
        position: 'absolute',
        left: '18px',
        color: colors.textMuted,
        fontSize: '1rem'
    },
    listTitle: {
        fontSize: '1.3rem',
        color: colors.textPrimary,
        fontWeight: '700',
        marginBottom: '24px',
        borderBottom: '2px solid #f0f0f0',
        paddingBottom: '12px'
    },
    listContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
    },
    taskRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: '20px',
        background: colors.gray,
        borderRadius: '12px',
        border: '1px solid #e0e0e0',
        transition: 'all 0.2s ease',
        gap: '16px'
    },
    taskContent: {
        flex: 1,
        minWidth: 0
    },
    taskHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px',
        flexWrap: 'wrap',
        gap: '8px'
    },
    taskTitle: {
        fontSize: '1.1rem',
        fontWeight: '600',
        color: colors.textPrimary,
        textDecoration: 'line-through',
        opacity: 0.7,
        wordBreak: 'break-word'
    },
    taskDate: {
        fontSize: '0.85rem',
        color: colors.textMuted,
        fontWeight: '500',
        whiteSpace: 'nowrap'
    },
    taskDescription: {
        fontSize: '0.95rem',
        color: colors.textSecondary,
        marginBottom: '12px',
        lineHeight: '1.5',
        wordBreak: 'break-word'
    },
    taskMeta: {
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap'
    },
    tag: {
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '0.75rem',
        fontWeight: '600',
        backgroundColor: '#e3f2fd',
        color: '#1565c0'
    },
    restoreBtn: {
        background: 'transparent',
        border: `2px solid ${colors.primary}`,
        color: colors.primary,
        borderRadius: '50px',
        padding: '10px 20px',
        fontSize: '0.9rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flexShrink: 0
    },
    emptyState: {
        textAlign: 'center',
        padding: '60px 20px',
        color: colors.textMuted,
        fontSize: '1rem',
        fontStyle: 'italic'
    }
};

export default History;
