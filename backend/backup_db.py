"""
Database backup utility
Run this periodically to backup your database
"""
import shutil
import os
from datetime import datetime

DB_FILE = "sql_app.db"
BACKUP_DIR = "db_backups"

def backup_database():
    # Create backup directory if it doesn't exist
    os.makedirs(BACKUP_DIR, exist_ok=True)
    
    if not os.path.exists(DB_FILE):
        print(f"❌ Database file '{DB_FILE}' not found!")
        return False
    
    # Create backup filename with timestamp
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_file = os.path.join(BACKUP_DIR, f"sql_app_backup_{timestamp}.db")
    
    try:
        # Copy database file
        shutil.copy2(DB_FILE, backup_file)
        file_size = os.path.getsize(backup_file)
        print(f"✅ Database backed up successfully!")
        print(f"📁 Backup file: {backup_file}")
        print(f"📊 Size: {file_size:,} bytes")
        
        # Keep only last 10 backups
        cleanup_old_backups()
        
        return True
    except Exception as e:
        print(f"❌ Backup failed: {str(e)}")
        return False

def cleanup_old_backups(keep=10):
    """Keep only the most recent backups"""
    if not os.path.exists(BACKUP_DIR):
        return
    
    backups = [f for f in os.listdir(BACKUP_DIR) if f.endswith('.db')]
    backups.sort(reverse=True)
    
    # Remove old backups
    for old_backup in backups[keep:]:
        try:
            os.remove(os.path.join(BACKUP_DIR, old_backup))
            print(f"🗑️  Removed old backup: {old_backup}")
        except:
            pass

def restore_latest_backup():
    """Restore the most recent backup"""
    if not os.path.exists(BACKUP_DIR):
        print("❌ No backups found!")
        return False
    
    backups = [f for f in os.listdir(BACKUP_DIR) if f.endswith('.db')]
    if not backups:
        print("❌ No backup files found!")
        return False
    
    backups.sort(reverse=True)
    latest_backup = os.path.join(BACKUP_DIR, backups[0])
    
    try:
        # Backup current database before restoring
        if os.path.exists(DB_FILE):
            shutil.copy2(DB_FILE, f"{DB_FILE}.before_restore")
        
        # Restore backup
        shutil.copy2(latest_backup, DB_FILE)
        print(f"✅ Database restored from: {backups[0]}")
        return True
    except Exception as e:
        print(f"❌ Restore failed: {str(e)}")
        return False

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1 and sys.argv[1] == "restore":
        restore_latest_backup()
    else:
        backup_database()
