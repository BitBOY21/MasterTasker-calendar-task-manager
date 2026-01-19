import React from 'react';

const Card = ({ children, className = '', style = {}, onClick }) => {
    return (
        <div 
            onClick={onClick}
            style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '25px', // Spacious padding
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)', // Soft shadow
                border: 'none', // Removed border for cleaner look
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                ...style
            }}
            className={className}
        >
            {children}
        </div>
    );
};

export default Card;