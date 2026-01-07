const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Task = require('../models/Task');
const { calculateUrgency } = require('./taskUtils');

const seedData = async () => {
    console.log('🌱 Seeding data with EXACT system tags (including emojis)...');

    // 1. Create or Find Test User
    const email = 'test@example.com';
    let user = await User.findOne({ email });

    if (!user) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('123456', salt);
        user = await User.create({
            name: 'Test User',
            email,
            password: hashedPassword
        });
    }

    // 2. Clear existing tasks
    await Task.deleteMany({ user: user._id });

    const tasks = [];
    const today = new Date();
    
    const addDays = (date, days) => {
        const d = new Date(date);
        d.setDate(d.getDate() + days);
        return d;
    };

    const setTime = (date, hours, minutes) => {
        const d = new Date(date);
        d.setHours(hours, minutes, 0, 0);
        return d;
    };

    // --- EXACT System Tags from Frontend ---
    const TAGS = {
        WORK: "Work 💼",
        PERSONAL: "Personal 🏠",
        SHOPPING: "Shopping 🛒",
        HEALTH: "Health 💪",
        FINANCE: "Finance 💰",
        STUDY: "Study 📚",
        URGENT: "Urgent 🔥",
        FAMILY: "Family 👨‍👩‍👧‍👦",
        ERRANDS: "Errands 🏃"
    };

    // --- Templates with Correct Tags ---
    const dailyTemplates = [
        { title: "Morning Standup", priority: "High", tags: [TAGS.WORK, TAGS.URGENT], time: [9, 0], duration: 30 },
        { title: "Gym Workout", priority: "Medium", tags: [TAGS.HEALTH, TAGS.PERSONAL], time: [17, 30], duration: 90 },
        { title: "Grocery Shopping", priority: "Low", tags: [TAGS.SHOPPING, TAGS.PERSONAL], time: [18, 0], duration: 45 },
        { title: "Pay Monthly Bills", priority: "High", tags: [TAGS.FINANCE, TAGS.URGENT], time: [11, 0], duration: 20 },
        { title: "Study React Patterns", priority: "Medium", tags: [TAGS.STUDY], time: [20, 0], duration: 60 },
        { title: "Call Family", priority: "Low", tags: [TAGS.FAMILY, TAGS.PERSONAL], time: [19, 0], duration: 30 },
        { title: "Quick Errand", priority: "Low", tags: [TAGS.ERRANDS], time: [14, 0], duration: 20 }
    ];

    const multiDayTemplates = [
        { title: "Project Milestone: Alpha", tags: [TAGS.WORK, TAGS.URGENT], priority: "High", days: 4 },
        { title: "Home Organization", tags: [TAGS.PERSONAL, TAGS.HOME], priority: "Medium", days: 3 },
        { title: "Learning Week: AI", tags: [TAGS.STUDY, TAGS.WORK], priority: "Medium", days: 5 }
    ];

    // 3. Generate Multi-day Tasks
    for (let i = -20; i <= 20; i += 15) {
        const template = multiDayTemplates[Math.floor(Math.random() * multiDayTemplates.length)];
        const startDate = addDays(today, i);
        const endDate = addDays(startDate, template.days);
        
        tasks.push({
            user: user._id,
            title: template.title,
            priority: template.priority,
            tags: template.tags,
            dueDate: setTime(startDate, 9, 0),
            endDate: setTime(endDate, 17, 0),
            isCompleted: i < 0,
            urgencyScore: calculateUrgency(startDate, template.priority),
            description: "Multi-day project with system tags."
        });
    }

    // 4. Generate Daily Tasks (-30 to +30)
    for (let i = -30; i <= 30; i++) {
        const date = addDays(today, i);
        const isWeekend = date.getDay() === 5 || date.getDay() === 6;
        const dailyCount = isWeekend ? 2 : 4;

        for (let j = 0; j < dailyCount; j++) {
            const template = dailyTemplates[Math.floor(Math.random() * dailyTemplates.length)];
            
            const hourOffset = Math.floor(Math.random() * 3) - 1; 
            const startTime = setTime(date, template.time[0] + hourOffset, template.time[1]);
            const endTime = new Date(startTime.getTime() + template.duration * 60000);

            tasks.push({
                user: user._id,
                title: template.title,
                priority: template.priority,
                tags: template.tags,
                dueDate: startTime,
                endDate: endTime,
                isCompleted: i < 0 ? Math.random() > 0.15 : false,
                urgencyScore: calculateUrgency(startTime, template.priority),
                order: j,
                subtasks: [{ text: "Initial Step", isCompleted: i < 0 }]
            });
        }
    }

    await Task.insertMany(tasks);
    console.log(`✅ Seeded ${tasks.length} tasks with EXACT system tags (emojis included).`);
};

module.exports = seedData;