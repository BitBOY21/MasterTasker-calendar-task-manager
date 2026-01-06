import React, { useState } from 'react';
import { taskService } from '../../services/taskService';

// --- Fixed tag list ---
const TAG_OPTIONS = [
    "Work 💼",
    "Personal 🏠",
    "Shopping 🛒",
    "Health 💪",
    "Finance 💰",
    "Study 📚",
    "Urgent 🔥",
    "Family 👨‍👩‍👧‍👦",
    "Errands 🏃"
];

const TaskForm = ({ onAdd }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    
    // Core Fields
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [priority, setPriority] = useState('Medium');
    
    // Date & Time
    const [dateStr, setDateStr] = useState('');
    const [timeStr, setTimeStr] = useState('');
    const [endDateStr, setEndDateStr] = useState(''); 
    const [endTimeStr, setEndTimeStr] = useState('');
    const [showEndTime, setShowEndTime] = useState(false);
    const [location, setLocation] = useState('');
    
    // AI & Subtasks
    const [subtasks, setSubtasks] = useState([]); 
    const [loadingAI, setLoadingAI] = useState(false);
    const [manualStep, setManualStep] = useState('');
    
    // Tags
    const [tags, setTags] = useState([]);

    // --- Helpers ---
    const combineDateTime = (dResult, tResult) => {
        if (!dResult) return null;
        const timeToUse = tResult || '09:00'; 
        return new Date(`${dResult}T${timeToUse}`).toISOString();
    };

    const handleAddEndTime = () => {
        setShowEndTime(true);
        if (timeStr) {
            const [hours, minutes] = timeStr.split(':').map(Number);
            const newHours = (hours + 1) % 24;
            setEndTimeStr(`${newHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
        } else {
            setEndTimeStr('10:00');
        }
    };

    const handleRemoveEndTime = () => {
        setShowEndTime(false);
        setEndTimeStr('');
    };

    const handleSubtaskChange = (index, newText) => {
        const updated = [...subtasks];
        updated[index] = newText;
        setSubtasks(updated);
    };

    const removeSubtask = (index) => {
        setSubtasks(subtasks.filter((_, i) => i !== index));
    };

    const addManualStep = () => {
        if (!manualStep.trim()) return;
        setSubtasks([...subtasks, manualStep]);
        setManualStep('');
    };

    // --- New Tag Handler (Select) ---
    const handleSelectTag = (e) => {
        const selectedTag = e.target.value;
        if (selectedTag && !tags.includes(selectedTag)) {
            setTags([...tags, selectedTag]);
        }
        e.target.value = "";
    };

    const removeTag = (tag) => setTags(tags.filter(t => t !== tag));

    const handleAiBreakdown = async () => {
        if (!title.trim()) return;
        setLoadingAI(true);
        try {
            const steps = await taskService.getAiBreakdown(title);
            setSubtasks(prev => [...prev, ...steps]);
        } catch (error) { console.error(error); alert("AI Failed"); } 
        finally { setLoadingAI(false); }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        const finalStartDate = combineDateTime(dateStr, timeStr);
        const finalEndDate = showEndTime ? combineDateTime(dateStr, endTimeStr) : null; 

        if (finalEndDate && finalStartDate && finalEndDate < finalStartDate) {
            alert("End time cannot be before start time!"); return;
        }

        onAdd({
            title, description: desc, location, tags, priority,
            dueDate: finalStartDate, 
            endDate: finalEndDate,
            subtasks: subtasks.map(text => ({ text, isCompleted: false }))
        });

        // Reset
        setTitle(''); setDesc(''); setLocation(''); setTags([]);
        setDateStr(''); setTimeStr(''); setEndTimeStr(''); setShowEndTime(false);
        setPriority('Medium'); setSubtasks([]); setManualStep(''); setIsExpanded(false);
    };

    const getPriorityColor = (p) => {
        if (p === 'High') return '#ff4d4d';
        if (p === 'Medium') return '#ffad33';
        return '#28a745';
    };

    return (
        <div style={styles.container}>
            <form onSubmit={handleSubmit} style={{...styles.form, height: isExpanded ? 'auto' : '50px'}}>
                <div style={styles.mainInputRow}>
                    <span style={styles.icon}>✨</span>
                    <input type="text" placeholder="Add a new task..." value={title} onChange={(e) => setTitle(e.target.value)} onFocus={() => setIsExpanded(true)} style={styles.mainInput} />
                    <button type="submit" disabled={!title} style={{...styles.addButton, opacity: title ? 1 : 0.5}}>Add</button>
                </div>

                {isExpanded && (
                    <div style={styles.expandedSection}>
                        <input type="text" placeholder="Description (optional)" value={desc} onChange={(e) => setDesc(e.target.value)} style={styles.descInput} />

                        {/* --- Logistics Row (Updated Layout - No Emojis) --- */}
                        <div style={styles.infoRow}>
                            
                            {/* Separate date field */}
                            <div style={styles.inputWrapper}>
                                {/* Removed emoji 📅 */}
                                <input 
                                    type="date" 
                                    value={dateStr} 
                                    onChange={(e) => setDateStr(e.target.value)} 
                                    style={styles.transparentInput} 
                                />
                            </div>

                            {/* Separate time field */}
                            <div style={styles.inputWrapper}>
                                {/* Removed emoji ⏰ */}
                                <input 
                                    type="time" 
                                    value={timeStr} 
                                    onChange={(e) => setTimeStr(e.target.value)} 
                                    style={styles.transparentInput} 
                                />
                            </div>
                            
                            {/* End time (if selected) */}
                            {!showEndTime ? (
                                <button type="button" onClick={handleAddEndTime} style={styles.linkBtn}>+ End Time</button>
                            ) : (
                                <div style={styles.inputWrapper}>
                                    {/* Removed emoji 🏁 */}
                                    <input 
                                        type="time" 
                                        value={endTimeStr} 
                                        onChange={(e) => setEndTimeStr(e.target.value)} 
                                        style={styles.transparentInput} 
                                    />
                                    <button type="button" onClick={handleRemoveEndTime} style={styles.removeBtnSimple}>✕</button>
                                </div>
                            )}
                            
                            {/* Location field */}
                            <div style={{...styles.inputWrapper, flex: 1}}>
                                <span style={styles.inputIcon}>📍</span>
                                <input 
                                    type="text" 
                                    placeholder="Add location..." 
                                    value={location} 
                                    onChange={(e) => setLocation(e.target.value)} 
                                    style={{...styles.transparentInput, width: '100%'}} 
                                />
                            </div>
                        </div>

                        {/* Subtasks Section */}
                        <div style={styles.subtasksContainer}>
                            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                                <span style={styles.subtasksLabel}>📝 Steps:</span>
                            </div>

                            {subtasks.length > 0 && (
                                <div style={{marginBottom: '10px'}}>
                                    {subtasks.map((step, index) => (
                                        <div key={index} style={styles.subtaskItem}>
                                            <span style={styles.bulletPoint}>•</span>
                                            <input 
                                                type="text"
                                                value={step}
                                                onChange={(e) => handleSubtaskChange(index, e.target.value)}
                                                style={styles.editableSubtaskInput}
                                                placeholder="Step description..."
                                            />
                                            <button type="button" onClick={() => removeSubtask(index)} style={styles.removeBtn}>✕</button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div style={styles.addStepRow}>
                                <input 
                                    type="text"
                                    placeholder="+ Add next step (Press Enter)"
                                    value={manualStep}
                                    onChange={(e) => setManualStep(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addManualStep())}
                                    style={styles.manualStepInput}
                                />
                                <button type="button" onClick={addManualStep} disabled={!manualStep} style={styles.addStepBtn}>Add</button>
                            </div>
                        </div>

                        {/* --- Footer Bar --- */}
                        <div style={styles.footerBar}>
                            <div style={styles.leftControls}>
                                <div style={styles.footerGroup}>
                                    <span style={styles.label}>Priority:</span>
                                    <div style={styles.priorityOptions}>
                                        {['Low', 'Medium', 'High'].map(p => (
                                            <button key={p} type="button" onClick={() => setPriority(p)} 
                                                style={{
                                                    ...styles.priorityBtn, 
                                                    backgroundColor: priority === p ? getPriorityColor(p) : '#f1f3f5', 
                                                    color: priority === p ? 'white' : '#495057',
                                                    fontWeight: priority === p ? '600' : '400'
                                                }}>
                                                {p}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div style={styles.divider}></div>
                                <div style={styles.footerGroup}>
                                    <span style={styles.label}>Tags:</span>
                                    <div style={styles.activeTagsList}>
                                        {tags.map(tag => (
                                            <span key={tag} style={styles.miniTagBadge}>
                                                {tag}
                                                <button type="button" onClick={() => removeTag(tag)} style={styles.removeMiniTag}>×</button>
                                            </span>
                                        ))}
                                    </div>
                                    <select onChange={handleSelectTag} style={styles.tagSelect} defaultValue="">
                                        <option value="" disabled>+ Add Tag</option>
                                        {TAG_OPTIONS.map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <button type="button" onClick={handleAiBreakdown} disabled={loadingAI || !title} style={{...styles.aiButton, opacity: loadingAI ? 0.6 : 1}}>
                                {loadingAI ? 'Thinking...' : '✨ AI Plan'}
                            </button>
                        </div>
                    </div>
                )}
            </form>
            {isExpanded && <div style={styles.overlay} onClick={() => !title && setIsExpanded(false)} />}
        </div>
    );
};

const styles = {
    container: { position: 'relative', marginBottom: '30px', zIndex: 10 },
    form: { backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', padding: '15px 20px', overflow: 'hidden', border: '1px solid #f0f0f0', position: 'relative', zIndex: 20 },
    mainInputRow: { display: 'flex', alignItems: 'center', height: '30px' },
    icon: { fontSize: '1.2rem', marginRight: '10px' },
    mainInput: { flex: 1, border: 'none', fontSize: '1.1rem', outline: 'none', fontWeight: '500' },
    addButton: { backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '20px', padding: '6px 20px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem' },
    expandedSection: { marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #f1f3f5', animation: 'fadeIn 0.3s ease' },
    descInput: { width: '100%', border: 'none', borderBottom: '1px solid #eee', padding: '8px 0', marginBottom: '20px', outline: 'none', fontSize: '0.95rem', color: '#555' },
    
    // Info Row Layout
    infoRow: { display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' },
    
    // --- New Unified Input Wrapper ---
    // Uniform styling for date, time, and location boxes
    inputWrapper: { 
        display: 'flex', 
        alignItems: 'center', 
        gap: '6px', 
        backgroundColor: '#f8f9fa', 
        padding: '6px 10px', 
        borderRadius: '8px', 
        border: '1px solid #e9ecef',
        transition: 'all 0.2s'
    },
    transparentInput: { 
        border: 'none', 
        background: 'transparent', 
        fontSize: '0.9rem', 
        outline: 'none', 
        fontFamily: 'inherit', 
        color: '#444' 
    },
    inputIcon: { fontSize: '1rem', opacity: 0.8 },

    linkBtn: { background: 'none', border: 'none', color: '#007bff', fontSize: '0.85rem', cursor: 'pointer', fontWeight: '500', padding: '0 4px' },
    removeBtnSimple: { background: 'none', border: 'none', color: '#999', cursor: 'pointer', fontSize: '0.9rem' },
    
    // Subtasks
    subtasksContainer: { backgroundColor: '#fff', padding: '0', marginBottom: '20px' },
    subtasksLabel: { fontSize: '0.85rem', fontWeight: '700', color: '#444', textTransform: 'uppercase', letterSpacing: '0.5px' },
    subtaskItem: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', borderBottom: '1px solid #f0f0f0', paddingBottom: '4px' },
    editableSubtaskInput: { flex: 1, border: 'none', backgroundColor: 'transparent', fontSize: '0.95rem', padding: '4px', outline: 'none', color: '#333' },
    bulletPoint: { color: '#007bff', fontWeight: 'bold', fontSize: '1.2rem', lineHeight: '1rem' },
    removeBtn: { background: 'none', border: 'none', color: '#ccc', cursor: 'pointer', fontSize: '0.9rem', padding: '0 4px' },
    addStepRow: { display: 'flex', gap: '8px', marginTop: '10px' },
    manualStepInput: { flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid #eee', fontSize: '0.9rem', outline: 'none', backgroundColor: '#f9f9f9', transition: 'background 0.2s' },
    addStepBtn: { backgroundColor: '#f1f3f5', border: 'none', borderRadius: '6px', padding: '0 15px', color: '#495057', fontSize: '0.85rem', cursor: 'pointer', fontWeight: '600' },

    // Footer Styles
    footerBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', paddingTop: '15px', borderTop: '1px solid #f1f3f5' },
    leftControls: { display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' },
    footerGroup: { display: 'flex', alignItems: 'center', gap: '8px' },
    divider: { width: '1px', height: '20px', backgroundColor: '#e0e0e0' },
    label: { fontSize: '0.85rem', color: '#888', fontWeight: '600' },
    priorityOptions: { display: 'flex', gap: '4px' },
    priorityBtn: { border: 'none', borderRadius: '6px', padding: '4px 10px', fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s' },
    activeTagsList: { display: 'flex', gap: '5px' },
    miniTagBadge: { backgroundColor: '#e3f2fd', color: '#1565c0', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' },
    removeMiniTag: { background: 'none', border: 'none', color: '#1565c0', cursor: 'pointer', fontSize: '0.9rem', padding: 0, lineHeight: 0.8 },
    tagSelect: { border: '1px solid #eee', borderRadius: '6px', padding: '4px 8px', fontSize: '0.85rem', color: '#555', outline: 'none', cursor: 'pointer', backgroundColor: '#f9f9f9' },
    aiButton: { backgroundColor: '#6f42c1', color: 'white', border: 'none', borderRadius: '20px', padding: '6px 16px', fontSize: '0.85rem', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 2px 5px rgba(111, 66, 193, 0.2)' },
    overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 5 }
};

export default TaskForm;