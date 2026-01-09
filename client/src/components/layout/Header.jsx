import React from 'react';

const Header = ({ user, onLogout }) => {
    return (
        <header style={styles.header}>
            <h1 style={styles.logo}>Smart Tasker 🚀</h1>

            {user && (
                <div style={styles.userSection}>
                    <span style={styles.welcome}>Hello, User 👋</span>
                    <button onClick={onLogout} style={styles.logoutBtn}>
                        Logout
                    </button>
                </div>
            )}
        </header>
    );
};

const styles = {
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        maxWidth: '1200px',
        margin: '0 auto 30px auto',
        padding: '10px 0'
    },
    logo: {
        margin: 0,
        color: '#333',
        fontSize: '1.8rem'
    },
    userSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px'
    },
    welcome: {
        fontSize: '1rem',
        color: '#555',
        fontWeight: '500'
    },
    logoutBtn: {
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        padding: '8px 15px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: 'background 0.2s'
    }
};

export default Header;