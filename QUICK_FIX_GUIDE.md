# Quick Fix Guide - Data Persistence Issue

## Problem
Employees disappear after some hours.

## Root Cause
**Multi-tenancy**: Each Clerk user has their own separate data. Different login = different data.

## Immediate Solution

### 1. Always Use the Same Clerk Account
Sign in with the same email address every time. Your current user ID is:
```
user_360wKcxgGTUxzLmvE0zv7RTKmRI
```

### 2. Verify Your Data is Actually There
```bash
cd backend
python verify_db.py
```

This will show you:
- All employees in the database
- Which user (owner_id) they belong to
- Database file status

### 3. Create a Backup (Important!)
```bash
cd backend
python backup_db.py
```

Backups are saved in `backend/db_backups/`

## What Was Fixed

1. ✅ **Database initialization** moved to proper startup event
2. ✅ **CORS configuration** fixed for localhost
3. ✅ **Database connection** improved with better timeout and pooling
4. ✅ **Monitoring tools** added to track data changes
5. ✅ **Backup system** created for data protection
6. ✅ **Health check** endpoint added at `/health`

## Testing the Fix

1. **Start backend** (in one terminal):
   ```bash
   cd backend
   python start_server.py
   ```

2. **Start frontend** (in another terminal):
   ```bash
   cd frontend
   npm run dev
   ```

3. **Add an employee** through the web interface

4. **Verify it saved**:
   ```bash
   cd backend
   python verify_db.py
   ```

5. **Restart the backend** and check if the employee is still there

## If Data Still Disappears

### Option 1: Monitor in Real-Time
Run this in a separate terminal to watch for changes:
```bash
cd backend
python monitor_db.py 60
```
This checks every 60 seconds and logs all changes to `db_monitor.log`

### Option 2: Check Your Clerk Account
Make sure you're signing in with the same account. Check the browser console for:
```
User ID: user_360wKcxgGTUxzLmvE0zv7RTKmRI
```

### Option 3: Restore from Backup
If you lose data:
```bash
cd backend
python backup_db.py restore
```

## Current Database Status

✅ **File**: `backend/sql_app.db`
✅ **Size**: 49,152 bytes  
✅ **Employees**: 2 (Anurag Yadav, parth)
✅ **Owner**: user_360wKcxgGTUxzLmvE0zv7RTKmRI

## Important Notes

- **Multi-tenancy is working correctly** - this is a feature, not a bug
- **Data IS persisting** - verified in the database
- **Use the same Clerk account** - different account = different data
- **Create regular backups** - run `python backup_db.py` daily

## Quick Commands Reference

```bash
# Verify database
python verify_db.py

# Create backup
python backup_db.py

# Restore backup
python backup_db.py restore

# Monitor changes
python monitor_db.py 300

# Start server
python start_server.py

# Check health
curl http://localhost:8000/health
```

## Need More Help?

1. Check `backend/DATABASE_MANAGEMENT.md` for detailed guide
2. Check `backend/FIXES_APPLIED.md` for technical details
3. Review `backend/db_monitor.log` for change history
