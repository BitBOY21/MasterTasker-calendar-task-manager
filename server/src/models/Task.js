const mongoose = require('mongoose');

const SubtaskSchema = new mongoose.Schema({
    text: { type: String, required: true },
    isCompleted: { type: Boolean, default: false }
});

const TaskSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    title: {
        type: String,
        required: [true, 'Please add a task title']
    },
    description: {
        type: String,
        default: ''
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    // --- Time fields ---
    dueDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    isAllDay: {
        type: Boolean,
        default: false
    },
    recurrence: {
        type: String,
        enum: ['none', 'daily', 'weekly', 'monthly', 'yearly'],
        default: 'none'
    },
    recurrenceId: {
        type: String,
        default: null
    },
    // --- Location ---
    location: {
        type: String,
        default: ''
    },
    // --- Tags ---
    tags: {
        type: [String],
        default: []
    },
    // --- Priority ---
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },
    urgencyScore: {
        type: Number,
        default: 0
    },
    order: {
        type: Number,
        default: 0
    },
    subtasks: {
        type: [SubtaskSchema],
        default: []
    },
    aiSuggestions: {
        type: [String],
        default: []
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Task', TaskSchema);