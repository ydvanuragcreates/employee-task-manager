"""
Fix email unique constraint for multi-tenancy
This removes the global unique constraint on email
"""
import sqlite3
import os

DB_PATH = "employee_task_management.db"

def fix_constraint():
    if not os.path.exists(DB_PATH):
        print("Database doesn't exist. It will be created when you start the app.")
        return
    
    print("Fixing email unique constraint...")
    print("This will recreate the employees table without global email uniqueness.")
    print()
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        # Check if employees table exists
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='employees'")
        if not cursor.fetchone():
            print("Employees table doesn't exist yet. No fix needed.")
            conn.close()
            return
        
        # Backup existing data
        cursor.execute("SELECT * FROM employees")
        employees = cursor.fetchall()
        
        print(f"Found {len(employees)} existing employees")
        
        # Get column names
        cursor.execute("PRAGMA table_info(employees)")
        columns = cursor.fetchall()
        print(f"Columns: {[col[1] for col in columns]}")
        
        # Drop old table
        cursor.execute("DROP TABLE IF EXISTS employees_old")
        cursor.execute("ALTER TABLE employees RENAME TO employees_old")
        print("✓ Backed up old table")
        
        # Create new table without unique constraint on email
        cursor.execute("""
            CREATE TABLE employees (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                role TEXT NOT NULL,
                owner_id TEXT NOT NULL
            )
        """)
        print("✓ Created new table structure")
        
        # Create indexes (drop if exists first)
        cursor.execute("DROP INDEX IF EXISTS idx_employees_email")
        cursor.execute("DROP INDEX IF EXISTS idx_employees_owner_id")
        cursor.execute("CREATE INDEX idx_employees_email ON employees(email)")
        cursor.execute("CREATE INDEX idx_employees_owner_id ON employees(owner_id)")
        print("✓ Created indexes")
        
        # Copy data back
        if employees:
            # Check if old table has owner_id
            cursor.execute("PRAGMA table_info(employees_old)")
            old_columns = [col[1] for col in cursor.fetchall()]
            
            if 'owner_id' in old_columns:
                cursor.execute("""
                    INSERT INTO employees (id, name, email, role, owner_id)
                    SELECT id, name, email, role, owner_id FROM employees_old
                """)
            else:
                # Old data doesn't have owner_id, set default
                cursor.execute("""
                    INSERT INTO employees (id, name, email, role, owner_id)
                    SELECT id, name, email, role, 'migration_user' FROM employees_old
                """)
            print(f"✓ Migrated {len(employees)} employees")
        
        # Drop old table
        cursor.execute("DROP TABLE employees_old")
        print("✓ Cleaned up old table")
        
        conn.commit()
        print("\n✅ Email constraint fixed successfully!")
        print("Now each user can have employees with the same email addresses.")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    print("=" * 60)
    print("Fix Email Unique Constraint for Multi-Tenancy")
    print("=" * 60)
    print()
    print("This will allow different users to have employees with")
    print("the same email addresses (proper multi-tenancy).")
    print()
    print("⚠️  Make sure the backend server is STOPPED!")
    print()
    
    response = input("Continue? (yes/no): ")
    if response.lower() == 'yes':
        fix_constraint()
    else:
        print("Cancelled.")
