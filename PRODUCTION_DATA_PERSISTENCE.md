# ⚠️ CRITICAL: Production Data Persistence Guide

## Current Situation

### ✅ Local Development
- **Database**: SQLite (`sql_app.db` file)
- **Location**: `backend/sql_app.db`
- **Persistence**: ✅ YES - Data persists between restarts
- **Your Data**: 5 employees, 2 tasks (verified)

### ⚠️ Production Deployment (Render)

**CRITICAL ISSUE**: If you're using SQLite on Render, **YOUR DATA WILL BE LOST** on every deployment or server restart!

## Why Data Loss Happens on Render

### Render's Ephemeral Filesystem
```
┌─────────────────────────────────────┐
│  Render Server (Ephemeral Storage)  │
├─────────────────────────────────────┤
│  Your App Starts                    │
│  ├── Creates sql_app.db             │
│  ├── You add data                   │
│  └── Data exists ✅                 │
│                                     │
│  Server Restarts (every 15 min)    │
│  ├── Filesystem wiped               │
│  ├── sql_app.db deleted             │
│  └── All data LOST ❌              │
└─────────────────────────────────────┘
```

### When Data Loss Occurs
1. ❌ **Every deployment** (new code push)
2. ❌ **Server restarts** (Render free tier: every 15 minutes of inactivity)
3. ❌ **Server crashes**
4. ❌ **Scaling events**
5. ❌ **Maintenance windows**

## ✅ SOLUTION: Use PostgreSQL on Render

### Why PostgreSQL?
- ✅ **Persistent storage** - Data survives restarts
- ✅ **Separate service** - Independent of your app
- ✅ **Automatic backups** - Render handles this
- ✅ **Production-ready** - Designed for this
- ✅ **Free tier available** - 90 days free

## Step-by-Step: Migrate to PostgreSQL

### Step 1: Create PostgreSQL Database on Render

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Click "New +"** → Select "PostgreSQL"
3. **Configure Database**:
   - Name: `employee-task-db`
   - Database: `employee_task_db`
   - User: `employee_task_user`
   - Region: Same as your web service
   - Plan: Free (or Starter for production)
4. **Click "Create Database"**
5. **Copy the Internal Database URL** (starts with `postgres://`)

### Step 2: Update Backend Environment Variables

1. **Go to your Render Web Service**
2. **Navigate to "Environment"**
3. **Add/Update Variable**:
   ```
   Key: DATABASE_URL
   Value: [paste the Internal Database URL from Step 1]
   ```
4. **Save Changes** (this will trigger a redeploy)

### Step 3: Verify Database Configuration

Your `backend/database.py` already handles PostgreSQL! ✅

```python
# This code automatically detects PostgreSQL
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./sql_app.db")

# Fixes Render's postgres:// to postgresql://
if SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql://", 1)
```

### Step 4: Install PostgreSQL Driver

Your `requirements.txt` already has it! ✅

```
psycopg2-binary  # PostgreSQL driver
```

### Step 5: Deploy and Test

1. **Push to GitHub** (if using auto-deploy)
2. **Or manually deploy** on Render
3. **Wait for deployment** to complete
4. **Test your app**:
   - Sign in
   - Add an employee
   - Add a task
   - Wait 20 minutes (or redeploy)
   - Sign in again
   - ✅ Data should still be there!

## Verification Checklist

### Before Migration (SQLite on Render)
- [ ] Data exists after adding
- [ ] ❌ Data lost after 15 minutes
- [ ] ❌ Data lost after redeployment
- [ ] ❌ Data lost after server restart

### After Migration (PostgreSQL on Render)
- [ ] Data exists after adding
- [ ] ✅ Data persists after 15 minutes
- [ ] ✅ Data persists after redeployment
- [ ] ✅ Data persists after server restart
- [ ] ✅ Data persists indefinitely

## Current Database Configuration

### Local Development
```bash
# .env (local)
DATABASE_URL=sqlite:///./sql_app.db
```

### Production (Render) - MUST UPDATE
```bash
# Environment Variables on Render
DATABASE_URL=postgresql://user:password@host:5432/database
```

## How to Check Current Setup

### Method 1: Check Render Environment Variables
1. Go to Render Dashboard
2. Select your web service
3. Click "Environment"
4. Look for `DATABASE_URL`
5. **If it's not set or contains "sqlite"** → ❌ Data will be lost
6. **If it contains "postgresql"** → ✅ Data will persist

### Method 2: Check Application Logs
1. Go to Render Dashboard
2. Select your web service
3. Click "Logs"
4. Look for database connection messages
5. **If you see "sqlite"** → ❌ Using ephemeral storage
6. **If you see "postgresql"** → ✅ Using persistent storage

## Data Migration (If You Have Existing Data)

