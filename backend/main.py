from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from routers import employees, tasks, profile
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables from .env file
load_dotenv()

app = FastAPI(title="Employee & Task Management System")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads directory if it doesn't exist
Path("uploads/avatars").mkdir(parents=True, exist_ok=True)

# Mount static files for serving uploaded images
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Include routers
app.include_router(employees.router, prefix="/api/employees", tags=["employees"])
app.include_router(tasks.router, prefix="/api/tasks", tags=["tasks"])
app.include_router(profile.router, prefix="/api/profile", tags=["profile"])

@app.get("/")
def read_root():
    return {"message": "Employee & Task Management API"}
