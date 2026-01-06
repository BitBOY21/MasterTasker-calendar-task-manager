import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import TaskItem from './TaskItem';
import { colors } from '../../components/ui/DesignSystem';

const TaskListSidebar = ({ tasks, onDelete, onUpdate, onGenerateAI, onDragEnd }) => {
// Note: We replaced onToggle with onUpdate
    return (
        <div style={styles.listContainer}>
            <h3 style={styles.title}>📅 Next Up</h3>
            
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="tasks-list">
                    {(provided) => (
                        <ul 
                            style={styles.list}
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {tasks.map((task, index) => (
                                <Draggable key={task._id} draggableId={task._id} index={index}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            style={{
                                                ...provided.draggableProps.style,
                                                marginBottom: '10px',
                                                opacity: snapshot.isDragging ? 0.8 : 1,
                                            }}
                                        >
                                            <TaskItem
                                                task={task}
                                                onDelete={onDelete}
                                                onUpdate={onUpdate} // <--- Pass the function forward
                                                onGenerateAI={onGenerateAI}
                                            />
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </ul>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
};

const styles = {
    listContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        borderRadius: '0',
        padding: '0',
        boxShadow: 'none',
        height: '100%',
        overflowY: 'auto'
    },
    title: {
        fontSize: '1.125rem',
        color: colors.textPrimary,
        fontWeight: '700',
        marginTop: 0,
        marginBottom: '20px',
        borderBottom: '2px solid #f0f0f0',
        paddingBottom: '12px',
        lineHeight: '1.5',
        letterSpacing: '-0.01em'
    },
    list: { 
        listStyleType: 'none', 
        padding: 0, 
        margin: 0 
    },
};

export default TaskListSidebar;