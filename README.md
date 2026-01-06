# MasterTasker 🚀

Smart Task Management System with AI-powered subtask generation.

## Features
- **AI Breakdown:** Automatically generate actionable subtasks using Google Gemini AI.
- **Smart Urgency:** Tasks are automatically scored based on priority and due dates.
- **Drag & Drop:** Reorder tasks easily.
- **Full Auth:** Secure JWT-based authentication.
- **Modern Stack:** React (Vite) + Node.js (Express) + MongoDB.

## Project Structure
- `/client`: Frontend built with React and Tailwind CSS.
- `/server`: Backend API built with Node.js, Express, and Mongoose.

## Getting Started

### Prerequisites
- Node.js installed
- MongoDB (Local or Atlas)
- Google Gemini API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/MasterTasker.git
   cd MasterTasker
   ```

2. **Setup Server:**
   ```bash
   cd server
   npm install
   # Create .env file based on .env.example
   npm start
   ```

3. **Setup Client:**
   ```bash
   cd ../client
   npm install
   npm run dev
   ```

## License
MIT
