import uvicorn

if __name__ == "__main__":
    print("🚀 Starting FastAPI server on http://localhost:8000")
    print("📝 API docs available at http://localhost:8000/docs")
    print("Press CTRL+C to stop the server\n")
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
