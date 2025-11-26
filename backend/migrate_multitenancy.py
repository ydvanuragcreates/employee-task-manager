"""
Migration script to add owner_id column to existing tables
Run this after stopping the backend server
"""
import sqlite3
import os

DB_PATH = "employee_task_management.db"

def migrate():
    if not os.path.exists(DB_PATH):
        print("Database doesn't exist. Run the app first to create it.")
        return
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        # Check if owner_id already exists in employees table
        cursor.execute("PRAGMA table_info(employees)")
        columns = [col[1] for col in cursor.fetchall()]
        
        if 'owner_id' not in columns:
            print("Adding owner_id to employees table...")
            cursor.execute("ALTER TABLE employees ADD COLUMN owner_id TEXT DEFAULT 'migration_user'")
            cursor.execute("CREATE INDEX idx_employees_owner_id ON employees(owner_id)")
            print("✓ employees table migrated")
        else:
            print("✓ employees table already has owner_id")
        
        # Check if owner_id already exists in tasks table
        cursor.execute("PRAGMA table_info(tasks)")
        columns = [col[1] for col in cursor.fetchall()]
        
        if 'owner_id' not in columns:
            print("Adding owner_id to tasks table...")
            cursor.execute("ALTER TABLE tasks ADD COLUMN owner_id TEXT DEFAULT 'migration_user'")
            cursor.execute("CREATE INDEX idx_tasks_owner_id ON tasks(owner_id)")
            print("✓ tasks table migrated")
        else:
            print("✓ tasks table already has owner_id")
        
        # Check if owner_id already exists in user_profile table
        cursor.execute("PRAGMA table_info(user_profile)")
        columns = [col[1] for col in cursor.fetchall()]
        
        if 'owner_id' not in columns:
            print("Adding owner_id to user_profile table...")
            cursor.execute("ALTER TABLE user_profile ADD COLUMN owner_id TEXT DEFAULT 'migration_user'")
            cursor.execute("CREATE UNIQUE INDEX idx_user_profile_owner_id ON user_profile(owner_id)")
            print("✓ user_profile table migrated")
        else:
            print("✓ user_profile table already has owner_id")
        
        conn.commit()
        print("\n✅ Migration completed successfully!")
        print("\nNote: Existing data has owner_id='migration_user'")
        print("New data will use the actual Clerk user ID")
        
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    print("=" * 50)
    print("Multi-Tenancy Migration Script")
    print("=" * 50)
    print("\nThis will add owner_id columns to your database.")
    print("Make sure the backend server is STOPPED before running this.\n")
    
    response = input("Continue? (yes/no): ")
    if response.lower() == 'yes':
        migrate()
    else:
        print("Migration cancelled.")
