from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import Employee
from schemas import Employee as EmployeeSchema, EmployeeCreate, EmployeeUpdate
from auth import verify_clerk_token

router = APIRouter()

@router.get("/", response_model=List[EmployeeSchema])
def get_employees(
    db: Session = Depends(get_db),
    auth_data: dict = Depends(verify_clerk_token)
):
    user_id = auth_data["user_id"]
    employees = db.query(Employee).filter(Employee.owner_id == user_id).all()
    print(f"🔍 User {user_id} fetching employees: Found {len(employees)} employees")
    return employees

@router.get("/{employee_id}", response_model=EmployeeSchema)
def get_employee(
    employee_id: int,
    db: Session = Depends(get_db),
    auth_data: dict = Depends(verify_clerk_token)
):
    user_id = auth_data["user_id"]
    employee = db.query(Employee).filter(
        Employee.id == employee_id,
        Employee.owner_id == user_id
    ).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee

@router.post("/", response_model=EmployeeSchema)
def create_employee(
    employee: EmployeeCreate,
    db: Session = Depends(get_db),
    auth_data: dict = Depends(verify_clerk_token)
):
    user_id = auth_data["user_id"]
    print(f"➕ User {user_id} creating employee: {employee.name} ({employee.email})")
    
    # Check if email already exists for this user
    existing = db.query(Employee).filter(
        Employee.email == employee.email,
        Employee.owner_id == user_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create employee with owner_id
    employee_data = employee.model_dump()
    employee_data["owner_id"] = user_id
    db_employee = Employee(**employee_data)
    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)
    print(f"✅ Employee created successfully with ID: {db_employee.id}")
    return db_employee

@router.put("/{employee_id}", response_model=EmployeeSchema)
def update_employee(
    employee_id: int,
    employee: EmployeeUpdate,
    db: Session = Depends(get_db),
    auth_data: dict = Depends(verify_clerk_token)
):
    user_id = auth_data["user_id"]
    db_employee = db.query(Employee).filter(
        Employee.id == employee_id,
        Employee.owner_id == user_id
    ).first()
    if not db_employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    update_data = employee.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_employee, key, value)
    
    db.commit()
    db.refresh(db_employee)
    return db_employee

@router.delete("/{employee_id}")
def delete_employee(
    employee_id: int,
    db: Session = Depends(get_db),
    auth_data: dict = Depends(verify_clerk_token)
):
    user_id = auth_data["user_id"]
    db_employee = db.query(Employee).filter(
        Employee.id == employee_id,
        Employee.owner_id == user_id
    ).first()
    if not db_employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    db.delete(db_employee)
    db.commit()
    return {"message": "Employee deleted successfully"}
