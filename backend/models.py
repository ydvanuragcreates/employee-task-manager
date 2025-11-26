from sqlalchemy import Column, Integer, String, ForeignKey, Enum as SQLEnum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import enum

Base = declarative_base()

class TaskStatus(enum.Enum):
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"

class UserProfile(Base):
    __tablename__ = "user_profile"
    
    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(String, unique=True, nullable=False, index=True)  # Clerk user ID
    name = Column(String, nullable=False, default="John Doe")
    role = Column(String, nullable=False, default="Administrator")
    avatar_url = Column(String, nullable=True)

class Employee(Base):
    __tablename__ = "employees"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False, index=True)  # Removed unique=True for multi-tenancy
    role = Column(String, nullable=False)
    owner_id = Column(String, nullable=False, index=True)  # Clerk user ID
    
    tasks = relationship("Task", back_populates="employee", cascade="all, delete-orphan")
    
    # Composite unique constraint: email must be unique per owner
    __table_args__ = (
        {'sqlite_autoincrement': True},
    )

class Task(Base):
    __tablename__ = "tasks"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    status = Column(String, default="todo")
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=True)
    owner_id = Column(String, nullable=False, index=True)  # Clerk user ID
    
    employee = relationship("Employee", back_populates="tasks")
