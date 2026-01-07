import React from 'react';
import { FaTimes } from 'react-icons/fa';

const TAG_OPTIONS = [
    "Work 💼", "Personal 🏠", "Shopping 🛒", "Health 💪", 
    "Finance 💰", "Study 📚", "Urgent 🔥", "Family 👨‍👩‍👧‍👦", "Errands 🏃"
];

const SidebarFilters = ({ 
    filters, 
    setFilters, 
    selectedDate, 
    onClearDate 
}) => {
    
    const updateFilter = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const toggleTag = (tag) => {
        const currentTags = filters.tags;
        const newTags = currentTags.includes(tag) 
            ? currentTags.filter(t => t !== tag) 
            : [...currentTags, tag];
        updateFilter('tags', newTags);
    };

    return (
        <div style={styles.container}>
            
            <div style={styles.header}>
                <h3 style={styles.title}>Filters</h3>
                <button 
                    onClick={() => setFilters({ status: 'all', priority: 'all', tags: [] })}
                    style={styles.resetLink}
                >
                    Reset
                </button>
            </div>

            {selectedDate && (
                <div style={styles.activeDateCard}>
                    <span style={{fontSize: '0.9rem'}}>📅 Date: <b>{new Date(selectedDate).toLocaleDateString()}</b></span>
                    <button onClick={onClearDate} style={styles.clearDateBtn}><FaTimes /></button>
                </div>
            )}

            <div style={styles.section}>
                <label style={styles.label}>Status</label>
                <div style={styles.pillsRow}>
                    {['All', 'Active', 'Completed'].map(status => {
                        const val = status.toLowerCase();
                        const isActive = filters.status === val;
                        return (
                            <button
                                key={status}
                                onClick={() => updateFilter('status', val)}
                                style={{
                                    ...styles.pillBtn,
                                    backgroundColor: isActive ? '#007bff' : '#f1f3f5',
                                    color: isActive ? 'white' : '#555',
                                    fontWeight: isActive ? '600' : '400'
                                }}
                            >
                                {status}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div style={styles.section}>
                <label style={styles.label}>Priority</label>
                <div style={styles.pillsRow}>
                    {['All', 'High', 'Medium', 'Low'].map(p => {
                        const val = p === 'All' ? 'all' : p;
                        const isActive = filters.priority === val;
                        return (
                            <button
                                key={p}
                                onClick={() => updateFilter('priority', val)}
                                style={{
                                    ...styles.pillBtn,
                                    backgroundColor: isActive ? '#6c757d' : '#f1f3f5',
                                    color: isActive ? 'white' : '#555',
                                    fontWeight: isActive ? '600' : '400'
                                }}
                            >
                                {p}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div style={styles.section}>
                <label style={styles.label}>Tags</label>
                <div style={styles.tagsContainer}>
                    {TAG_OPTIONS.map(tag => {
                        const isActive = filters.tags.includes(tag);
                        return (
                            <button
                                key={tag}
                                onClick={() => toggleTag(tag)}
                                style={{
                                    ...styles.tagBtn,
                                    backgroundColor: isActive ? '#e3f2fd' : 'transparent',
                                    color: isActive ? '#1565c0' : '#555',
                                    borderColor: isActive ? '#1565c0' : '#eee',
                                }}
                            >
                                {tag}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

const styles = {
    // Removed card styles (background, shadow, border)
    container: { 
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
    },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' },
    title: { margin: 0, fontSize: '0.9rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' },
    resetLink: { background: 'none', border: 'none', color: '#007bff', fontSize: '0.85rem', cursor: 'pointer' },
    
    activeDateCard: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#e3f2fd', padding: '8px 12px', borderRadius: '8px', marginBottom: '10px', color: '#1565c0' },
    clearDateBtn: { background: 'none', border: 'none', color: '#1565c0', cursor: 'pointer', display: 'flex', alignItems: 'center' },

    section: { marginBottom: '10px' },
    label: { display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#555', marginBottom: '6px' },
    
    pillsRow: { display: 'flex', flexWrap: 'wrap', gap: '6px' },
    pillBtn: { border: 'none', padding: '5px 12px', borderRadius: '15px', cursor: 'pointer', fontSize: '0.8rem', transition: 'all 0.2s' },

    tagsContainer: { display: 'flex', flexWrap: 'wrap', gap: '5px' },
    tagBtn: { border: '1px solid', padding: '3px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', backgroundColor: 'transparent' }
};

export default SidebarFilters;