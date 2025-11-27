from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import Task, Employee
from schemas import Task as TaskSchema, TaskCreate, TaskUpdate, TaskWithEmployee
from auth import verify_clerk_token

router = APIRouter()

@router.get("/", response_model=List[TaskWithEmployee])
def get_tasks(
    db: Session = Depends(get_db),
    auth_data: dict = Depends(verify_clerk_token)
):
    user_id = auth_data["user_id"]
    tasks = db.query(Task).filter(Task.owner_id == user_id).all()
    return tasks

@router.get("/{task_id}", response_model=TaskWithEmployee)
def get_task(
    task_id: int,
    db: Session = Depends(get_db),
    auth_data: dict = Depends(verify_clerk_token)
):
    user_id = auth_data["user_id"]
    task = db.query(Task).filter(
        Task.id == task_id,
        Task.owner_id == user_id
    ).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.post("/", response_model=TaskSchema)
def create_task(
    task: TaskCreate,
    db: Session = Depends(get_db),
    auth_data: dict = Depends(verify_clerk_token)
):
    user_id = auth_data["user_id"]
    
    # Validate employee exists and belongs to user if employee_id is provided
    if task.employee_id is not None and task.employee_id != 0:
        employee = db.query(Employee).filter(
            Employee.id == task.employee_id,
            Employee.owner_id == user_id
        ).first()
        if not employee:
            raise HTTPException(status_code=404, detail="Employee not found")
    
    task_data = task.model_dump()
    # Ensure employee_id is None if it's 0 or empty
    if task_data.get('employee_id') == 0:
        task_data['employee_id'] = None
    
    # Add owner_id
    task_data['owner_id'] = user_id
    
    db_task = Task(**task_data)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@router.put("/{task_id}", response_model=TaskSchema)
def update_task(
    task_id: int,
    task: TaskUpdate,
    db: Session = Depends(get_db),
    auth_data: dict = Depends(verify_clerk_token)
):
    user_id = auth_data["user_id"]
    db_task = db.query(Task).filter(
        Task.id == task_id,
        Task.owner_id == user_id
    ).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Validate employee exists and belongs to user if employee_id is being updated
    update_data = task.model_dump(exclude_unset=True)
    if "employee_id" in update_data and update_data["employee_id"]:
        employee = db.query(Employee).filter(
            Employee.id == update_data["employee_id"],
            Employee.owner_id == user_id
        ).first()
        if not employee:
            raise HTTPException(status_code=404, detail="Employee not found")
    
    for key, value in update_data.items():
        setattr(db_task, key, value)
    
    db.commit()
    db.refresh(db_task)
    return db_task

@router.delete("/{task_id}")
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    auth_data: dict = Depends(verify_clerk_token)
):
    user_id = auth_data["user_id"]
    db_task = db.query(Task).filter(
        Task.id == task_id,
        Task.owner_id == user_id
    ).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    db.delete(db_task)
    db.commit()
    return {"message": "Task deleted successfully"}


