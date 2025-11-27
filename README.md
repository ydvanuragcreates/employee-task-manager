# Employee & Task Management System

A full-stack web application for managing employees and tasks with secure authentication and modern UI.

🔗 **Live Demo**: [https://employee-task-manager-live.vercel.app](https://employee-task-manager-live.vercel.app)

## Screenshots

### Dashboard & Employee Management
![Dashboard](ScreenShots/Screenshot%202025-11-28%20030157.png)

### Task Board - Kanban View
![Task Board](ScreenShots/Screenshot%202025-11-28%20030258.png)

### Add Employee Modal
![Add Employee](ScreenShots/Screenshot%202025-11-28%20030334.png)

### Task Management
![Task Management](ScreenShots/Screenshot%202025-11-28%20031048.png)

### User Profile
![Profile](ScreenShots/Screenshot%202025-11-28%20031103.png)

## Features

### Core Features
- **Employee Management**: Create, read, update, and delete employees with name, email, and role
- **Task Management**: Create, read, update, and delete tasks with title, description, and status
- **Task Assignment**: Assign tasks to specific employees
- **Task Board**: Visual kanban-style board with To Do, In Progress, and Completed columns
- **User Profiles**: Customizable user profiles with avatar upload
- **Multi-tenancy**: Each user has isolated data (employees and tasks)

### Security 🔒
- **Clerk Authentication**: Secure user authentication with JWT tokens
- **Protected API**: All endpoints require valid authentication
- **Session Management**: Automatic token refresh and session handling
- **Data Isolation**: Users can only access their own data

### UI/UX ✨
- **Modern Design**: Clean, responsive interface with Tailwind CSS
- **3D Background**: Interactive Three.js animated background
- **Smooth Animations**: Framer Motion for fluid transitions
- **Mobile Responsive**: Works seamlessly on all devices

## Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - ORM for database operations
- **PostgreSQL** - Production database (Render)
- **SQLite** - Local development database
- **Clerk** - Authentication & user management
- **Pydantic** - Data validation

### Frontend
- **React 18** - UI library
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Three.js** - 3D graphics for background
- **Framer Motion** - Animation library
- **Axios** - HTTP client
- **Clerk React** - Authentication components

### Deployment
- **Backend**: Render (with PostgreSQL)
- **Frontend**: Vercel
- **Database**: Render PostgreSQL

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
CLERK_DOMAIN=your-clerk-domain.clerk.accounts.dev
DATABASE_URL=sqlite:///./employee_task_management.db
```

Get your Clerk domain from https://dashboard.clerk.com (API Keys section)

For production deployment, set `DATABASE_URL` to your PostgreSQL connection string

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
2. **Setup Profile**: Customize your profile with name, role, and avatar
3. **Add Employees**: Navigate to the Employees tab and add team members
4. **Create Tasks**: Switch to Tasks tab to create new tasks with title and description
5. **Assign Tasks**: Assign tasks to employees and track their status on the kanban board
6. **Manage Status**: Drag tasks between columns or edit to change status (To Do → In Progress → Completed)
7. **Update Profile**: Click your profile picture to update your information
8. **Sign Out**: Click your profile picture in the header to sign out

## Deployment

### Backend (Render)
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `pip install -r backend/requirements.txt`
4. Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables:
   - `DATABASE_URL` (from Render PostgreSQL)
   - `CLERK_DOMAIN`
   - `FRONTEND_URL` (your Vercel URL)

### Frontend (Vercel)
1. Import your GitHub repository to Vercel
2. Set root directory to `frontend`
3. Add environment variables:
   - `VITE_CLERK_PUBLISHABLE_KEY`
   - `VITE_API_BASE_URL` (your Render backend URL + `/api`)
4. Deploy!

## Project Structure

```
├── backend/
│   ├── main.py              # FastAPI application entry point
│   ├── models.py            # SQLAlchemy database models
│   ├── schemas.py           # Pydantic schemas for validation
│   ├── database.py          # Database configuration (SQLite/PostgreSQL)
│   ├── auth.py              # Clerk authentication verification
│   ├── routers/
│   │   ├── employees.py     # Employee CRUD endpoints
│   │   ├── tasks.py         # Task CRUD endpoints
│   │   └── profile.py       # User profile endpoints
│   ├── requirements.txt     # Python dependencies
│   └── .env.example         # Environment variables template
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── EmployeeTable.jsx   # Employee management UI
    │   │   ├── TaskBoard.jsx       # Task kanban board UI
    │   │   ├── ProfileModal.jsx    # User profile modal
    │   │   ├── Background3D.jsx    # Three.js animated background
    │   │   ├── Tabs.jsx            # Tab navigation component
    │   │   └── EmptyState.jsx      # Empty state component
    │   ├── api/
    │   │   └── api.js              # API client with auth interceptor
    │   ├── App.jsx                 # Main application component
    │   └── main.jsx                # React entry point
    ├── package.json
    └── tailwind.config.js
```

## Key Highlights

- ✅ **Full-stack application** with modern tech stack
- ✅ **Production deployed** on Render + Vercel
- ✅ **Secure authentication** with Clerk
- ✅ **Database migration** from SQLite to PostgreSQL
- ✅ **Multi-tenancy** with user data isolation
- ✅ **RESTful API** with FastAPI
- ✅ **Responsive design** with Tailwind CSS
- ✅ **3D animations** with Three.js
- ✅ **File uploads** for user avatars
- ✅ **CORS configured** for cross-origin requests

## Future Enhancements

- [ ] Task filtering and search
- [ ] Email notifications
- [ ] Task comments and attachments
- [ ] Team collaboration features
- [ ] Analytics dashboard
- [ ] Export data to CSV/PDF

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
