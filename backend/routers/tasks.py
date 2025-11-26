from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import Task, Employee
from schemas import Task as TaskSchema, TaskCreate, TaskUpdate, TaskWithEmployee, AITaskRequest
from auth import verify_clerk_token
import os
from openai import OpenAI

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

@router.post("/ai-generate-description")
def generate_task_description(
    request: AITaskRequest,
    auth_data: dict = Depends(verify_clerk_token)
):
    """AI Task Assistant - Generate detailed task description from title"""
    api_key = os.getenv("OPENAI_API_KEY")
    
    if not api_key or api_key == "your_openai_api_key_here":
        raise HTTPException(
            status_code=500, 
            detail="OpenAI API key not configured. Please set OPENAI_API_KEY environment variable."
        )
    
    try:
        client = OpenAI(api_key=api_key.strip())
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful assistant that generates detailed, professional task descriptions for project management. Keep descriptions concise but comprehensive, including key objectives and deliverables."
                },
                {
                    "role": "user",
                    "content": f"Generate a detailed task description for: {request.title}"
                }
            ],
            max_tokens=200,
            temperature=0.7,
            timeout=30.0
        )
        
        description = response.choices[0].message.content.strip()
        return {"description": description}
    
    except Exception as e:
        error_msg = str(e)
        if "authentication" in error_msg.lower() or "api key" in error_msg.lower():
            raise HTTPException(status_code=401, detail="Invalid OpenAI API key. Please check your key.")
        elif "connection" in error_msg.lower() or "timeout" in error_msg.lower():
            raise HTTPException(status_code=503, detail="Cannot connect to OpenAI. Check your internet connection.")
        else:
            raise HTTPException(status_code=500, detail=f"AI generation failed: {error_msg}")
