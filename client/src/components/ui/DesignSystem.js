// MasterTasker Global Design System
// Reusable style objects and constants

export const colors = {
    primary: '#007bff',
    primaryDark: '#0056b3',
    purple: '#6f42c1',
    purpleDark: '#5a32a3',
    orange: '#ff9800',
    red: '#f44336',
    background: '#f4f6f9',
    white: '#ffffff',
    grayLight: '#f1f3f5',
    gray: '#f8f9fa',
    textPrimary: '#333333',
    textSecondary: '#666666',
    textMuted: '#888888',
};

export const gradients = {
    primary: 'linear-gradient(135deg, #007bff, #6f42c1)',
    primaryHover: 'linear-gradient(135deg, #0056b3, #5a32a3)',
    danger: 'linear-gradient(135deg, #f44336, #d32f2f)',
    purple: 'linear-gradient(135deg, #6f42c1, #5a32a3)',
};

export const shadows = {
    card: '0 4px 20px rgba(0,0,0,0.05)',
    cardHover: '0 8px 30px rgba(0,0,0,0.08)',
    button: '0 4px 15px rgba(0,123,255,0.3)',
    glass: '0 8px 32px rgba(0,0,0,0.1)',
};

export const borderRadius = {
    card: '16px',
    button: '50px',
    input: '12px',
    tag: '12px',
};

// Card Component Style
export const cardStyle = {
    backgroundColor: colors.white,
    borderRadius: borderRadius.card,
    boxShadow: shadows.card,
    padding: '24px',
    transition: 'all 0.2s ease',
};

// Primary Button Style (Pill)
export const buttonPrimary = {
    background: gradients.primary,
    color: colors.white,
    border: 'none',
    borderRadius: borderRadius.button,
    padding: '12px 28px',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: shadows.button,
};

// Secondary Button Style (Pill - Inactive Filter)
export const buttonSecondary = {
    background: colors.grayLight,
    color: colors.textPrimary,
    border: 'none',
    borderRadius: borderRadius.button,
    padding: '8px 18px',
    fontSize: '0.85rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
};

// Active Filter Button (Pill)
export const buttonActive = {
    background: gradients.primary,
    color: colors.white,
    border: 'none',
    borderRadius: borderRadius.button,
    padding: '8px 18px',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 8px rgba(0,123,255,0.3)',
};

// Input Style
export const inputStyle = {
    padding: '14px 18px',
    fontSize: '1rem',
    borderRadius: borderRadius.input,
    border: '1px solid transparent',
    background: colors.gray,
    transition: 'all 0.2s ease',
    width: '100%',
    color: colors.textPrimary,
};

// Input Focus Style
export const inputFocusStyle = {
    background: colors.white,
    borderColor: colors.primary,
    boxShadow: '0 0 0 3px rgba(0,123,255,0.1)',
};

// Glassmorphism Overlay
export const glassOverlay = {
    background: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
};

// Glassmorphism Card
export const glassCard = {
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    borderRadius: borderRadius.card,
    boxShadow: shadows.glass,
    border: '1px solid rgba(255, 255, 255, 0.3)',
};

// Gradient Text
export const gradientText = {
    background: gradients.primary,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    fontWeight: '700',
};

