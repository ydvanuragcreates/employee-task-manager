"""
Migration script to add user_profile table
"""
from database import engine
from models import Base, UserProfile

def migrate():
    print("Creating user_profile table...")
    Base.metadata.create_all(bind=engine, tables=[UserProfile.__table__])
    print("Migration completed successfully!")

if __name__ == "__main__":
    migrate()
