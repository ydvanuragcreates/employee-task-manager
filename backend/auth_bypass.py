"""
TEMPORARY AUTH BYPASS - FOR TESTING ONLY
This bypasses Clerk authentication so you can test the app
DO NOT USE IN PRODUCTION!
"""
from fastapi import Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional

security = HTTPBearer(auto_error=False)

def verify_clerk_token(credentials: Optional[HTTPAuthorizationCredentials] = Security(security)) -> dict:
    """
    Bypass authentication for testing
    Returns a test user regardless of token
    """
    print("⚠️  WARNING: Using auth bypass - authentication is disabled!")
    return {
        "user_id": "test_user_123",
        "email": "test@example.com",
        "payload": {}
    }

# Optional: Helper to get just user ID
def get_current_user_id(auth_data: dict = Security(verify_clerk_token)) -> str:
    """Extract just the user_id from verified token"""
    return auth_data["user_id"]
