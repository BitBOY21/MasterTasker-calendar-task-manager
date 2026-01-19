import React, { useState, useEffect } from 'react';
import { FaCheck, FaClock, FaMapMarkerAlt, FaEdit, FaTrash, FaCalendarAlt } from 'react-icons/fa';

const TaskItem = ({ task, onDelete, onUpdate, onEdit }) => {
    const [localSubtasks, setLocalSubtasks] = useState(task.subtasks || []);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isHoveringCheck, setIsHoveringCheck] = useState(false);
    
    const [editTitle, setEditTitle] = useState(task.title);
    const [editDesc, setEditDesc] = useState(task.description || '');
    const [editSubtasks, setEditSubtasks] = useState(task.subtasks || []);
    const [editLocation, setEditLocation] = useState(task.location || ''); 
    const [editPriority, setEditPriority] = useState(task.priority || 'Medium');
    const [editTags, setEditTags] = useState(task.tags || []);
    
    const [editDate, setEditDate] = useState('');
    const [editTime, setEditTime] = useState('');
    const [editEndTime, setEditEndTime] = useState('');

    useEffect(() => {
        setLocalSubtasks(task.subtasks || []);
        setEditTitle(task.title);
        setEditDesc(task.description || '');
        setEditSubtasks(task.subtasks || []);
        setEditLocation(task.location || '');
        setEditPriority(task.priority || 'Medium');
        setEditTags(task.tags || []);

        if (task.dueDate) {
            const d = new Date(task.dueDate);
            setEditDate(d.toISOString().slice(0, 10)); 
            setEditTime(d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })); 
        } else {
            setEditDate('');
            setEditTime('');
        }

        if (task.endDate) {
            const endD = new Date(task.endDate);
            setEditEndTime(endD.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
        } else {
            setEditEndTime('');
        }
    }, [task]);

    const handleSave = () => {
        let finalDueDate = null;
        let finalEndDate = null;

        if (editDate) {
            finalDueDate = new Date(`${editDate}T${editTime || '09:00'}`);
            if (editEndTime) {
                finalEndDate = new Date(`${editDate}T${editEndTime}`);
            }
        }

        onUpdate(task._id, {
            title: editTitle,
            description: editDesc,
            subtasks: editSubtasks,
            location: editLocation,
            priority: editPriority,
            tags: editTags,
            dueDate: finalDueDate,
            endDate: finalEndDate
        });
        setIsEditing(false);
    };

    const handleQuickComplete = async (e) => {
        e.stopPropagation();
        const newCompletedState = !task.isCompleted;
        await onUpdate(task._id, { isCompleted: newCompletedState });
    };

    const handleSubtaskTextChange = (index, text) => {
        const updated = [...editSubtasks];
        updated[index].text = text;
        setEditSubtasks(updated);
    };
    const handleDeleteSubtask = (index) => {
        setEditSubtasks(editSubtasks.filter((_, i) => i !== index));
    };
    const handleAddSubtask = () => {
        setEditSubtasks([...editSubtasks, { text: '', isCompleted: false }]);
    };
    const toggleSubtask = (index) => {
        const newSubtasks = [...localSubtasks];
        newSubtasks[index].isCompleted = !newSubtasks[index].isCompleted;
        setLocalSubtasks(newSubtasks);
        onUpdate(task._id, { subtasks: newSubtasks });
    };

    const getPriorityColor = (p) => {
        if (p === 'High') return '#ff4d4d';
        if (p === 'Medium') return '#ffad33';
        if (p === 'Low') return '#28a745';
        return '#6c757d';
    };
    
    const getPriorityTextColor = (p) => 'white';

    const totalCount = localSubtasks.length;

    if (isEditing) {
        return (
            <div style={styles.editContainer}>
                <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} style={styles.editInputTitle} placeholder="Task Title" autoFocus />
                
                <div style={styles.editRow}>
                    <input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)} style={styles.editInput} />
                    <input type="time" value={editTime} onChange={(e) => setEditTime(e.target.value)} style={styles.editInput} />
                    <span>-</span>
                    <input type="time" value={editEndTime} onChange={(e) => setEditEndTime(e.target.value)} style={styles.editInput} />
                </div>

                <div style={styles.editRow}>
                    <select value={editPriority} onChange={(e) => setEditPriority(e.target.value)} style={styles.editSelect}>
                        <option value="Low">Low</option><option value="Medium">Medium</option><option value="High">High</option>
                    </select>
                    <input type="text" value={editLocation} onChange={(e) => setEditLocation(e.target.value)} placeholder="📍 Location" style={{...styles.editInput, flex: 1}} />
                </div>

                <textarea value={editDesc} onChange={(e) => setEditDesc(e.target.value)} placeholder="Description..." rows="2" style={styles.editTextarea} />

                <div style={styles.subtasksEditBox}>
                    {editSubtasks.map((subtask, i) => (
                        <div key={i} style={{display: 'flex', gap: '5px', marginBottom: '5px'}}>
                            <input type="text" value={subtask.text} onChange={(e) => handleSubtaskTextChange(i, e.target.value)} style={styles.editSubtaskInput} />
                            <button onClick={() => handleDeleteSubtask(i)} style={styles.iconBtn}>🗑️</button>
                        </div>
                    ))}
                    <button onClick={handleAddSubtask} style={styles.addStepBtn}>+ Add Step</button>
                </div>

                <div style={styles.editActions}>
                    <button onClick={handleSave} style={styles.saveBtn}>Save</button>
                    <button onClick={() => setIsEditing(false)} style={styles.cancelBtn}>Cancel</button>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.taskRow} className="task-row-hover" onClick={() => setIsExpanded(!isExpanded)}>
            <div 
                onClick={handleQuickComplete}
                onMouseEnter={() => setIsHoveringCheck(true)}
                onMouseLeave={() => setIsHoveringCheck(false)}
                style={{
                    ...styles.checkCircle,
                    borderColor: task.isCompleted ? '#28a745' : (isHoveringCheck ? '#28a745' : '#ddd'),
                    backgroundColor: task.isCompleted ? '#28a745' : 'transparent',
                }}
                title={task.isCompleted ? "Mark as Incomplete" : "Mark as Done"}
            >
                <FaCheck style={{
                    ...styles.checkIcon, 
                    color: task.isCompleted ? 'white' : (isHoveringCheck ? '#28a745' : 'transparent')
                }} />
            </div>

            <div style={styles.centerContent}>
                <span style={{
                    ...styles.taskTitle,
                    textDecoration: task.isCompleted ? 'line-through' : 'none',
                    color: task.isCompleted ? '#999' : '#333'
                }}>
                    {task.title}
                </span>
                
                <div style={styles.metaRow}>
                    <span style={{
                        ...styles.priorityPill,
                        backgroundColor: getPriorityColor(task.priority),
                        color: getPriorityTextColor(task.priority),
                    }}>
                        {task.priority}
                    </span>

                    {task.dueDate && (
                        <span style={styles.metaItem}>
                            <FaCalendarAlt style={{fontSize: '0.7rem'}} />
                            {new Date(task.dueDate).toLocaleDateString('en-GB', {day: '2-digit', month: '2-digit'})}
                        </span>
                    )}
                    
                    {task.dueDate && (
                        <span style={styles.metaItem}>
                            <FaClock style={{fontSize: '0.7rem'}} />
                            {new Date(task.dueDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                    )}

                    {task.location && (
                        <span style={styles.metaItem}>
                            <FaMapMarkerAlt style={{fontSize: '0.7rem'}} />
                            {task.location}
                        </span>
                    )}
                </div>
            </div>

            <div style={styles.rightActions}>
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        if (onEdit) {
                            onEdit(task);
                        } else {
                            setIsEditing(true);
                        }
                    }} 
                    style={styles.actionIconBtn} 
                    title="Edit"
                >
                    <FaEdit />
                </button>
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        const idToSend = typeof task._id === 'object' ? task._id.toString() : task._id;
                        onDelete(idToSend); 
                    }} 
                    style={styles.actionIconBtn} 
                    title="Delete"
                >
                    <FaTrash />
                </button>
            </div>

            {isExpanded && (
                <div style={styles.expandedDetails} onClick={(e) => e.stopPropagation()}>
                    {task.description && (
                        <div style={{ marginBottom: '12px' }}>
                            <div style={styles.sectionHeader}>Details:</div>
                            <div style={{...styles.descText, whiteSpace: 'pre-wrap'}}>{task.description}</div>
                        </div>
                    )}
                    
                    {task.tags && task.tags.length > 0 && (
                        <div style={styles.tagsRow}>
                            {task.tags.map(tag => <span key={tag} style={styles.tagPill}>{tag}</span>)}
                        </div>
                    )}

                    {totalCount > 0 && (
                        <div style={styles.subtasksList}>
                            <div style={styles.sectionHeader}>Subtasks:</div>
                            {localSubtasks.map((subtask, i) => (
                                <div key={i} style={styles.subtaskRow} onClick={() => toggleSubtask(i)}>
                                    <div style={{
                                        ...styles.miniCheck,
                                        backgroundColor: subtask.isCompleted ? '#28a745' : 'transparent',
                                        borderColor: subtask.isCompleted ? '#28a745' : '#ccc'
                                    }}>
                                        {subtask.isCompleted && <FaCheck style={{fontSize: '8px', color: 'white'}} />}
                                    </div>
                                    <span style={{
                                        textDecoration: subtask.isCompleted ? 'line-through' : 'none',
                                        color: subtask.isCompleted ? '#999' : '#333',
                                        fontSize: '0.9rem'
                                    }}>
                                        {subtask.text}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const styles = {
    taskRow: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        padding: '4px ',
        borderBottom: '1px solid #f0f0f0',
        backgroundColor: 'white',
        transition: 'background-color 0.2s ease',
        position: 'relative',
        cursor: 'pointer',
        gap: '6px'
    },
    checkCircle: {
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        border: '2px solid #ddd',
        marginTop: '2px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s',
        flexShrink: 0,
    },
    checkIcon: { fontSize: '10px' },
    centerContent: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        minWidth: 0
    },
    taskTitle: {
        fontSize: '1rem',
        fontWeight: '500',
        color: '#333',
        lineHeight: '1.4'
    },
    metaRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '0.75rem',
        color: '#666',
        flexWrap: 'wrap'
    },
    priorityPill: {
        padding: '1px 6px',
        borderRadius: '4px',
        fontSize: '0.65rem',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    },
    metaItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '2px'
    },
    rightActions: {
        display: 'flex',
        alignItems: 'center',
        gap: '2px',
        opacity: 0.6,
        transition: 'opacity 0.2s'
    },
    actionIconBtn: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: '#999',
        fontSize: '0.9rem',
        padding: '6px',
        borderRadius: '4px',
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    expandedDetails: {
        width: '100%',
        marginTop: '0px',
        paddingLeft: '32px',
        animation: 'fadeIn 0.2s ease',
        cursor: 'default'
    },
    sectionHeader: {
        fontSize: '0.85rem',
        fontWeight: 'bold',
        color: '#555',
        marginBottom: '4px',
        marginTop: '10px'
    },
    descText: { 
        fontSize: '0.9rem', 
        color: '#555', 
        marginBottom: '10px', 
        lineHeight: '1.5' 
    },
    tagsRow: { 
        display: 'flex', 
        gap: '6px', 
        marginBottom: '10px', 
        flexWrap: 'wrap' 
    },
    tagPill: { 
        backgroundColor: '#e9ecef', 
        color: '#495057', 
        fontSize: '0.75rem', 
        padding: '2px 8px', 
        borderRadius: '12px' 
    },
    subtasksList: { 
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        marginTop: '10px' 
    },
    subtaskRow: { 
        display: 'flex', 
        alignItems: 'center', 
        gap: '6px',
        marginBottom: '6px', 
        cursor: 'pointer', 
        padding: '0px 0'
    },
    miniCheck: { 
        width: '16px', 
        height: '16px', 
        borderRadius: '4px',
        border: '1px solid #ccc', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
    },
    editContainer: { 
        padding: '15px',
        border: '1px solid #007bff',
        borderRadius: '8px', 
        backgroundColor: '#fff', 
        marginBottom: '10px' 
    },
    editInputTitle: { 
        width: '100%', 
        fontSize: '1rem', 
        fontWeight: 'bold', 
        padding: '8px', 
        marginBottom: '10px', 
        border: '1px solid #eee', 
        borderRadius: '4px' 
    },
    editRow: { 
        display: 'flex', 
        gap: '10px', 
        marginBottom: '10px', 
        alignItems: 'center' 
    },
    editInput: { 
        padding: '6px', 
        border: '1px solid #ddd', 
        borderRadius: '4px', 
        fontSize: '0.9rem' 
    },
    editSelect: { 
        padding: '6px', 
        border: '1px solid #ddd', 
        borderRadius: '4px', 
        fontSize: '0.9rem' 
    },
    editTextarea: { 
        width: '100%', 
        padding: '8px', 
        border: '1px solid #ddd', 
        borderRadius: '4px', 
        fontSize: '0.9rem', 
        marginBottom: '10px', 
        resize: 'vertical'
    },
    subtasksEditBox: { 
        backgroundColor: '#f9f9f9', 
        padding: '10px', 
        borderRadius: '6px', 
        marginBottom: '10px' 
    },
    editSubtaskInput: { 
        flex: 1, 
        padding: '5px', 
        border: '1px solid #ddd', 
        borderRadius: '4px' 
    },
    iconBtn: { 
        background: 'none', 
        border: 'none', 
        cursor: 'pointer' 
    },
    addStepBtn: { 
        background: 'none', 
        border: '1px dashed #007bff',
        color: '#007bff', 
        padding: '5px 10px', 
        borderRadius: '4px', 
        cursor: 'pointer', 
        fontSize: '0.85rem', 
        width: '100%' 
    },
    editActions: { 
        display: 'flex', 
        gap: '10px', 
        justifyContent: 'flex-end'
    },
    saveBtn: { 
        backgroundColor: '#007bff', 
        color: 'white', 
        border: 'none', 
        padding: '6px 15px', 
        borderRadius: '4px', 
        cursor: 'pointer' 
    },
    cancelBtn: { 
        backgroundColor: '#eee', 
        color: '#333', 
        border: 'none', 
        padding: '6px 15px', 
        borderRadius: '4px', 
        cursor: 'pointer' 
    }
};

export default TaskItem;