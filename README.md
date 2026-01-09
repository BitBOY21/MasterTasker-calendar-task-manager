# 🚀 MasterTasker - Smart Task Management System

**MasterTasker** is a modern, full-stack task management application designed to boost productivity. It goes beyond simple to-do lists by integrating **Google Gemini AI** for intelligent task breakdown, a robust Calendar View for scheduling, and detailed Analytics to track performance.

The system supports recurring tasks, multi-day events, and provides a seamless, "Gmail-like" user experience with optimistic UI updates and smart undo functionality.

![MasterTasker Dashboard Preview](./assets/dashboard-preview.png)
*(Note: Please add a screenshot of your dashboard here)*

## ✨ Key Features

* **🤖 AI Task Breakdown:** Powered by Google Gemini AI, automatically breaks down complex tasks into actionable subtasks.
* **📅 Interactive Calendar:** Full drag-and-drop support, monthly/weekly/daily views, and multi-day event handling.
* **🔁 Smart Recurring Tasks:** Robust support for daily, weekly, monthly, and yearly recurring tasks (Google Calendar style logic).
* **⚡ Modern UX:** Optimistic UI updates for instant feedback, toast notifications with **Undo**, and custom confirmation modals.
* **📊 Analytics Dashboard:** Visual insights into completion rates, productivity trends, and priority distribution.
* **🔐 Secure Authentication:** Complete JWT-based registration and login system.
* **🏷️ Organization:** Priority levels (High/Medium/Low), tagging system, and location tracking.

## 🛠️ Tech Stack

### Frontend (Client)
* **Framework:** React 19 (Vite)
* **Routing:** React Router DOM v7
* **State Management:** Context API + Custom Hooks (`useTasks`)
* **Styling:** CSS Modules, Glassmorphism design
* **Calendar:** react-big-calendar + date-fns
* **Drag & Drop:** @hello-pangea/dnd
* **Charts:** Recharts

### Backend (Server)
* **Runtime:** Node.js & Express.js
* **Database:** MongoDB (Mongoose ODM)
* **Auth:** JWT & bcryptjs
* **Validation:** Joi
* **AI Integration:** Google Generative AI SDK
* **Security:** Helmet, XSS-Clean, Mongo-Sanitize, CORS

## 📂 Project Structure

```bash
/client             # React Frontend
  ├── src/pages     # Main Views (Dashboard, Calendar, Analytics)
  ├── src/features  # Feature components (Tasks, Auth)
  ├── src/components # Reusable UI components
  ├── src/context   # State Providers
  └── src/hooks     # Custom Hooks (useTasks)

/server             # Node.js Backend
  ├── src/controllers # Logic Handlers
  ├── src/models      # Database Schemas
  ├── src/routes      # API Endpoints
  └── src/services    # Business Logic (AI, Tasks)
   ```
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
