import React from 'react';
import Card from '../../../../components/ui/Card';
import { FaFire, FaCheckCircle, FaHourglassHalf } from 'react-icons/fa';

const StatCard = ({ icon, color, label, value, subValue }) => (
    <Card style={{ 
        padding: '20px 25px', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '20px', 
        width: '100%',
        // Removed borderLeft
    }}>
        <div style={{
            width: '50px', height: '50px', borderRadius: '14px', 
            backgroundColor: `${color}15`, // 15 is hex alpha for ~8% opacity
            display: 'flex', alignItems: 'center', 
            justifyContent: 'center', fontSize: '1.4rem', color: color, flexShrink: 0
        }}>
            {icon}
        </div>
        <div>
            <span style={{ fontSize: '0.9rem', color: '#888', display: 'block', marginBottom: '4px', fontWeight: '600' }}>
                {label}
            </span>
            <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#333', lineHeight: '1' }}>
                {value} <span style={{ fontSize: '1rem', color: '#aaa', fontWeight: '500' }}>{subValue}</span>
            </div>
        </div>
    </Card>
);

const SummaryStats = ({ tasks }) => {
    const total = tasks.length;
    const pendingUrgent = tasks.filter(t => t.priority === 'High' && !t.isCompleted).length;
    const totalUrgent = tasks.filter(t => t.priority === 'High').length;
    const completedCount = tasks.filter(t => t.isCompleted).length;
    const pendingCount = tasks.filter(t => !t.isCompleted).length;

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px', marginBottom: '25px' }}>
            <StatCard 
                icon={<FaHourglassHalf />} 
                color="#ffc107" 
                label="Total Pending" 
                value={pendingCount} 
                subValue={`/ ${total}`} 
            />
            <StatCard 
                icon={<FaFire />} 
                color="#dc3545" 
                label="Total Urgent" 
                value={pendingUrgent} 
                subValue={`/ ${totalUrgent}`} 
            />
            <StatCard 
                icon={<FaCheckCircle />} 
                color="#28a745" 
                label="Total Completed" 
                value={completedCount} 
                subValue={`/ ${total}`} 
            />
        </div>
    );
};

export default SummaryStats;