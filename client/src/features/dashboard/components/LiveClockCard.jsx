import React, { useState, useEffect } from 'react';
import Card from '../../../components/ui/Card';
import { FaClock } from 'react-icons/fa';

const LiveClockCard = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const timeString = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    const dateString = time.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });

    return (
        <Card style={{ 
            padding: '20px 25px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '20px', 
            minHeight: '100px',
            // Removed borderLeft
        }}>
            <div style={{
                width: '50px', height: '50px', borderRadius: '14px', 
                backgroundColor: '#e3f2fd', display: 'flex', alignItems: 'center', 
                justifyContent: 'center', fontSize: '1.4rem', color: '#007bff'
            }}>
                <FaClock />
            </div>
            <div>
                <span style={{ fontSize: '0.9rem', color: '#888', display: 'block', marginBottom: '4px', fontWeight: '600' }}>
                    {dateString}
                </span>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#333', lineHeight: '1' }}>
                    {timeString}
                </div>
            </div>
        </Card>
    );
};

export default LiveClockCard;