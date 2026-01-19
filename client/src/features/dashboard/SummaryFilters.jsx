import React, { useState, useRef, useEffect } from 'react';
import { buttonSecondary } from '../../components/ui/DesignSystem';
import { FaChevronDown } from 'react-icons/fa';

const TAG_OPTIONS = [
    "Work 💼", "Personal 🏠", "Shopping 🛒", "Health 💪", 
    "Finance 💰", "Study 📚", "Vacation 🏖️", "Family 👨‍👩‍👧‍👦", "Errands 🏃"
];

const SummaryFilters = ({ 
    statusFilter, setStatusFilter, 
    priorityFilter, setPriorityFilter,
    activeTags, toggleTag
}) => {
    
    const [isTagsDropdownOpen, setIsTagsDropdownOpen] = useState(false);
    const tagsDropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (tagsDropdownRef.current && !tagsDropdownRef.current.contains(event.target)) {
                setIsTagsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const getPriorityColor = (priority, isActive) => {
        if (!isActive) return '#f1f3f5';
        switch (priority) {
            case 'High': return '#ff4d4d'; 
            case 'Medium': return '#ffad33'; 
            case 'Low': return '#28a745'; 
            case 'all': return 'linear-gradient(135deg, #007bff, #6f42c1)'; 
            default: return '#6c757d';
        }
    };

    return (
        <div style={styles.container}>
            {/* Status Group */}
            <div style={styles.group}>
                <span style={styles.label}>Status:</span>
                <div style={styles.btnGroup}>
                    {['All', 'Active', 'Completed'].map(status => {
                        const val = status === 'All' ? 'All' : (status === 'Active' ? 'Pending' : 'Completed'); // Match MySummary logic
                        // Note: MySummary uses 'All', 'Pending', 'Completed' or similar.
                        // Let's check MySummary logic:
                        // if (filter === 'Completed' ...
                        // if (filter === 'Pending' ...
                        // default is 'All'

                        const isActive = statusFilter === val;
                        return (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(val)}
                                style={{
                                    ...styles.filterBtn,
                                    background: isActive ? 'linear-gradient(135deg, #007bff, #6f42c1)' : '#f1f3f5',
                                    color: isActive ? 'white' : '#555',
                                }}
                            >
                                {status}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div style={styles.divider}></div>

            {/* Priority Group */}
            <div style={styles.group}>
                <span style={styles.label}>Priority:</span>
                <div style={styles.btnGroup}>
                    {['All', 'High', 'Medium', 'Low'].map(p => {
                        const val = p === 'All' ? 'all' : p;
                        const isActive = priorityFilter === val;
                        return (
                            <button
                                key={p}
                                onClick={() => setPriorityFilter(val)}
                                style={{
                                    ...styles.filterBtn,
                                    background: getPriorityColor(val, isActive),
                                    color: isActive ? 'white' : '#555',
                                }}
                            >
                                {p}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div style={styles.divider}></div>

            {/* Tags Group (Dropdown) */}
            <div style={styles.group}>
                <span style={styles.label}>Tags:</span>
                <div style={{ position: 'relative', minWidth: '150px' }} ref={tagsDropdownRef}>
                    <button
                        onClick={() => setIsTagsDropdownOpen(!isTagsDropdownOpen)}
                        style={styles.multiSelectBtn}
                    >
                        {activeTags.length > 0
                            ? `${activeTags.length} Selected`
                            : 'Select Tags'}
                        <FaChevronDown size={12} color="#666" />
                    </button>

                    {isTagsDropdownOpen && (
                        <div style={styles.dropdownMenu}>
                            {TAG_OPTIONS.map(tag => {
                                const isActive = activeTags.includes(tag);
                                return (
                                    <div
                                        key={tag}
                                        onClick={() => toggleTag(tag)}
                                        style={{
                                            ...styles.dropdownItem,
                                            backgroundColor: isActive ? '#e3f2fd' : 'white',
                                            color: isActive ? '#1565c0' : '#333'
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={isActive}
                                            readOnly
                                            style={{ marginRight: '8px', cursor: 'pointer' }}
                                        />
                                        {tag}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: { 
        display: 'flex', 
        alignItems: 'center',
        gap: '20px',
        flexWrap: 'wrap',
        width: '100%'
    },
    group: {
        display: 'flex', 
        alignItems: 'center', 
        gap: '10px'
    },
    btnGroup: {
        display: 'flex',
        gap: '5px'
    },
    label: { 
        fontWeight: '700', 
        color: '#888', 
        fontSize: '0.75rem', 
        marginRight: '5px',
        minWidth: 'auto' 
    },
    filterBtn: { 
        ...buttonSecondary, 
        padding: '6px 12px',
        fontWeight: '500', 
        fontSize: '0.85rem',
        borderRadius: '6px'
    },
    divider: { 
        width: '1px', 
        height: '25px',
        backgroundColor: '#e0e0e0',
        margin: '0 5px'
    },
    multiSelectBtn: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        padding: '6px 12px',
        borderRadius: '6px',
        border: '1px solid #ddd',
        backgroundColor: 'white',
        cursor: 'pointer',
        fontSize: '0.85rem',
        color: '#555'
    },
    dropdownMenu: {
        position: 'absolute',
        top: '100%',
        left: 0,
        width: '100%',
        maxHeight: '200px',
        overflowY: 'auto',
        backgroundColor: 'white',
        border: '1px solid #ddd',
        borderRadius: '6px',
        marginTop: '4px',
        zIndex: 1000,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    },
    dropdownItem: {
        padding: '8px 12px',
        cursor: 'pointer',
        fontSize: '0.85rem',
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid #f0f0f0'
    }
};

export default SummaryFilters;