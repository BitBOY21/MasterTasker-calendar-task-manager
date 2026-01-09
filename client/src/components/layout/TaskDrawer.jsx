import React from 'react';
import TaskItem from '../../features/tasks/components/TaskItem';

const TaskDrawer = ({ isOpen, onClose, task, onUpdate, onDelete }) => {
    return (
        <>
            <div 
                style={{
                    ...styles.overlay,
                    opacity: isOpen ? 1 : 0,
                    pointerEvents: isOpen ? 'auto' : 'none'
                }} 
                onClick={onClose}
            />

            <div style={{
                ...styles.drawer,
                transform: isOpen ? 'translateX(0)' : 'translateX(100%)'
            }}>
                <div style={styles.header}>
                    <h3>Edit Task</h3>
                    <button onClick={onClose} style={styles.closeBtn}>✕</button>
                </div>

                <div style={styles.content}>
                    {task ? (
                        <TaskItem 
                            task={task} 
                            onUpdate={onUpdate} 
                            onDelete={() => { onDelete(task); onClose(); }}
                        />
                    ) : (
                        <p style={{padding: '20px', color: '#999'}}>No task selected</p>
                    )}
                </div>
            </div>
        </>
    );
};

const styles = {
    overlay: {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        zIndex: 998,
        transition: 'opacity 0.3s ease'
    },
    drawer: {
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: '500px',
        maxWidth: '90%',
        backgroundColor: 'white',
        boxShadow: '-5px 0 30px rgba(0,0,0,0.1)',
        zIndex: 999,
        transition: 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
        display: 'flex', flexDirection: 'column'
    },
    header: {
        padding: '20px',
        borderBottom: '1px solid #eee',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
    },
    closeBtn: {
        background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#666'
    },
    content: {
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
        backgroundColor: '#f9f9f9'
    }
};

export default TaskDrawer;