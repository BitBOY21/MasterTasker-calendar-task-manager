import React, { useState } from 'react';
import { cardStyle, buttonPrimary, gradients, colors, gradientText } from '../../components/ui/DesignSystem';

const Settings = ({ user }) => {
    const [darkMode, setDarkMode] = useState(false);

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '8px', fontWeight: '800' }}>
                    <span className="text-gradient">Settings</span> ⚙️
                </h1>
                <p style={styles.subtitle}>Manage your account and preferences</p>
            </div>
            
            <div style={styles.cardsContainer}>
                {/* Account Card */}
                <div style={cardStyle}>
                    <h3 style={styles.sectionTitle}>Account</h3>
                    <div style={styles.infoRow}>
                        <span style={styles.label}>Logged in as:</span>
                        <strong style={styles.value}>{user?.name || 'User'}</strong>
                    </div>
                    <button 
                        style={buttonPrimary}
                        onMouseEnter={(e) => {
                            e.target.style.background = gradients.primaryHover;
                            e.target.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = gradients.primary;
                            e.target.style.transform = 'translateY(0)';
                        }}
                    >
                        Change Password
                    </button>
                </div>

                {/* Appearance Card */}
                <div style={cardStyle}>
                    <h3 style={styles.sectionTitle}>Appearance</h3>
                    <div style={styles.toggleRow}>
                        <span style={styles.label}>Dark Mode</span>
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            style={{
                                ...styles.toggleSwitch,
                                background: darkMode ? gradients.primary : colors.grayLight,
                                justifyContent: darkMode ? 'flex-end' : 'flex-start'
                            }}
                        >
                            <span style={styles.toggleCircle}></span>
                        </button>
                        <span style={styles.comingSoon}>(Coming Soon)</span>
                    </div>
                </div>

                {/* Data Card */}
                <div style={cardStyle}>
                    <h3 style={styles.sectionTitle}>Data</h3>
                    <p style={styles.warningText}>
                        ⚠️ This action cannot be undone. All your tasks will be permanently deleted.
                    </p>
                    <button 
                        style={{
                            ...buttonPrimary,
                            background: gradients.danger,
                            boxShadow: '0 4px 15px rgba(244,67,54,0.3)'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                        }}
                    >
                        Clear All Tasks
                    </button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '40px',
        maxWidth: '800px',
        margin: '0 auto',
        background: colors.background,
        minHeight: '100vh',
        overflowY: 'auto'
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
    cardsContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '24px' // This is the key fix for spacing between cards
    },
    sectionTitle: {
        fontSize: '1.3rem',
        color: colors.textPrimary,
        fontWeight: '700',
        marginBottom: '20px',
        borderBottom: '2px solid #f0f0f0',
        paddingBottom: '12px'
    },
    infoRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        padding: '16px',
        background: colors.gray,
        borderRadius: '12px'
    },
    label: {
        fontSize: '0.95rem',
        color: colors.textSecondary,
        fontWeight: '500'
    },
    value: {
        fontSize: '1rem',
        color: colors.textPrimary,
        fontWeight: '600'
    },
    toggleRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '16px',
        background: colors.gray,
        borderRadius: '12px'
    },
    toggleSwitch: {
        width: '50px',
        height: '28px',
        borderRadius: '50px',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        padding: '3px',
        transition: 'all 0.3s ease',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    toggleCircle: {
        width: '22px',
        height: '22px',
        borderRadius: '50%',
        background: colors.white,
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        transition: 'transform 0.3s ease'
    },
    comingSoon: {
        fontSize: '0.85rem',
        color: colors.textMuted,
        fontStyle: 'italic'
    },
    warningText: {
        color: colors.red,
        fontSize: '0.9rem',
        marginBottom: '20px',
        padding: '12px',
        background: 'rgba(244, 67, 54, 0.1)',
        borderRadius: '12px',
        borderLeft: '3px solid ' + colors.red
    }
};

export default Settings;
