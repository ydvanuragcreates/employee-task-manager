# Employee & Task Management System

A full-stack web application for managing employees and tasks with an AI-powered task assistant.

## Features

### Core Features
- **Employee Management**: Create, read, update, and delete employees with name, email, and role
- **Task Management**: Create, read, update, and delete tasks with title, description, and status
- **Task Assignment**: Assign tasks to specific employees
- **Task Board**: Visual kanban-style board with To Do, In Progress, and Completed columns

### Security 🔒
- **Clerk Authentication**: Secure user authentication with JWT tokens
- **Protected API**: All endpoints require valid authentication
- **Session Management**: Automatic token refresh and session handling

### AI Wow Factor ✨
- **AI Task Assistant**: Auto-generate detailed task descriptions from titles using OpenAI GPT-3.5

## Tech Stack

### Backend
- Python FastAPI
- SQLAlchemy ORM
- SQLite Database
- OpenAI API

### Frontend
- React 18
- Tailwind CSS
- Axios
- Vite

## Setup Instructions

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create `.env` file:
```bash
copy .env.example .env
```

5. Configure environment variables in `.env`:
```
OPENAI_API_KEY=your_actual_api_key_here
CLERK_DOMAIN=your-clerk-domain.clerk.accounts.dev
```

Get your Clerk domain from https://dashboard.clerk.com (API Keys section)

6. Run the server:
```bash
uvicorn main:app --reload
```

Backend will run on http://localhost:8000

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
copy .env.example .env
```

4. Add your Clerk publishable key to `.env`:
```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_key_here
```

Get your publishable key from https://dashboard.clerk.com (API Keys section)

5. Run development server:
```bash
npm run dev
```

Frontend will run on http://localhost:3000

### Authentication Setup

For detailed Clerk authentication setup instructions, see [CLERK_SETUP.md](CLERK_SETUP.md)

## API Documentation

Once the backend is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Usage

1. **Sign In**: Open the application and sign in with Clerk (create an account if needed)
2. **Add Employees**: Navigate to the Employees tab and add team members
3. **Create Tasks**: Switch to Tasks tab to create new tasks
4. **AI Assistant**: When creating a task, enter a title and click the "✨ AI Assistant" button to auto-generate a detailed description
5. **Assign Tasks**: Assign tasks to employees and track their status on the kanban board
6. **Manage Status**: Update task status by editing tasks and changing their status
7. **Sign Out**: Click your profile picture in the header to sign out

## Project Structure

```
├── backend/
│   ├── main.py              # FastAPI application entry point
│   ├── models.py            # SQLAlchemy database models
│   ├── schemas.py           # Pydantic schemas for validation
│   ├── database.py          # Database configuration
│   ├── routers/
│   │   ├── employees.py     # Employee CRUD endpoints
│   │   └── tasks.py         # Task CRUD + AI endpoints
│   ├── requirements.txt     # Python dependencies
│   └── .env.example         # Environment variables template
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── EmployeeTable.jsx  # Employee management UI
    │   │   └── TaskBoard.jsx      # Task kanban board UI
    │   ├── api/
    │   │   └── api.js             # API client
    │   ├── App.jsx                # Main application component
    │   └── main.jsx               # React entry point
    ├── package.json
    └── tailwind.config.js
```

## License

MIT
