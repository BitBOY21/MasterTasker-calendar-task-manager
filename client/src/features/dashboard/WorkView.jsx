import React, { useState } from 'react';
import CalendarView from './CalendarView';
import TaskListSidebar from './TaskListSidebar';
import SidebarFilters from './SidebarFilters';
import TaskFormModal from './TaskFormModal'; // Import TaskFormModal
import { cardStyle, colors, gradientText } from '../../components/ui/DesignSystem';

const WorkView = ({ tasks, onDateSelect, onEventDrop, onEventClick, onDelete, onUpdate }) => {
    // --- State לניהול הפילטרים (כמו ב-MySummary) ---
    const [filters, setFilters] = useState({
        status: 'all',
        priority: 'all',
        tags: []
    });

    // State for editing task in WorkView
    const [editingTask, setEditingTask] = useState(null);

    // --- לוגיקת הסינון המלאה ---
    const filteredTasks = tasks.filter(task => {
        // 1. סינון לפי סטטוס (Active / Completed)
        if (filters.status === 'active' && task.isCompleted) return false;
        if (filters.status === 'completed' && !task.isCompleted) return false;

        // 2. סינון לפי עדיפות (Priority)
        if (filters.priority !== 'all' && task.priority !== filters.priority) return false;

        // 3. סינון לפי תגיות (Tags)
        if (filters.tags.length > 0) {
            const hasTag = task.tags && task.tags.some(t => filters.tags.includes(t));
            if (!hasTag) return false;
        }

        return true;
    });

    // Handler for clicking a task in the calendar
    const handleEventClick = (task) => {
        setEditingTask(task);
        // We don't call onEventClick from props because we handle it locally with the modal
        // unless we want to sync with parent, but parent (App.jsx) opens drawer.
        // The user requested a POPUP modal for editing, not the drawer.
    };

    return (
        <div style={styles.container}>
            {/* --- Left part: Calendar --- */}
            <div style={styles.calendarArea}>
                <CalendarView 
                    tasks={filteredTasks} // הלוח מציג רק את מה שעבר סינון!
                    onDateSelect={onDateSelect}
                    onEventDrop={onEventDrop}
                    onEventClick={handleEventClick} // Use local handler to open modal
                    unified={true} // Enable unified mode for seamless integration
                />
            </div>

            {/* --- Right part: Unified panel with Filters on top and Tasks below --- */}
            <div style={styles.sidebarArea}>
                {/* Filters Section - Top */}
                <div style={styles.filtersSection}>
                    <SidebarFilters 
                        filters={filters}
                        setFilters={setFilters}
                        selectedDate={null} // WorkView doesn't manage selectedDate in filters for now
                        onClearDate={() => {}}
                    />
                </div>

                {/* Divider */}
                <div style={styles.divider}></div>

                {/* Tasks Section - Bottom */}
                <div style={styles.tasksSection}>
                    <TaskListSidebar 
                        tasks={filteredTasks} 
                        onUpdate={onUpdate}
                        onDelete={onDelete}
                        onDragEnd={() => {}} 
                    />
                </div>
            </div>

            {/* Edit Task Modal */}
            {editingTask && (
                <TaskFormModal 
                    isOpen={!!editingTask}
                    taskToEdit={editingTask}
                    onClose={() => setEditingTask(null)}
                    onUpdate={onUpdate}
                    onDelete={onDelete}
                    // onAdd is not needed here as this is only for editing
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
        gap: '24px',
        padding: '40px',
        overflow: 'hidden',
        backgroundColor: colors.background,
        maxWidth: '10000px',
        margin: '0 auto'

    },
    
    // Calendar - 75% width, dominant left panel
    calendarArea: { 
        width: '75%',
        ...cardStyle,
        overflow: 'hidden', 
        display: 'flex', 
        flexDirection: 'column',
        height: '100%',
        padding: '32px'
    },

    // Sidebar - 25% width, unified right panel
    sidebarArea: { 
        width: '25%',
        ...cardStyle,
        display: 'flex', 
        flexDirection: 'column', 
        overflow: 'hidden',
        height: '100%',
        padding: '0'
    },
    
    // Filters Section - Top part, scrollable if needed
    filtersSection: {
        flexShrink: 0,
        maxHeight: '40%',
        overflowY: 'auto',
        borderBottom: '1px solid #e0e0e0',
        background: 'transparent',
        padding: '24px'
    },
    
    // Divider between Filters and Tasks
    divider: {
        height: '1px',
        background: 'linear-gradient(90deg, transparent, #e0e0e0, transparent)',
        flexShrink: 0
    },
    
    // Tasks Section - Bottom part, takes remaining space
    tasksSection: {
        flex: 1,
        overflowY: 'auto',
        minHeight: 0,
        background: 'transparent',
        padding: '24px'
    }
};

export default WorkView;