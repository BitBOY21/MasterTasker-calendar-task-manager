const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Google Gemini Client (ensure API key is set in environment variables)
const genAI = process.env.GEMINI_API_KEY 
    ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    : null;

/**
 * Receives a task title and returns a list of steps (subtasks)
 * @param {string} taskTitle 
 * @returns {Promise<string[]>} Array of steps
 */
const generateBreakdown = async (taskTitle) => {
    // Mock response list for error cases or quota exceeded
    const getMockSteps = (title) => {
        return [
            `Research best practices for "${title}"`,
            `Create a draft outline`,
            `Review and refine details`,
            `Finalize execution plan`
        ];
    };

    if (!genAI) {
        console.warn("⚠️ No Gemini API Key found. Returning Mock Data.");
        return getMockSteps(taskTitle);
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        
        const prompt = `You are an expert productivity assistant. 
        Break down this task: "${taskTitle}" into 3 to 5 short, actionable subtasks.
        Return ONLY the subtasks as a plain list separated by newlines. 
        Do not use numbers, bullet points, or bold text.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean and process the response into an array
        const steps = text.split('\n')
            .map(s => s.trim())
            .filter(s => s.length > 0)
            .map(s => s.replace(/^[\*\-] /, ''));

        return steps;

    } catch (error) {
        console.error("Gemini AI Error (Falling back to Mock Data):", error.message);
        // Instead of throwing an error, return mock data so the user doesn't get stuck
        return getMockSteps(taskTitle);
    }
};

module.exports = {
    generateBreakdown
};