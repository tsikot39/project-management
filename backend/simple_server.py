"""
Simple FastAPI server - Quick Start Version
Run with: python simple_server.py
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(title="Project Management API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock data
projects = [
    {"id": 1, "name": "Website Redesign", "status": "active", "tasks": 12},
    {"id": 2, "name": "Mobile App", "status": "active", "tasks": 8},
    {"id": 3, "name": "API Documentation", "status": "completed", "tasks": 5},
]

tasks = [
    {"id": 1, "title": "Design Homepage", "status": "todo", "priority": "high", "project_id": 1},
    {"id": 2, "title": "Setup Database", "status": "in_progress", "priority": "medium", "project_id": 1},
    {"id": 3, "title": "Write Tests", "status": "done", "priority": "low", "project_id": 1},
]

@app.get("/")
async def root():
    return {"message": "Project Management API", "status": "running"}

@app.get("/api/projects")
async def get_projects():
    return {"success": True, "data": projects}

@app.get("/api/tasks")
async def get_tasks():
    return {"success": True, "data": tasks}

@app.post("/api/auth/login")
async def login(credentials: dict):
    return {
        "success": True,
        "data": {
            "user": {"id": 1, "name": "John Doe", "email": "john@example.com"},
            "token": "mock-jwt-token"
        }
    }

@app.get("/api/dashboard/stats")
async def dashboard_stats():
    return {
        "success": True,
        "data": {
            "active_projects": 12,
            "tasks_in_progress": 34,
            "completed_tasks": 89
        }
    }

if __name__ == "__main__":
    print("🚀 Starting Project Management API on http://localhost:8000")
    print("📖 API Docs: http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
