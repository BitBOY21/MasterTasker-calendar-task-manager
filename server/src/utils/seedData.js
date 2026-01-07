const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Task = require('../models/Task');
const { calculateUrgency } = require('./taskUtils');

const seedData = async () => {
    console.log('🌱 Seeding highly realistic, diverse data starting from Jan 7th...');

    const email = 'demo@example.com';
    let user = await User.findOne({ email });

    if (!user) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('123456', salt);
        user = await User.create({
            name: 'Demo User',
            email,
            password: hashedPassword
        });
    }

    await Task.deleteMany({ user: user._id });

    const tasks = [];
    const today = new Date();
    
    // Helper to create dates relative to Jan 7, 2025
    const d = (day, hour = 9, min = 0) => new Date(2025, 0, day, hour, min);

    const TAGS = {
        WORK: "Work 💼",
        PERSONAL: "Personal 🏠",
        URGENT: "Urgent 🔥",
        HEALTH: "Health 💪",
        STUDY: "Study 📚",
        FINANCE: "Finance 💰"
    };

    // --- 1. Multi-Day Projects (Spanning several days) ---
    tasks.push(
        {
            user: user._id,
            title: "Q1 Strategy Planning",
            priority: "High",
            tags: [TAGS.WORK, TAGS.URGENT],
            dueDate: d(7, 8, 0), // Starts Jan 7
            endDate: d(10, 18, 0), // Ends Jan 10 (4 days)
            isCompleted: true,
            description: "Defining goals and KPIs for the first quarter.",
            subtasks: [
                { text: "Review last year's performance", isCompleted: true },
                { text: "Draft new objectives", isCompleted: true },
                { text: "Present to stakeholders", isCompleted: true }
            ]
        },
        {
            user: user._id,
            title: "Home Renovation: Kitchen",
            priority: "Medium",
            tags: [TAGS.PERSONAL],
            dueDate: d(12, 9, 0), // Starts Jan 12
            endDate: d(19, 17, 0), // Ends Jan 19 (8 days)
            isCompleted: false,
            description: "Painting walls and replacing cabinet handles.",
            subtasks: [
                { text: "Buy paint and brushes", isCompleted: true },
                { text: "Remove old handles", isCompleted: false },
                { text: "Apply first coat of paint", isCompleted: false }
            ]
        },
        {
            user: user._id,
            title: "Deep Learning Course - Module 1",
            priority: "Low",
            tags: [TAGS.STUDY],
            dueDate: d(20, 10, 0), // Starts Jan 20
            endDate: d(25, 16, 0), // Ends Jan 25 (6 days)
            isCompleted: false
        }
    );

    // --- 2. Overdue Single-Day Tasks (Scattered dates) ---
    tasks.push(
        {
            user: user._id,
            title: "Pay Electricity Bill",
            priority: "High",
            tags: [TAGS.FINANCE, TAGS.URGENT],
            dueDate: d(7, 14, 30), // Jan 7
            isCompleted: false,
            description: "Avoid late fees!"
        },
        {
            user: user._id,
            title: "Update Portfolio Website",
            priority: "Medium",
            tags: [TAGS.WORK],
            dueDate: d(9, 11, 0), // Jan 9
            isCompleted: false
        },
        {
            user: user._id,
            title: "Call Grandma",
            priority: "Low",
            tags: [TAGS.PERSONAL],
            dueDate: d(11, 19, 0), // Jan 11
            isCompleted: false
        },
        {
            user: user._id,
            title: "Submit Expense Reports",
            priority: "High",
            tags: [TAGS.WORK, TAGS.FINANCE],
            dueDate: d(15, 10, 0), // Jan 15
            isCompleted: false
        }
    );

    // --- 3. Today's Tasks (Dynamic) ---
    const t = (h, m) => {
        const date = new Date(today);
        date.setHours(h, m, 0, 0);
        return date;
    };

    tasks.push(
        {
            user: user._id,
            title: "Morning Standup",
            priority: "High",
            tags: [TAGS.WORK],
            dueDate: t(9, 30),
            isCompleted: true
        },
        {
            user: user._id,
            title: "Client Feedback Review",
            priority: "High",
            tags: [TAGS.WORK, TAGS.URGENT],
            dueDate: t(11, 0),
            isCompleted: false,
            subtasks: [
                { text: "Read email from John", isCompleted: true },
                { text: "Draft response", isCompleted: false }
            ]
        },
        {
            user: user._id,
            title: "Gym: Leg Day",
            priority: "Medium",
            tags: [TAGS.HEALTH],
            dueDate: t(17, 0),
            isCompleted: false
        },
        {
            user: user._id,
            title: "Read 20 pages of a book",
            priority: "Low",
            tags: [TAGS.PERSONAL, TAGS.STUDY],
            dueDate: t(21, 30),
            isCompleted: false
        }
    );

    // --- 4. Future Tasks ---
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    tasks.push(
        {
            user: user._id,
            title: "Dentist Checkup",
            priority: "High",
            tags: [TAGS.HEALTH],
            dueDate: new Date(tomorrow.setHours(10, 0)),
            isCompleted: false
        },
        {
            user: user._id,
            title: "Monthly Budget Review",
            priority: "Medium",
            tags: [TAGS.FINANCE],
            dueDate: new Date(nextWeek.setHours(15, 0)),
            isCompleted: false
        }
    );

    // Calculate urgency and save
    const finalTasks = tasks.map(task => ({
        ...task,
        urgencyScore: calculateUrgency(task.dueDate, task.priority)
    }));

    await Task.insertMany(finalTasks);
    console.log(`✅ Seeded ${finalTasks.length} diverse tasks with unique dates and multi-day projects.`);
};

module.exports = seedData;