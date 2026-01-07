import React, { useState } from 'react';
import CalendarView from './CalendarView';
import TaskListSidebar from './TaskListSidebar';
import SidebarFilters from './SidebarFilters';
import TaskFormModal from './TaskFormModal';
import Card from '../../components/ui/Card';

const WorkView = ({ tasks, onDateSelect, onEventDrop, onEventClick, onDelete, onUpdate }) => {
    const [filters, setFilters] = useState({
        status: 'all',
        priority: 'all',
        tags: []
    });

    const [editingTask, setEditingTask] = useState(null);

    const filteredTasks = tasks.filter(task => {
        if (filters.status === 'active' && task.isCompleted) return false;
        if (filters.status === 'completed' && !task.isCompleted) return false;
        if (filters.priority !== 'all' && task.priority !== filters.priority) return false;
        if (filters.tags.length > 0) {
            const hasTag = task.tags && task.tags.some(t => filters.tags.includes(t));
            if (!hasTag) return false;
        }
        return true;
    });

    const handleEventClick = (task) => {
        setEditingTask(task);
    };

    return (
        <div style={styles.container}>
            {/* --- Left: Calendar --- */}
            <Card style={styles.calendarArea}>
                <CalendarView 
                    tasks={filteredTasks} 
                    onDateSelect={onDateSelect}
                    onEventDrop={onEventDrop}
                    onEventClick={handleEventClick} 
                    unified={true} 
                />
            </Card>

            {/* --- Right: Sidebar (Filters + Tasks) --- */}
            <Card style={styles.sidebarArea}>
                <div style={styles.filtersSection}>
                    <SidebarFilters 
                        filters={filters}
                        setFilters={setFilters}
                        selectedDate={null} 
                        onClearDate={() => {}}
                    />
                </div>

                <div style={styles.divider}></div>

                <div style={styles.tasksSection}>
                    <h3 style={styles.listTitle}>Tasks ({filteredTasks.length})</h3>
                    <TaskListSidebar 
                        tasks={filteredTasks} 
                        onUpdate={onUpdate}
                        onDelete={onDelete}
                        onDragEnd={() => {}} 
                    />
                </div>
            </Card>

            {/* Edit Modal */}
            {editingTask && (
                <TaskFormModal 
                    isOpen={!!editingTask}
                    taskToEdit={editingTask}
                    onClose={() => setEditingTask(null)}
                    onUpdate={onUpdate}
                    onDelete={onDelete}
                    onAdd={() => {}} 
                />
            )}
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        height: '100%',
        width: '100%',
        gap: '20px',
        padding: '20px',
        overflow: 'hidden',
        backgroundColor: '#f4f6f9',
        maxWidth: '1600px', // Limit max width for large screens
        margin: '0 auto'
    },
    
    calendarArea: { 
        flex: 3, // Takes 75% roughly
        overflow: 'hidden', 
        display: 'flex', 
        flexDirection: 'column',
        height: '100%',
        padding: '20px'
    },

    sidebarArea: { 
        flex: 1, // Takes 25% roughly
        minWidth: '320px',
        maxWidth: '400px',
        display: 'flex', 
        flexDirection: 'column', 
        overflow: 'hidden',
        height: '100%',
        padding: '0' // Padding handled inside sections
    },
    
    filtersSection: {
        flexShrink: 0,
        maxHeight: '40%',
        overflowY: 'auto',
        padding: '20px'
    },
    
    divider: {
        height: '1px',
        backgroundColor: '#f0f0f0',
        flexShrink: 0
    },
    
    tasksSection: {
        flex: 1,
        overflowY: 'auto',
        padding: '20px'
    },

    listTitle: {
        margin: '0 0 15px 0',
        fontSize: '1.1rem',
        color: '#333',
        fontWeight: '700'
    }
};

export default WorkView;