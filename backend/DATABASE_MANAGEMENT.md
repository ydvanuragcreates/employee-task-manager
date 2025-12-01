# Database Management Guide

## Database File Location
- **Primary Database**: `sql_app.db` (in the backend directory)
- **Backup Directory**: `db_backups/` (created automatically)

## Common Issues and Solutions

### Issue: Data Disappears After Some Hours

**Possible Causes:**
1. **Multiple User Accounts**: The app uses multi-tenancy. Each Clerk user has their own data.
2. **Database File Deletion**: Something might be deleting the database file.
3. **Wrong Database File**: Multiple database files exist (check for `employee_task_management.db`).
4. **Server Restart**: If using a temporary hosting service, the database might be reset.

**Solutions:**

1. **Verify Database Integrity**:
   ```bash
   python verify_db.py
   ```

2. **Create Regular Backups**:
   ```bash
   python backup_db.py
   ```

3. **Restore from Backup**:
   ```bash
   python backup_db.py restore
   ```

4. **Check Database File**:
   - Ensure `sql_app.db` exists in the backend directory
   - Check file permissions (should be readable/writable)
   - Verify file size is not 0 bytes

5. **Always Use Same Clerk Account**:
   - Each user sees only their own data
   - Sign in with the same email every time

## Database Utilities

### verify_db.py
Checks database health and shows all data:
```bash
python verify_db.py
```

### backup_db.py
Creates a timestamped backup:
```bash
python backup_db.py
```

Restores the latest backup:
```bash
python backup_db.py restore
```

### check_db.py
Quick check of database contents:
```bash
python check_db.py
```

## API Health Check

Check if the database is connected:
```
GET http://localhost:8000/health
```

## Preventing Data Loss

1. **Regular Backups**: Run `python backup_db.py` daily
2. **Version Control**: Don't add `*.db` files to `.gitignore` if you want to commit them
3. **Use PostgreSQL**: For production, use PostgreSQL instead of SQLite
4. **Monitor Logs**: Check server logs for database errors

## Migration to PostgreSQL (Recommended for Production)

1. Install PostgreSQL
2. Create a database
3. Set environment variable:
   ```bash
   DATABASE_URL=postgresql://user:password@localhost/dbname
   ```
4. Restart the server - tables will be created automatically

## Troubleshooting

### Database is locked
- Close all connections to the database
- Restart the server
- Check if another process is using the file

### Data not persisting
- Check file permissions: `ls -la sql_app.db`
- Verify the correct database file is being used
- Check server logs for errors
- Run `python verify_db.py` to see actual data

### Multiple database files
- The app uses `sql_app.db` by default
- Delete old files like `employee_task_management.db` if not needed
- Check `DATABASE_URL` environment variable

## Support

If data continues to disappear:
1. Run `python verify_db.py` before and after the issue
2. Check server logs
3. Verify you're using the same Clerk account
4. Consider migrating to PostgreSQL for better reliability
