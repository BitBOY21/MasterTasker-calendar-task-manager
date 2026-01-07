/**
 * Calculates urgency score based on due date and priority
 */
const calculateUrgency = (dueDate, priority) => {
    let score = 0;
    const priorityMap = { 'Low': 1, 'Medium': 5, 'High': 10 };
    score += priorityMap[priority] || 5;

    if (dueDate) {
        const now = new Date();
        const due = new Date(dueDate);
        const daysLeft = (due - now) / (1000 * 60 * 60 * 24);

        if (daysLeft < 0) score += 30; 
        else if (daysLeft <= 1) score += 20; 
        else if (daysLeft <= 3) score += 10; 
        else if (daysLeft <= 7) score += 5; 
    }
    return score;
};

module.exports = {
    calculateUrgency
};