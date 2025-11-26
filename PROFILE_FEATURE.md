# User Profile Feature

## Overview
The user profile feature allows you to customize your name, role, and profile picture in the Employee & Task Hub application.

## Features
- ✅ Edit your name and role
- ✅ Upload custom profile picture (JPG, PNG, GIF, WebP)
- ✅ Remove profile picture
- ✅ Real-time avatar preview
- ✅ Automatic initials display when no photo is uploaded

## How to Use

### 1. Access Your Profile
- Click on your profile avatar in the top-right corner of the navbar
- The profile modal will open

### 2. Edit Your Information
- **Name**: Update your full name
- **Role**: Update your job title/role
- **Profile Picture**: 
  - Click "Upload Photo" to select an image
  - Supported formats: JPG, PNG, GIF, WebP
  - Max file size: 5MB
  - Click "Remove" to delete the current photo

### 3. Save Changes
- Click "Save Changes" to apply your updates
- Your profile will be updated across the application

## Technical Details

### Backend
- **New Table**: `user_profile` (stores name, role, avatar_url)
- **New Endpoints**:
  - `GET /api/profile` - Get current profile
  - `PUT /api/profile` - Update profile
  - `POST /api/profile/upload-avatar` - Upload avatar image
  - `DELETE /api/profile/avatar` - Delete avatar
- **File Storage**: Avatars stored in `backend/uploads/avatars/`

### Frontend
- **New Component**: `ProfileModal.jsx` - Profile editing interface
- **Updated Component**: `App.jsx` - Integrated profile display and editing
- **New API**: `profileAPI` - Profile management functions

## Migration
The database migration has been completed automatically. The `user_profile` table is now available.

## Default Profile
- Name: John Doe
- Role: Administrator
- Avatar: None (shows initials)
