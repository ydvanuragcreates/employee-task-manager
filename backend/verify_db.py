"""
Script to verify database integrity and check for data persistence issues
"""
import os
from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import sessionmaker
from models import Employee, Task, UserProfile
from datetime import datetime

DB_FILE = "sql_app.db"

def check_database():
    print("=" * 60)
    print("DATABASE VERIFICATION REPORT")
    print("=" * 60)
    
    # Check if database file exists
    if not os.path.exists(DB_FILE):
        print(f"❌ ERROR: Database file '{DB_FILE}' does not exist!")
        return
    
    # Get file info
    file_size = os.path.getsize(DB_FILE)
    file_modified = datetime.fromtimestamp(os.path.getmtime(DB_FILE))
    
    print(f"\n📁 Database File: {DB_FILE}")
    print(f"📊 File Size: {file_size:,} bytes")
    print(f"🕐 Last Modified: {file_modified}")
    print(f"🔒 File Permissions: {oct(os.stat(DB_FILE).st_mode)[-3:]}")
    
    # Connect to database
    engine = create_engine(f'sqlite:///./{DB_FILE}')
    inspector = inspect(engine)
    
    # Check tables
    tables = inspector.get_table_names()
    print(f"\n📋 Tables Found: {', '.join(tables)}")
    
    # Check data
    Session = sessionmaker(bind=engine)
    session = Session()
    
    try:
        # Count records
        employee_count = session.query(Employee).count()
        task_count = session.query(Task).count()
        profile_count = session.query(UserProfile).count()
        
        print(f"\n📊 Data Summary:")
        print(f"   👥 Employees: {employee_count}")
        print(f"   📝 Tasks: {task_count}")
        print(f"   👤 Profiles: {profile_count}")
        
        # Show employees
        if employee_count > 0:
            print(f"\n👥 Employee Details:")
            employees = session.query(Employee).all()
            for emp in employees:
                print(f"   • ID: {emp.id} | Name: {emp.name} | Email: {emp.email}")
                print(f"     Owner: {emp.owner_id}")
        
        # Show tasks
        if task_count > 0:
            print(f"\n📝 Task Details:")
            tasks = session.query(Task).all()
            for task in tasks[:5]:  # Show first 5
                print(f"   • ID: {task.id} | Title: {task.title} | Status: {task.status}")
                print(f"     Owner: {task.owner_id}")
            if task_count > 5:
                print(f"   ... and {task_count - 5} more tasks")
        
        print("\n✅ Database verification complete!")
        
    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}")
    finally:
        session.close()
    
    print("=" * 60)

if __name__ == "__main__":
    check_database()
