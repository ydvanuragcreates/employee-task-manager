"""
Database monitoring script - Run this to track database changes
"""
import os
import time
from datetime import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Employee, Task, UserProfile

DB_FILE = "sql_app.db"
LOG_FILE = "db_monitor.log"

def log_message(message):
    """Log message to file and console"""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    log_entry = f"[{timestamp}] {message}"
    print(log_entry)
    with open(LOG_FILE, "a") as f:
        f.write(log_entry + "\n")

def get_counts():
    """Get current record counts"""
    if not os.path.exists(DB_FILE):
        return None, None, None
    
    engine = create_engine(f'sqlite:///./{DB_FILE}')
    Session = sessionmaker(bind=engine)
    session = Session()
    
    try:
        emp_count = session.query(Employee).count()
        task_count = session.query(Task).count()
        profile_count = session.query(UserProfile).count()
        return emp_count, task_count, profile_count
    except Exception as e:
        log_message(f"❌ Error reading database: {str(e)}")
        return None, None, None
    finally:
        session.close()

def monitor_database(interval=300):
    """Monitor database for changes every interval seconds (default 5 minutes)"""
    log_message("🔍 Starting database monitoring...")
    log_message(f"📊 Checking every {interval} seconds ({interval//60} minutes)")
    
    last_counts = get_counts()
    if last_counts[0] is not None:
        log_message(f"📈 Initial counts - Employees: {last_counts[0]}, Tasks: {last_counts[1]}, Profiles: {last_counts[2]}")
    
    try:
        while True:
            time.sleep(interval)
            
            # Check if database file exists
            if not os.path.exists(DB_FILE):
                log_message(f"⚠️  WARNING: Database file '{DB_FILE}' is missing!")
                last_counts = (None, None, None)
                continue
            
            # Get current counts
            current_counts = get_counts()
            
            if current_counts[0] is None:
                continue
            
            # Check for changes
            if last_counts != current_counts:
                emp_diff = current_counts[0] - (last_counts[0] or 0)
                task_diff = current_counts[1] - (last_counts[1] or 0)
                profile_diff = current_counts[2] - (last_counts[2] or 0)
                
                log_message(f"📊 Database changed!")
                log_message(f"   Employees: {last_counts[0]} → {current_counts[0]} ({emp_diff:+d})")
                log_message(f"   Tasks: {last_counts[1]} → {current_counts[1]} ({task_diff:+d})")
                log_message(f"   Profiles: {last_counts[2]} → {current_counts[2]} ({profile_diff:+d})")
                
                # Alert if data was deleted
                if emp_diff < 0 or task_diff < 0:
                    log_message("⚠️  WARNING: Data was deleted!")
                
                last_counts = current_counts
            else:
                log_message(f"✅ No changes - Employees: {current_counts[0]}, Tasks: {current_counts[1]}, Profiles: {current_counts[2]}")
    
    except KeyboardInterrupt:
        log_message("🛑 Monitoring stopped by user")

if __name__ == "__main__":
    import sys
    
    # Allow custom interval
    interval = 300  # 5 minutes default
    if len(sys.argv) > 1:
        try:
            interval = int(sys.argv[1])
        except:
            print("Usage: python monitor_db.py [interval_in_seconds]")
            sys.exit(1)
    
    monitor_database(interval)
