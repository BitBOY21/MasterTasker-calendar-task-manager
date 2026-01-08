import React, { useState } from 'react';

const DeleteRecurringModal = ({ isOpen, onClose, onConfirm }) => {
    const [deletePolicy, setDeletePolicy] = useState('single'); // 'single' = This task, 'series' = All tasks

    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm(deletePolicy);
        onClose();
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <h3 style={styles.title}>Delete recurring event</h3>
                
                <div style={styles.content}>
                    <label style={styles.option}>
                        <input 
                            type="radio" 
                            name="deletePolicy" 
                            value="single" 
                            checked={deletePolicy === 'single'}
                            onChange={() => setDeletePolicy('single')}
                            style={styles.radio}
                        />
                        <span>This task</span>
                    </label>
                    
                    <label style={styles.option}>
                        <input 
                            type="radio" 
                            name="deletePolicy" 
                            value="series" 
                            checked={deletePolicy === 'series'}
                            onChange={() => setDeletePolicy('series')}
                            style={styles.radio}
                        />
                        <span>All tasks</span>
                    </label>
                </div>

                <div style={styles.actions}>
                    <button onClick={onClose} style={styles.cancelBtn}>Cancel</button>
                    <button onClick={handleConfirm} style={styles.okBtn}>OK</button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2000,
        backdropFilter: 'blur(2px)'
    },
    modal: {
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '8px',
        width: '300px',
        boxShadow: '0 4px 25px rgba(0,0,0,0.15)',
        fontFamily: 'inherit'
    },
    title: {
        margin: '0 0 20px 0',
        fontSize: '1.1rem',
        fontWeight: '600',
        color: '#333'
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        marginBottom: '25px'
    },
    option: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        cursor: 'pointer',
        fontSize: '0.95rem',
        color: '#3c4043'
    },
    radio: {
        accentColor: '#1a73e8',
        width: '18px',
        height: '18px',
        cursor: 'pointer'
    },
    actions: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '10px'
    },
    cancelBtn: {
        background: 'none',
        border: 'none',
        color: '#5f6368',
        padding: '8px 16px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: '500',
        fontSize: '0.9rem'
    },
    okBtn: {
        background: 'none',
        border: 'none',
        color: '#1a73e8',
        padding: '8px 16px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '0.9rem'
    }
};

export default DeleteRecurringModal;