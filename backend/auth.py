from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
import requests
import os
from functools import lru_cache

security = HTTPBearer()

# Cache JWKS for 1 hour
@lru_cache(maxsize=1)
def get_jwks():
    """Fetch Clerk's JWKS (JSON Web Key Set)"""
    clerk_domain = os.getenv("CLERK_DOMAIN", "")
    if not clerk_domain:
        raise HTTPException(status_code=500, detail="CLERK_DOMAIN not configured")
    
    jwks_url = f"https://{clerk_domain}/.well-known/jwks.json"
    try:
        response = requests.get(jwks_url, timeout=10)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch JWKS: {str(e)}")

def verify_clerk_token(credentials: HTTPAuthorizationCredentials = Security(security)) -> dict:
    """
    Verify Clerk JWT token and return user information
    
    Args:
        credentials: HTTP Authorization credentials containing the Bearer token
        
    Returns:
        dict: Decoded token payload containing user_id and other claims
        
    Raises:
        HTTPException: If token is invalid or verification fails
    """
    token = credentials.credentials
    
    try:
        # Get JWKS
        try:
            jwks = get_jwks()
        except Exception as jwks_error:
            print(f"JWKS fetch error: {jwks_error}")
            raise HTTPException(
                status_code=500, 
                detail=f"Cannot verify tokens: {str(jwks_error)}"
            )
        
        # Decode token header to get the key ID (kid)
        try:
            unverified_header = jwt.get_unverified_header(token)
        except Exception as header_error:
            print(f"Token header error: {header_error}")
            raise HTTPException(status_code=401, detail="Invalid token format")
        
        kid = unverified_header.get("kid")
        
        if not kid:
            raise HTTPException(status_code=401, detail="Invalid token: missing kid")
        
        # Find the matching key in JWKS
        key = None
        for jwk_key in jwks.get("keys", []):
            if jwk_key.get("kid") == kid:
                key = jwk_key
                break
        
        if not key:
            raise HTTPException(status_code=401, detail="Invalid token: key not found")
        
        # Verify and decode the token
        clerk_domain = os.getenv("CLERK_DOMAIN", "")
        try:
            payload = jwt.decode(
                token,
                key,
                algorithms=["RS256"],
                audience=None,  # Clerk doesn't use audience claim by default
                issuer=f"https://{clerk_domain}"
            )
        except Exception as decode_error:
            print(f"Token decode error: {decode_error}")
            raise HTTPException(status_code=401, detail=f"Invalid token: {str(decode_error)}")
        
        # Extract user_id (Clerk uses 'sub' claim for user ID)
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token: missing user ID")
        
        return {
            "user_id": user_id,
            "email": payload.get("email"),
            "payload": payload
        }
        
    except HTTPException:
        raise
    except JWTError as e:
        print(f"JWT Error: {e}")
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")
    except Exception as e:
        print(f"Unexpected error in token verification: {e}")
        raise HTTPException(status_code=500, detail=f"Token verification failed: {str(e)}")

# Optional: Dependency for getting current user ID only
def get_current_user_id(auth_data: dict = Security(verify_clerk_token)) -> str:
    """Extract just the user_id from verified token"""
    return auth_data["user_id"]
