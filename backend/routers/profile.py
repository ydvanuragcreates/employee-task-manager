from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from database import get_db
from models import UserProfile
from schemas import UserProfile as UserProfileSchema, UserProfileUpdate
from auth import verify_clerk_token
import os
import shutil
from pathlib import Path
import uuid

router = APIRouter()

# Create uploads directory if it doesn't exist
UPLOAD_DIR = Path("uploads/avatars")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

@router.get("/", response_model=UserProfileSchema)
def get_profile(
    db: Session = Depends(get_db),
    auth_data: dict = Depends(verify_clerk_token)
):
    """Get the user profile (creates default if doesn't exist)"""
    user_id = auth_data["user_id"]
    profile = db.query(UserProfile).filter(UserProfile.owner_id == user_id).first()
    if not profile:
        # Create default profile for this user
        profile = UserProfile(
            owner_id=user_id,
            name=auth_data.get("email", "User").split("@")[0].title(),
            role="User",
            avatar_url=None
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile

@router.put("/", response_model=UserProfileSchema)
def update_profile(
    profile_update: UserProfileUpdate,
    db: Session = Depends(get_db),
    auth_data: dict = Depends(verify_clerk_token)
):
    """Update user profile"""
    user_id = auth_data["user_id"]
    profile = db.query(UserProfile).filter(UserProfile.owner_id == user_id).first()
    if not profile:
        # Create if doesn't exist
        profile = UserProfile(
            owner_id=user_id,
            name=profile_update.name or "User",
            role=profile_update.role or "User",
            avatar_url=profile_update.avatar_url
        )
        db.add(profile)
    else:
        # Update existing
        if profile_update.name is not None:
            profile.name = profile_update.name
        if profile_update.role is not None:
            profile.role = profile_update.role
        if profile_update.avatar_url is not None:
            profile.avatar_url = profile_update.avatar_url
    
    db.commit()
    db.refresh(profile)
    return profile

@router.post("/upload-avatar")
async def upload_avatar(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    auth_data: dict = Depends(verify_clerk_token)
):
    """Upload profile avatar image"""
    user_id = auth_data["user_id"]
    
    # Validate file type
    allowed_types = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Invalid file type. Only images are allowed.")
    
    # Generate unique filename
    file_extension = file.filename.split(".")[-1]
    unique_filename = f"{uuid.uuid4()}.{file_extension}"
    file_path = UPLOAD_DIR / unique_filename
    
    # Save file
    try:
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")
    
    # Update profile with new avatar URL
    profile = db.query(UserProfile).filter(UserProfile.owner_id == user_id).first()
    if not profile:
        profile = UserProfile(owner_id=user_id, name="User", role="User")
        db.add(profile)
    
    # Delete old avatar if exists
    if profile.avatar_url:
        old_file = Path(profile.avatar_url)
        if old_file.exists():
            try:
                old_file.unlink()
            except:
                pass
    
    profile.avatar_url = str(file_path)
    db.commit()
    db.refresh(profile)
    
    return {"avatar_url": str(file_path), "message": "Avatar uploaded successfully"}

@router.delete("/avatar")
def delete_avatar(
    db: Session = Depends(get_db),
    auth_data: dict = Depends(verify_clerk_token)
):
    """Delete profile avatar"""
    user_id = auth_data["user_id"]
    profile = db.query(UserProfile).filter(UserProfile.owner_id == user_id).first()
    if not profile or not profile.avatar_url:
        raise HTTPException(status_code=404, detail="No avatar to delete")
    
    # Delete file
    file_path = Path(profile.avatar_url)
    if file_path.exists():
        try:
            file_path.unlink()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to delete file: {str(e)}")
    
    profile.avatar_url = None
    db.commit()
    
    return {"message": "Avatar deleted successfully"}
