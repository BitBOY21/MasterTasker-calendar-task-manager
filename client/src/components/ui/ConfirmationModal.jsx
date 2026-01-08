import React from 'react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                {/* Header */}
                <div style={styles.header}>
                    <h3 style={styles.title}>{title || 'Delete Task'}</h3>
                </div>

                {/* Body - Only show if message is provided */}
                {message && (
                    <div style={styles.body}>
                        <p style={styles.text}>{message}</p>
                    </div>
                )}

                {/* Footer */}
                <div style={styles.footer}>
                    <button onClick={onClose} style={styles.cancelBtn}>Keep Task</button>
                    <button onClick={onConfirm} style={styles.confirmBtn}>Yes, Delete</button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark semi-transparent background
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(3px)' // Modern blur effect
    },
    modal: {
        backgroundColor: 'white',
        borderRadius: '12px',
        width: '90%',
        maxWidth: '400px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        padding: '24px', // Increased padding
        animation: 'fadeIn 0.2s ease-out',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px' // Gap between elements
    },
    header: {
        display: 'flex',
        justifyContent: 'center', // Center the title
        alignItems: 'center',
        marginBottom: '0' // Removed margin bottom as gap handles it
    },
    title: {
        margin: 0,
        fontSize: '1.25rem',
        color: '#333',
        fontWeight: '600',
        textAlign: 'center' // Ensure text is centered
    },
    body: {
        color: '#666',
        fontSize: '0.95rem',
        lineHeight: '1.5',
        textAlign: 'center' // Center body text as well if present
    },
    text: {
        margin: 0
    },
    footer: {
        display: 'flex',
        justifyContent: 'center', // Center buttons
        gap: '12px',
        marginTop: '10px'
    },
    cancelBtn: {
        padding: '10px 20px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        backgroundColor: 'white',
        cursor: 'pointer',
        fontWeight: '500',
        color: '#555',
        transition: 'background 0.2s',
        fontSize: '0.95rem',
        flex: 1 // Make buttons equal width
    },
    confirmBtn: {
        padding: '10px 20px',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: '#dc3545', // Red color for delete
        color: 'white',
        cursor: 'pointer',
        fontWeight: '600',
        boxShadow: '0 4px 10px rgba(220, 53, 69, 0.3)',
        fontSize: '0.95rem',
        flex: 1 // Make buttons equal width
    }
};

export default ConfirmationModal;