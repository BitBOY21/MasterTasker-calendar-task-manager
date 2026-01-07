import React, { useState, useRef, useEffect } from 'react';
import { buttonSecondary } from '../../components/ui/DesignSystem';
import { FaChevronDown, FaSearch } from 'react-icons/fa';

const TAG_OPTIONS = [
    "Work 💼", "Personal 🏠", "Shopping 🛒", "Health 💪", 
    "Finance 💰", "Study 📚", "Urgent 🔥", "Family 👨‍👩‍👧‍👦", "Errands 🏃"
];

const NewSummaryFilters = ({ 
    statusFilter, setStatusFilter, 
    priorityFilter, setPriorityFilter,
    activeTags, toggleTag,
    searchTerm, setSearchTerm,
    dateFilter, setDateFilter,
    customStartDate, setCustomStartDate,
    customEndDate, setCustomEndDate,
    onReset
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
            
            {/* Row 1: Search & Reset */}
            <div style={styles.topRow}>
                <div style={styles.searchBox}>
                    <FaSearch color="#999" />
                    <input 
                        type="text" 
                        placeholder="Search tasks..." 
                        value={searchTerm || ''}
                        onChange={(e) => setSearchTerm && setSearchTerm(e.target.value)}
                        style={styles.searchInput}
                    />
                </div>
                
                <button onClick={onReset} style={styles.resetBtn}>
                    Reset All
                </button>
            </div>

            {/* Row 2: Filters */}
            <div style={styles.bottomRow}>
                
                {/* Days Group */}
                <div style={styles.group}>
                    <span style={styles.label}>Days:</span>
                    <div style={styles.btnGroup}>
                        {['Today', 'Week', 'Month', 'Custom'].map(d => {
                            const val = d.toLowerCase();
                            const isActive = dateFilter === val;
                            return (
                                <button
                                    key={d}
                                    onClick={() => setDateFilter && setDateFilter(val)}
                                    style={{
                                        ...styles.filterBtn,
                                        background: isActive ? 'linear-gradient(135deg, #28a745, #20c997)' : '#f1f3f5',
                                        color: isActive ? 'white' : '#555',
                                    }}
                                >
                                    {d}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div style={styles.divider}></div>

                {/* Status Group */}
                <div style={styles.group}>
                    <span style={styles.label}>Status:</span>
                    <div style={styles.btnGroup}>
                        {['All', 'Active', 'Completed'].map(status => {
                            const val = status === 'All' ? 'All' : (status === 'Active' ? 'Pending' : 'Completed');
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
                    <div style={{ position: 'relative', minWidth: '140px' }} ref={tagsDropdownRef}>
                        <button 
                            onClick={() => setIsTagsDropdownOpen(!isTagsDropdownOpen)}
                            style={styles.multiSelectBtn}
                        >
                            {activeTags && activeTags.length > 0 
                                ? `${activeTags.length} Selected` 
                                : 'Select Tags'}
                            <FaChevronDown size={12} color="#666" />
                        </button>
                        
                        {isTagsDropdownOpen && (
                            <div style={styles.dropdownMenu}>
                                {TAG_OPTIONS.map(tag => {
                                    const isActive = activeTags && activeTags.includes(tag);
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

            {/* Custom Date Inputs (Conditional) */}
            {dateFilter === 'custom' && (
                <div style={styles.customDateRow}>
                     <div style={styles.dateInputGroup}>
                        <span style={styles.dateLabel}>From:</span>
                        <input 
                            type="date" 
                            value={customStartDate || ''}
                            onChange={(e) => setCustomStartDate && setCustomStartDate(e.target.value)}
                            style={styles.dateInput}
                        />
                     </div>
                     <div style={styles.dateInputGroup}>
                        <span style={styles.dateLabel}>To:</span>
                        <input 
                            type="date" 
                            value={customEndDate || ''}
                            onChange={(e) => setCustomEndDate && setCustomEndDate(e.target.value)}
                            style={styles.dateInput}
                        />
                     </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: { 
        display: 'flex', 
        flexDirection: 'column',
        gap: '15px', 
        width: '100%'
    },
    topRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
    },
    bottomRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        flexWrap: 'wrap',
        width: '100%'
    },
    
    searchBox: { 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px', 
        backgroundColor: '#f8f9fa', 
        padding: '8px 12px', 
        borderRadius: '8px', 
        border: '1px solid #eee', 
        width: '300px' 
    },
    searchInput: { 
        border: 'none', 
        background: 'transparent', 
        outline: 'none', 
        fontSize: '0.9rem', 
        width: '100%', 
        color: '#333' 
    },
    
    resetBtn: { 
        background: '#f8f9fa', 
        border: '1px solid #ddd', 
        color: '#333', 
        fontSize: '0.8rem', 
        fontWeight: '600', 
        cursor: 'pointer', 
        padding: '6px 12px', 
        borderRadius: '6px',
        transition: 'all 0.2s'
    },

    group: { 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px' 
    },
    btnGroup: {
        display: 'flex',
        gap: '4px'
    },
    label: { 
        fontWeight: '700', 
        color: '#888', 
        fontSize: '0.75rem', 
        marginRight: '4px', 
        minWidth: 'auto' 
    },
    filterBtn: { 
        ...buttonSecondary, 
        padding: '5px 10px', 
        fontWeight: '500', 
        fontSize: '0.8rem',
        borderRadius: '6px'
    },
    divider: { 
        width: '1px', 
        height: '20px', 
        backgroundColor: '#e0e0e0',
        margin: '0 5px'
    },
    
    multiSelectBtn: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        padding: '5px 10px',
        borderRadius: '6px',
        border: '1px solid #ddd',
        backgroundColor: 'white',
        cursor: 'pointer',
        fontSize: '0.8rem',
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
    },

    customDateRow: { display: 'flex', gap: '15px', alignItems: 'center', marginTop: '-5px', paddingLeft: '5px' },
    dateInputGroup: { display: 'flex', alignItems: 'center', gap: '8px' },
    dateLabel: { fontSize: '0.8rem', color: '#666', fontWeight: '600' },
    dateInput: { padding: '4px 8px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '0.85rem', color: '#555', outline: 'none' },
};

export default NewSummaryFilters;