### Export from Local SQLite
```bash
cd backend
python -c "
from database import engine
from models import Employee, Task
from sqlalchemy.orm import sessionmaker
import json

Session = sessionmaker(bind=engine)
session = Session()

# Export employees
employees = session.query(Employee).all()
emp_data = [{'name': e.name, 'email': e.email, 'role': e.role, 'owner_id': e.owner_id} for e in employees]

# Export tasks
tasks = session.query(Task).all()
task_data = [{'title': t.title, 'description': t.description, 'status': t.status, 'employee_id': t.employee_id, 'owner_id': t.owner_id} for t in tasks]

with open('backup.json', 'w') as f:
    json.dump({'employees': emp_data, 'tasks': task_data}, f, indent=2)

print('✅ Data exported to backup.json')
"
```

### Import to PostgreSQL (After Migration)
```bash
# Set DATABASE_URL to your PostgreSQL connection
export DATABASE_URL="postgresql://user:password@host:5432/database"

python -c "
from database import engine, init_db
from models import Employee, Task
from sqlalchemy.orm import sessionmaker
import json

# Initialize tables
init_db()

Session = sessionmaker(bind=engine)
session = Session()

# Load backup
with open('backup.json', 'r') as f:
    data = json.load(f)

# Import employees
for emp in data['employees']:
    session.add(Employee(**emp))

# Import tasks
for task in data['tasks']:
    session.add(Task(**task))

session.commit()
print('✅ Data imported successfully')
"
```

## Cost Considerations

### Render PostgreSQL Pricing
- **Free Tier**: 90 days free, then $7/month
  - 256 MB RAM
  - 1 GB Storage
  - Good for development/testing

- **Starter**: $7/month
  - 256 MB RAM
  - 1 GB Storage
  - Automatic backups
  - Good for small production apps

- **Standard**: $20/month
  - 1 GB RAM
  - 10 GB Storage
  - Daily backups
  - Better performance

### Alternative: External PostgreSQL
- **Supabase**: Free tier with 500 MB
- **ElephantSQL**: Free tier with 20 MB
- **Railway**: Free tier with 1 GB
- **Neon**: Free tier with 3 GB

## Testing Data Persistence

### Test Script
```bash
# 1. Add data to your production app
# 2. Note the employee/task IDs
# 3. Wait 20 minutes (Render free tier timeout)
# 4. Check if data still exists
# 5. Redeploy your app
# 6. Check if data still exists
```

### Expected Results

**With SQLite (Current - BAD)**:
```
Add data → ✅ Exists
Wait 20 min → ❌ Lost
Redeploy → ❌ Lost
```

**With PostgreSQL (After Migration - GOOD)**:
```
Add data → ✅ Exists
Wait 20 min → ✅ Still exists
Redeploy → ✅ Still exists
Wait 1 week → ✅ Still exists
```

## Immediate Action Required

### Priority: HIGH 🔴

1. **Check Current Setup**:
   ```bash
   # Check Render environment variables
   # Look for DATABASE_URL
   ```

2. **If Using SQLite**:
   - ⚠️ Your production data WILL BE LOST
   - 🚨 Migrate to PostgreSQL IMMEDIATELY
   - 📋 Follow steps above

3. **If Using PostgreSQL**:
   - ✅ You're good!
   - 💾 Data will persist
   - 🎉 No action needed

## Summary

### Current Status
- ✅ **Local**: Data persists (SQLite file)
- ❌ **Production**: Data likely lost on restart (if using SQLite)

### Required Action
1. Create PostgreSQL database on Render
2. Update `DATABASE_URL` environment variable
3. Redeploy application
4. Test data persistence

### After Migration
- ✅ Data persists between restarts
- ✅ Data persists between deployments
- ✅ Data persists indefinitely
- ✅ Automatic backups (on paid plans)

## Questions?

### Q: How do I know if I'm using PostgreSQL?
**A**: Check Render environment variables for `DATABASE_URL`. If it contains "postgresql", you're good!

### Q: Will I lose my current production data?
**A**: If you're on SQLite, it's already being lost on every restart. Migrate ASAP!

### Q: How long does migration take?
**A**: 5-10 minutes to set up, 2-3 minutes to deploy.

### Q: Is PostgreSQL harder to use?
**A**: No! Your code already supports it. Just change the environment variable.

### Q: What about local development?
**A**: Keep using SQLite locally. PostgreSQL is only for production.

## Need Help?

1. Check Render documentation: https://render.com/docs/databases
2. Check your Render dashboard environment variables
3. Review the deployment logs for database connection messages

---

**⚠️ IMPORTANT**: If you haven't migrated to PostgreSQL yet, your production data is being lost on every server restart. Migrate immediately to ensure data persistence!
