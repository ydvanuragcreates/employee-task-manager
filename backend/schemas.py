from pydantic import BaseModel, EmailStr
from typing import Optional, List
from enum import Enum

class TaskStatus(str, Enum):
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"

class EmployeeBase(BaseModel):
    name: str
    email: EmailStr
    role: str

class EmployeeCreate(EmployeeBase):
    pass

class EmployeeUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[str] = None

class Employee(EmployeeBase):
    id: int
    owner_id: str
    
    class Config:
        from_attributes = True

class TaskBase(BaseModel):
    title: str
    description: str
    status: TaskStatus = TaskStatus.TODO
    employee_id: Optional[int] = None

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[TaskStatus] = None
    employee_id: Optional[int] = None

class Task(TaskBase):
    id: int
    owner_id: str
    
    class Config:
        from_attributes = True

class TaskWithEmployee(Task):
    employee: Optional[Employee] = None

class AITaskRequest(BaseModel):
    title: str

class UserProfileBase(BaseModel):
    name: str
    role: str
    avatar_url: Optional[str] = None

class UserProfileUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    avatar_url: Optional[str] = None

class UserProfile(UserProfileBase):
    id: int
    
    class Config:
        from_attributes = True
