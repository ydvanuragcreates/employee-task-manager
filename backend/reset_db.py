import os
from database import engine
from models import Base

# Remove old database
if os.path.exists("employee_task_management.db"):
    os.remove("employee_task_management.db")
    print("Old database removed")

# Create new database with updated schema (includes owner_id for multi-tenancy)
Base.metadata.create_all(bind=engine)
print("New database created successfully with multi-tenancy support!")
print("Each user will now only see their own employees and tasks.")
