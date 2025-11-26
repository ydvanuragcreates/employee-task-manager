"""
Test script to verify Clerk authentication is working
"""
from fastapi import FastAPI, Depends
from auth import verify_clerk_token
import uvicorn

app = FastAPI()

@app.get("/test-auth")
def test_auth(auth_data: dict = Depends(verify_clerk_token)):
    return {
        "status": "success",
        "message": "Authentication is working!",
        "user_id": auth_data["user_id"],
        "email": auth_data.get("email", "N/A")
    }

@app.get("/test-no-auth")
def test_no_auth():
    return {"status": "success", "message": "No auth required"}

if __name__ == "__main__":
    print("Testing authentication...")
    print("Visit: http://localhost:8001/test-no-auth (should work)")
    print("Visit: http://localhost:8001/test-auth (requires auth)")
    uvicorn.run(app, host="0.0.0.0", port=8001)
