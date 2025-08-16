"""
MongoDB-powered FastAPI Server
Compatible with your existing frontend
"""
import os
from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
import uvicorn

# MongoDB connection
MONGODB_URL = "mongodb+srv://tsikot39:n4w5rb@cluster0.3f8yqnc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
DATABASE_NAME = "project_management"

# Global database connection
client = None
db = None

app = FastAPI(title="Project Management API", version="2.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class Project(BaseModel):
    id: Optional[str] = None
    name: str
    description: Optional[str] = None
    status: str = "active"
    startDate: Optional[str] = None
    endDate: Optional[str] = None
    createdAt: Optional[str] = None
    updatedAt: Optional[str] = None

class Task(BaseModel):
    id: Optional[str] = None
    title: str
    description: Optional[str] = None
    status: str = "todo"
    priority: str = "medium"
    projectId: str
    assigneeId: Optional[str] = None
    dueDate: Optional[str] = None
    tags: List[str] = []
    createdAt: Optional[str] = None
    updatedAt: Optional[str] = None

class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None
    status: str = "active"
    startDate: Optional[str] = None
    endDate: Optional[str] = None

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    status: str = "todo"
    priority: str = "medium"
    projectId: str
    assigneeId: Optional[str] = None
    dueDate: Optional[str] = None
    tags: List[str] = []

# Database connection functions
async def connect_to_mongo():
    global client, db
    try:
        client = AsyncIOMotorClient(MONGODB_URL)
        db = client[DATABASE_NAME]
        # Test connection
        await client.admin.command('ping')
        print(f"✅ Connected to MongoDB Atlas database: {DATABASE_NAME}")
        
        # Create indexes
        await db.projects.create_index("name")
        await db.projects.create_index("status")
        await db.tasks.create_index("projectId")
        await db.tasks.create_index("status")
        await db.tasks.create_index("priority")
        
    except Exception as e:
        print(f"❌ Failed to connect to MongoDB: {e}")
        raise

async def close_mongo_connection():
    if client:
        client.close()
        print("✅ Disconnected from MongoDB")

# Startup and shutdown events
@app.on_event("startup")
async def startup_event():
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_event():
    await close_mongo_connection()

# Helper functions
def create_object_id():
    from bson import ObjectId
    return str(ObjectId())

def serialize_document(doc):
    if doc:
        doc["id"] = str(doc["_id"])
        del doc["_id"]
    return doc

# API Routes
@app.get("/")
async def root():
    return {"message": "Project Management API with MongoDB Atlas", "status": "running", "database": DATABASE_NAME}

@app.get("/api/projects")
async def get_projects():
    try:
        cursor = db.projects.find({})
        projects = await cursor.to_list(length=100)
        serialized_projects = [serialize_document(project) for project in projects]
        return {"success": True, "data": serialized_projects}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/projects")
async def create_project(project: ProjectCreate):
    try:
        project_doc = {
            "name": project.name,
            "description": project.description,
            "status": project.status,
            "startDate": project.startDate,
            "endDate": project.endDate,
            "createdAt": datetime.utcnow().isoformat(),
            "updatedAt": datetime.utcnow().isoformat()
        }
        
        result = await db.projects.insert_one(project_doc)
        project_doc["id"] = str(result.inserted_id)
        del project_doc["_id"]
        
        return {"success": True, "data": project_doc}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/projects/{project_id}")
async def get_project(project_id: str):
    try:
        from bson import ObjectId
        project = await db.projects.find_one({"_id": ObjectId(project_id)})
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        return {"success": True, "data": serialize_document(project)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/tasks")
async def get_tasks():
    try:
        cursor = db.tasks.find({})
        tasks = await cursor.to_list(length=100)
        serialized_tasks = [serialize_document(task) for task in tasks]
        return {"success": True, "data": serialized_tasks}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/tasks")
async def create_task(task: TaskCreate):
    try:
        task_doc = {
            "title": task.title,
            "description": task.description,
            "status": task.status,
            "priority": task.priority,
            "projectId": task.projectId,
            "assigneeId": task.assigneeId,
            "dueDate": task.dueDate,
            "tags": task.tags,
            "createdAt": datetime.utcnow().isoformat(),
            "updatedAt": datetime.utcnow().isoformat()
        }
        
        result = await db.tasks.insert_one(task_doc)
        task_doc["id"] = str(result.inserted_id)
        del task_doc["_id"]
        
        return {"success": True, "data": task_doc}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/tasks/{task_id}")
async def get_task(task_id: str):
    try:
        from bson import ObjectId
        task = await db.tasks.find_one({"_id": ObjectId(task_id)})
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")
        return {"success": True, "data": serialize_document(task)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/tasks/{task_id}")
async def update_task(task_id: str, task: TaskCreate):
    try:
        from bson import ObjectId
        
        update_doc = {
            "title": task.title,
            "description": task.description,
            "status": task.status,
            "priority": task.priority,
            "projectId": task.projectId,
            "assigneeId": task.assigneeId,
            "dueDate": task.dueDate,
            "tags": task.tags,
            "updatedAt": datetime.utcnow().isoformat()
        }
        
        result = await db.tasks.update_one(
            {"_id": ObjectId(task_id)},
            {"$set": update_doc}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Task not found")
        
        updated_task = await db.tasks.find_one({"_id": ObjectId(task_id)})
        return {"success": True, "data": serialize_document(updated_task)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/tasks/{task_id}")
async def delete_task(task_id: str):
    try:
        from bson import ObjectId
        result = await db.tasks.delete_one({"_id": ObjectId(task_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Task not found")
        return {"success": True, "message": "Task deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Auth endpoints (mock for now)
@app.post("/api/auth/login")
async def login():
    return {
        "success": True,
        "data": {
            "user": {"id": "1", "name": "John Doe", "email": "john@example.com"},
            "token": "mock-jwt-token"
        }
    }

@app.get("/api/users")
async def get_users():
    users = [
        {"id": "1", "name": "John Doe", "email": "john@example.com"},
        {"id": "2", "name": "Jane Smith", "email": "jane@example.com"},
        {"id": "3", "name": "Mike Johnson", "email": "mike@example.com"}
    ]
    return {"success": True, "data": users}

if __name__ == "__main__":
    print("🚀 Starting MongoDB Project Management Server...")
    print(f"📊 Database: {DATABASE_NAME}")
    print("🔗 Connecting to MongoDB Atlas...")
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=False)
