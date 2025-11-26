"""
Optional authentication - for debugging only
Use this temporarily to bypass auth and test if the issue is with Clerk
"""
from fastapi import HTTPException, Security, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional

security = HTTPBearer(auto_error=False)

def verify_clerk_token_optional(
    credentials: Optional[HTTPAuthorizationCredentials] = Security(security)
) -> dict:
    """
    Optional authentication - returns a test user if no token provided
    WARNING: Only use for debugging!
    """
    if not credentials:
        # Return test user for debugging
        return {
            "user_id": "test_user_123",
            "email": "test@example.com",
            "payload": {}
        }
    
    # If token provided, try to verify it
    from auth import verify_clerk_token
    return verify_clerk_token(credentials)
