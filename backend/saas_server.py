"""
SaaS Project Management Platform - Multi-tenant FastAPI Server
Features: Authentication, Organizations, Subscriptions, Multi-tenancy
"""
import os
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any
import secrets
import string
from fastapi import FastAPI, HTTPException, Depends, Header, status, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr
import uvicorn
import jwt
import bcrypt
from websocket_manager import websocket_manager
from email_service import email_service
from bson import ObjectId

# Load environment variables
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    # dotenv not installed, use system environment variables
    pass

# MongoDB connection
MONGODB_URL = "mongodb+srv://tsikot39:n4w5rb@cluster0.3f8yqnc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
DATABASE_NAME = "project_management_saas"

# JWT Configuration  
SECRET_KEY = "saas-super-secret-jwt-key-change-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Global database connection
client = None
db = None

app = FastAPI(title="SaaS Project Management API", version="3.0.0")
security = HTTPBearer()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001", 
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# SaaS Plan Configuration
PLAN_LIMITS = {
    "free": {
        "max_users": 5,
        "max_projects": 3,
        "max_storage_mb": 100,
        "price": 0,
        "features": ["5 team members", "3 projects", "100MB storage", "Basic support"]
    },
    "starter": {
        "max_users": 15,
        "max_projects": 25,
        "max_storage_mb": 1000,
        "price": 9.99,
        "features": ["15 team members", "25 projects", "1GB storage", "Priority support", "Time tracking"]
    },
    "professional": {
        "max_users": 50,
        "max_projects": 100,
        "max_storage_mb": 10000,
        "price": 24.99,
        "features": ["50 team members", "100 projects", "10GB storage", "Analytics", "API access"]
    },
    "enterprise": {
        "max_users": -1,  # Unlimited
        "max_projects": -1,
        "max_storage_mb": -1,
        "price": 49.99,
        "features": ["Unlimited everything", "SSO", "Custom branding", "Dedicated support"]
    }
}

# Pydantic Models
class UserSignup(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    password: str
    organization_name: str
    organization_slug: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class OrganizationCreate(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None

class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None
    status: str = "active"
    start_date: Optional[str] = None
    end_date: Optional[str] = None

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    status: str = "todo"
    priority: str = "medium"
    project_id: str
    assignee_id: Optional[str] = None
    due_date: Optional[str] = None
    tags: List[str] = []

# Helper Functions
def create_object_id():
    return str(ObjectId())

def serialize_document(doc):
    if doc and "_id" in doc:
        doc["id"] = str(doc["_id"])
        del doc["_id"]
    return doc

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def verify_password(password: str, hashed) -> bool:
    # Handle both string and bytes for the hashed password
    if isinstance(hashed, str):
        hashed = hashed.encode('utf-8')
    return bcrypt.checkpw(password.encode('utf-8'), hashed)

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_token(token: str) -> Dict[str, Any]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expired"
        )
    except jwt.JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = decode_token(token)
    user_id = payload.get("sub")
    
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    return {
        "id": str(user["_id"]),
        "email": user["email"],
        "first_name": user["first_name"],
        "last_name": user["last_name"]
    }

async def get_user_organization(org_slug: str, user_id: str):
    org = await db.organizations.find_one({"slug": org_slug})
    if not org:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found"
        )
    
    membership = await db.organization_members.find_one({
        "organization_id": str(org["_id"]),
        "user_id": user_id
    })
    
    if not membership:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    org["id"] = str(org["_id"])
    del org["_id"]
    return org, membership["role"]

# Database Functions
async def connect_to_mongo():
    global client, db
    try:
        client = AsyncIOMotorClient(MONGODB_URL)
        db = client[DATABASE_NAME]
        await client.admin.command('ping')
        print(f"Connected to MongoDB Atlas database: {DATABASE_NAME}")
        
        # Create indexes
        await db.users.create_index("email", unique=True)
        await db.organizations.create_index("slug", unique=True)
        await db.organization_members.create_index([("organization_id", 1), ("user_id", 1)])
        await db.projects.create_index("organization_id")
        await db.tasks.create_index("organization_id")
        await db.tasks.create_index("project_id")
        await db.tasks.create_index("assigned_to")
        await db.invitations.create_index([("organization_id", 1), ("email", 1)])
        await db.tasks.create_index("organization_id")
        await db.tasks.create_index("project_id")
        
        print("Database indexes created")
        
    except Exception as e:
        print(f"❌ Failed to connect to MongoDB: {e}")
        raise

async def close_mongo_connection():
    if client:
        client.close()
        print("Disconnected from MongoDB")

# Startup and shutdown events
@app.on_event("startup")
async def startup_event():
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_event():
    await close_mongo_connection()

# Routes
@app.get("/")
async def root():
    return {
        "message": "SaaS Project Management Platform", 
        "status": "running", 
        "database": DATABASE_NAME,
        "features": ["Multi-tenancy", "Subscriptions", "Organizations", "Authentication"]
    }

# Authentication Routes
@app.post("/api/auth/signup")
async def signup(user_data: UserSignup):
    """Sign up new user and create organization"""
    # Check if user exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )
    
    # Check if organization slug is available
    existing_org = await db.organizations.find_one({"slug": user_data.organization_slug})
    if existing_org:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Organization slug already taken"
        )
    
    # Create user
    user_doc = {
        "email": user_data.email,
        "first_name": user_data.first_name,
        "last_name": user_data.last_name,
        "password_hash": hash_password(user_data.password),
        "is_verified": False,
        "is_active": True,
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    }
    
    user_result = await db.users.insert_one(user_doc)
    user_id = str(user_result.inserted_id)
    
    # Create organization
    org_doc = {
        "name": user_data.organization_name,
        "slug": user_data.organization_slug,
        "plan_type": "free",
        "max_users": 5,
        "max_projects": 3,
        "max_storage_mb": 100,
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    }
    
    org_result = await db.organizations.insert_one(org_doc)
    org_id = str(org_result.inserted_id)
    
    # Add user as owner
    membership_doc = {
        "organization_id": org_id,
        "user_id": user_id,
        "role": "owner",
        "joined_at": datetime.utcnow().isoformat(),
        "created_at": datetime.utcnow().isoformat()
    }
    
    await db.organization_members.insert_one(membership_doc)
    
    # Create token
    token = create_access_token({"sub": user_id})
    
    return {
        "success": True,
        "data": {
            "user": {
                "id": user_id,
                "email": user_data.email,
                "first_name": user_data.first_name,
                "last_name": user_data.last_name
            },
            "organization": {
                "id": org_id,
                "name": user_data.organization_name,
                "slug": user_data.organization_slug,
                "plan_type": "free"
            },
            "access_token": token,
            "token_type": "bearer"
        }
    }

@app.post("/api/auth/login")
async def login(credentials: UserLogin):
    """Authenticate user"""
    user = await db.users.find_one({"email": credentials.email})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Get password field - handle both field names for compatibility
    stored_password = user.get("password_hash") or user.get("password")
    if not stored_password:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="User password not properly configured"
        )
    
    if not verify_password(credentials.password, stored_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Get user's organizations
    memberships = await db.organization_members.find({"user_id": str(user["_id"])}).to_list(length=100)
    organizations = []
    primary_organization = None
    
    for membership in memberships:
        org = await db.organizations.find_one({"_id": ObjectId(membership["organization_id"])})
        if org:
            org_data = {
                "id": str(org["_id"]),
                "name": org["name"],
                "slug": org["slug"],
                "subscription_plan": org["plan_type"],
                "role": membership["role"]
            }
            organizations.append(org_data)
            # Use the first organization as primary (or could be based on role)
            if primary_organization is None:
                primary_organization = org_data
    
    if not primary_organization:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No organization found for this user"
        )
    
    token = create_access_token({"sub": str(user["_id"])})
    
    return {
        "success": True,
        "data": {
            "user": {
                "id": str(user["_id"]),
                "email": user["email"],
                "first_name": user["first_name"],
                "last_name": user["last_name"]
            },
            "organization": primary_organization,
            "organizations": organizations,
            "access_token": token,
            "token_type": "bearer"
        }
    }

@app.get("/api/auth/me")
async def get_me(current_user = Depends(get_current_user)):
    """Get current user info"""
    return {"success": True, "data": current_user}

# Password Reset Models
class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

def generate_reset_token():
    """Generate a secure random token for password reset"""
    return ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(32))

@app.post("/api/auth/forgot-password")
async def forgot_password(request: ForgotPasswordRequest):
    """Send password reset email"""
    user = await db.users.find_one({"email": request.email})
    
    if not user:
        # Don't reveal if email exists or not for security
        return {"success": True, "message": "If your email is registered, you will receive a password reset link."}
    
    # Generate reset token
    reset_token = generate_reset_token()
    reset_token_expires = datetime.utcnow() + timedelta(hours=1)  # Token expires in 1 hour
    
    # Save reset token to database
    await db.users.update_one(
        {"_id": user["_id"]},
        {"$set": {
            "reset_token": reset_token,
            "reset_token_expires": reset_token_expires,
            "updated_at": datetime.utcnow()
        }}
    )
    
    # Send password reset email
    await email_service.send_password_reset_email(
        to_email=user["email"],
        user_name=f"{user['first_name']} {user['last_name']}",
        reset_token=reset_token
    )
    
    return {"success": True, "message": "If your email is registered, you will receive a password reset link."}

@app.post("/api/auth/reset-password")
async def reset_password(request: ResetPasswordRequest):
    """Reset password using token"""
    user = await db.users.find_one({
        "reset_token": request.token,
        "reset_token_expires": {"$gt": datetime.utcnow()}
    })
    
    if not user:
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired reset token"
        )
    
    # Validate password strength
    if len(request.new_password) < 6:
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 6 characters long"
        )
    
    # Hash new password and clear reset token
    new_password_hash = hash_password(request.new_password)
    
    await db.users.update_one(
        {"_id": user["_id"]},
        {"$set": {
            "password_hash": new_password_hash,
            "updated_at": datetime.utcnow()
        },
        "$unset": {
            "reset_token": "",
            "reset_token_expires": ""
        }}
    )
    
    return {"success": True, "message": "Password has been reset successfully. You can now log in with your new password."}

# SaaS Management Routes
@app.get("/api/plans")
async def get_plans():
    """Get available subscription plans"""
    plans = []
    for plan_type, details in PLAN_LIMITS.items():
        plans.append({
            "id": plan_type,
            "name": plan_type.title(),
            "price": details["price"],
            "max_users": details["max_users"],
            "max_projects": details["max_projects"],
            "max_storage_mb": details["max_storage_mb"],
            "features": details["features"]
        })
    
    return {"success": True, "data": plans}

# Organization-scoped Routes (Multi-tenant)
@app.get("/api/{org_slug}/dashboard")
async def get_dashboard(org_slug: str, current_user = Depends(get_current_user)):
    """Get organization dashboard data"""
    org, user_role = await get_user_organization(org_slug, current_user["id"])
    
    # Get detailed statistics
    total_projects = await db.projects.count_documents({"organization_id": org["id"]})
    
    # Count active projects (case-insensitive search for active status)
    active_projects = await db.projects.count_documents({
        "organization_id": org["id"], 
        "status": {"$regex": "^active$", "$options": "i"}
    })
    completed_projects = await db.projects.count_documents({
        "organization_id": org["id"], 
        "status": {"$regex": "^completed$", "$options": "i"}
    })
    
    # Get tasks count
    total_tasks = await db.tasks.count_documents({"organization_id": org["id"]})
    
    # Debug: Let's see what tasks and statuses exist
    all_tasks = await db.tasks.find({"organization_id": org["id"]}).to_list(length=None)
    print(f"DEBUG Dashboard: Found {len(all_tasks)} tasks for org {org['id']}")
    for task in all_tasks:
        print(f"DEBUG Dashboard: Task '{task.get('title')}' has status '{task.get('status')}'")
    
    completed_tasks = await db.tasks.count_documents({
        "organization_id": org["id"], 
        "status": {"$in": ["completed", "done"]}
    })
    
    print(f"DEBUG Dashboard: completed_tasks count: {completed_tasks}")
    print(f"DEBUG Dashboard: total_tasks count: {total_tasks}")
    
    # Get recent projects
    recent_projects_cursor = db.projects.find({"organization_id": org["id"]}).sort("created_at", -1).limit(5)
    recent_projects = await recent_projects_cursor.to_list(length=5)
    recent_projects = [serialize_document(project) for project in recent_projects]
    
    return {
        "success": True,
        "data": {
            "organization": org,
            "user_role": user_role,
            "stats": {
                "members": await db.organization_members.count_documents({"organization_id": org["id"]}),
                "projects": total_projects,
                "tasks": total_tasks
            },
            # Add the detailed stats that the frontend expects
            "total_projects": total_projects,
            "active_projects": active_projects,
            "completed_projects": completed_projects,
            "total_tasks": total_tasks,
            "completed_tasks": completed_tasks,
            "recent_projects": recent_projects,
            "plan_limits": PLAN_LIMITS.get(org.get("plan_type", "free"))
        }
    }

@app.get("/api/{org_slug}/projects")
async def get_organization_projects(org_slug: str, current_user = Depends(get_current_user)):
    """Get projects for organization"""
    org, user_role = await get_user_organization(org_slug, current_user["id"])
    
    cursor = db.projects.find({"organization_id": org["id"]})
    projects = await cursor.to_list(length=100)
    serialized_projects = [serialize_document(project) for project in projects]
    
    return {"success": True, "data": serialized_projects}

@app.post("/api/{org_slug}/projects")
async def create_organization_project(org_slug: str, project: ProjectCreate, current_user = Depends(get_current_user)):
    """Create project in organization"""
    org, user_role = await get_user_organization(org_slug, current_user["id"])
    
    # Check project limit
    current_projects = await db.projects.count_documents({"organization_id": org["id"]})
    plan_limits = PLAN_LIMITS.get(org.get("plan_type", "free"))
    
    if plan_limits["max_projects"] != -1 and current_projects >= plan_limits["max_projects"]:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail="Project limit reached. Please upgrade your plan."
        )
    
    project_doc = {
        "organization_id": org["id"],
        "name": project.name,
        "description": project.description,
        "status": project.status,
        "owner_id": current_user["id"],
        "start_date": project.start_date,
        "end_date": project.end_date,
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    }
    
    result = await db.projects.insert_one(project_doc)
    project_doc["id"] = str(result.inserted_id)
    del project_doc["_id"]
    
    return {"success": True, "data": project_doc}

@app.put("/api/{org_slug}/projects/{project_id}")
async def update_organization_project(org_slug: str, project_id: str, project: ProjectCreate, current_user = Depends(get_current_user)):
    """Update project in organization"""
    org, user_role = await get_user_organization(org_slug, current_user["id"])
    
    # Check if project exists and belongs to organization
    try:
        project_object_id = ObjectId(project_id)
    except Exception:
        raise HTTPException(status_code=404, detail="Project not found")
    
    existing_project = await db.projects.find_one({
        "_id": project_object_id, 
        "organization_id": org["id"]
    })
    
    if not existing_project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Update project
    update_doc = {
        "name": project.name,
        "description": project.description,
        "status": project.status,
        "start_date": project.start_date,
        "end_date": project.end_date,
        "updated_at": datetime.utcnow().isoformat()
    }
    
    await db.projects.update_one(
        {"_id": project_object_id, "organization_id": org["id"]},
        {"$set": update_doc}
    )
    
    # Get updated project
    updated_project = await db.projects.find_one({"_id": project_object_id})
    updated_project = serialize_document(updated_project)
    
    return {"success": True, "data": updated_project}

@app.delete("/api/{org_slug}/projects/{project_id}")
async def delete_organization_project(org_slug: str, project_id: str, current_user = Depends(get_current_user)):
    """Delete project in organization"""
    org, user_role = await get_user_organization(org_slug, current_user["id"])
    
    print(f"DEBUG: Attempting to delete project {project_id} for org {org['id']}")
    
    # Check if project exists and belongs to organization
    try:
        project_object_id = ObjectId(project_id)
        print(f"DEBUG: Converted to ObjectId: {project_object_id}")
    except Exception as e:
        print(f"DEBUG: Failed to convert to ObjectId: {e}")
        raise HTTPException(status_code=404, detail="Project not found")
    
    # First, let's check if the project exists at all
    project = await db.projects.find_one({"_id": project_object_id})
    print(f"DEBUG: Project found (any org): {project is not None}")
    
    if project:
        print(f"DEBUG: Project organization_id: {project.get('organization_id')}")
        print(f"DEBUG: Expected organization_id: {org['id']}")
        print(f"DEBUG: Types match: {type(project.get('organization_id'))} == {type(org['id'])}")
    
    project = await db.projects.find_one({
        "_id": project_object_id, 
        "organization_id": org["id"]
    })
    
    print(f"DEBUG: Project found (correct org): {project is not None}")
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Delete associated tasks first
    await db.tasks.delete_many({"project_id": project_id, "organization_id": org["id"]})
    
    # Delete the project
    await db.projects.delete_one({"_id": project_object_id, "organization_id": org["id"]})
    
    print(f"DEBUG: Project deleted successfully")
    
    return {"success": True, "message": "Project deleted successfully"}

@app.get("/api/{org_slug}/tasks")
async def get_organization_tasks(org_slug: str, current_user = Depends(get_current_user)):
    """Get tasks for organization"""
    org, user_role = await get_user_organization(org_slug, current_user["id"])
    
    cursor = db.tasks.find({"organization_id": org["id"]})
    tasks = await cursor.to_list(length=100)
    serialized_tasks = [serialize_document(task) for task in tasks]
    
    return {"success": True, "data": serialized_tasks}

@app.post("/api/{org_slug}/tasks")
async def create_organization_task(org_slug: str, task: TaskCreate, current_user = Depends(get_current_user)):
    """Create task in organization"""
    org, user_role = await get_user_organization(org_slug, current_user["id"])
    
    # Verify project belongs to organization
    project = await db.projects.find_one({
        "_id": ObjectId(task.project_id),
        "organization_id": org["id"]
    })
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    task_doc = {
        "organization_id": org["id"],
        "project_id": task.project_id,
        "title": task.title,
        "description": task.description,
        "status": task.status,
        "priority": task.priority,
        "assignee_id": task.assignee_id,
        "created_by": current_user["id"],
        "due_date": task.due_date,
        "tags": task.tags,
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    }
    
    result = await db.tasks.insert_one(task_doc)
    task_doc["id"] = str(result.inserted_id)
    del task_doc["_id"]
    
    # Broadcast real-time update
    await broadcast_update(org["id"], "task_created", {
        "task": task_doc,
        "project_id": task.project_id
    })
    
    return {"success": True, "data": task_doc}

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    assignee_id: Optional[str] = None
    due_date: Optional[str] = None
    tags: Optional[List[str]] = None

@app.put("/api/{org_slug}/tasks/{task_id}")
async def update_task(org_slug: str, task_id: str, task_update: TaskUpdate, current_user = Depends(get_current_user)):
    """Update a task"""
    org, user_role = await get_user_organization(org_slug, current_user["id"])
    
    # Check if task exists and belongs to organization
    try:
        task = await db.tasks.find_one({
            "_id": ObjectId(task_id),
            "organization_id": org["id"]
        })
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid task ID format")
    
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Build update document
    update_data = {}
    if task_update.title is not None:
        update_data["title"] = task_update.title
    if task_update.description is not None:
        update_data["description"] = task_update.description
    if task_update.status is not None:
        update_data["status"] = task_update.status
    if task_update.priority is not None:
        update_data["priority"] = task_update.priority
    if task_update.assignee_id is not None:
        update_data["assigned_to"] = task_update.assignee_id
    if task_update.due_date is not None:
        update_data["due_date"] = task_update.due_date
    if task_update.tags is not None:
        update_data["tags"] = task_update.tags
    
    if update_data:
        update_data["updated_at"] = datetime.utcnow()
        await db.tasks.update_one(
            {"_id": ObjectId(task_id)},
            {"$set": update_data}
        )
    
    # Get updated task
    updated_task = await db.tasks.find_one({"_id": ObjectId(task_id)})
    updated_task["id"] = str(updated_task["_id"])
    del updated_task["_id"]
    
    # Broadcast real-time update
    await broadcast_update(org["id"], "task_updated", {
        "task": updated_task
    })
    
    return {"success": True, "data": updated_task}

# Project-specific task endpoints
@app.get("/api/{org_slug}/projects/{project_id}/tasks")
async def get_project_tasks(org_slug: str, project_id: str, current_user = Depends(get_current_user)):
    """Get tasks for a specific project"""
    org, user_role = await get_user_organization(org_slug, current_user["id"])
    
    # Verify project exists and user has access
    project = await db.projects.find_one({
        "_id": ObjectId(project_id),
        "organization_id": org["id"]
    })
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    cursor = db.tasks.find({
        "organization_id": org["id"], 
        "project_id": project_id
    })
    tasks = await cursor.to_list(length=100)
    serialized_tasks = [serialize_document(task) for task in tasks]
    
    return {"success": True, "data": serialized_tasks}

@app.post("/api/{org_slug}/projects/{project_id}/tasks")
async def create_project_task(org_slug: str, project_id: str, task: TaskCreate, current_user = Depends(get_current_user)):
    """Create task in a specific project"""
    org, user_role = await get_user_organization(org_slug, current_user["id"])
    
    # Verify project exists and user has access
    project = await db.projects.find_one({
        "_id": ObjectId(project_id),
        "organization_id": org["id"]
    })
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    task_doc = {
        "title": task.title,
        "description": task.description or "",
        "status": task.status,
        "priority": task.priority,
        "project_id": project_id,  # Automatically assign to this project
        "organization_id": org["id"],
        "created_by": current_user["id"],
        "assigned_to": task.assignee_id,
        "due_date": task.due_date,
        "tags": task.tags or [],
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    result = await db.tasks.insert_one(task_doc)
    task_doc["id"] = str(result.inserted_id)
    del task_doc["_id"]
    
    # Broadcast real-time update
    await broadcast_update(org["id"], "task_created", {
        "task": task_doc,
        "project_id": project_id
    })
    
    return {"success": True, "data": task_doc}

@app.get("/api/{org_slug}/members")
async def get_organization_members(org_slug: str, current_user = Depends(get_current_user)):
    """Get organization members"""
    org, user_role = await get_user_organization(org_slug, current_user["id"])
    
    members = []
    async for membership in db.organization_members.find({"organization_id": org["id"]}):
        user = await db.users.find_one({"_id": ObjectId(membership["user_id"])})
        if user:
            members.append({
                "id": str(user["_id"]),
                "email": user["email"],
                "first_name": user["first_name"],
                "last_name": user["last_name"],
                "role": membership["role"],
                "status": "active",
                "joined_date": membership.get("joined_at", datetime.utcnow()).isoformat(),
                "last_active": datetime.utcnow().isoformat()
            })
    
    # Get pending invitations
    invited_users = []
    async for invite in db.invitations.find({"organization_id": org["id"], "status": "pending"}):
        invited_users.append({
            "id": str(invite["_id"]),
            "email": invite["email"],
            "role": invite["role"],
            "invited_date": invite.get("created_at", datetime.utcnow()).isoformat(),
            "invited_by": invite.get("invited_by_name", "Unknown"),
            "status": "pending"
        })
    
    return {"success": True, "data": {"members": members, "invitations": invited_users}}

class InviteMemberRequest(BaseModel):
    email: EmailStr
    role: str
    message: Optional[str] = ""

@app.post("/api/{org_slug}/members/invite")
async def invite_member(org_slug: str, request: InviteMemberRequest, current_user = Depends(get_current_user)):
    """Invite a new member to the organization"""
    org, user_role = await get_user_organization(org_slug, current_user["id"])
    
    # Check permissions (only admin and owner can invite)
    if user_role not in ["admin", "owner"]:
        raise HTTPException(status_code=403, detail="Insufficient permissions to invite members")
    
    # Check if user already exists
    existing_user = await db.users.find_one({"email": request.email})
    if existing_user:
        # Check if already a member
        existing_membership = await db.organization_members.find_one({
            "organization_id": org["id"], 
            "user_id": str(existing_user["_id"])
        })
        if existing_membership:
            raise HTTPException(status_code=400, detail="User is already a member of this organization")
    
    # Check if already invited
    existing_invite = await db.invitations.find_one({
        "organization_id": org["id"],
        "email": request.email,
        "status": "pending"
    })
    if existing_invite:
        raise HTTPException(status_code=400, detail="User has already been invited")
    
    # Create invitation
    invitation = {
        "organization_id": org["id"],
        "email": request.email,
        "role": request.role,
        "message": request.message,
        "invited_by": current_user["id"],
        "invited_by_name": f"{current_user['first_name']} {current_user['last_name']}",
        "status": "pending",
        "created_at": datetime.utcnow()
    }
    
    result = await db.invitations.insert_one(invitation)
    invitation["id"] = str(result.inserted_id)
    del invitation["_id"]
    
    # Send email invitation
    await email_service.send_invitation_email(
        to_email=request.email,
        organization_name=org["name"],
        invited_by=f"{current_user['first_name']} {current_user['last_name']}",
        role=request.role,
        message=request.message
    )
    
    # Broadcast real-time update
    await broadcast_update(org["id"], "member_invited", {
        "invitation": invitation
    })
    
    return {"success": True, "data": invitation}

class UpdateMemberRoleRequest(BaseModel):
    role: str

@app.put("/api/{org_slug}/members/{member_id}/role")
async def update_member_role(org_slug: str, member_id: str, request: UpdateMemberRoleRequest, current_user = Depends(get_current_user)):
    """Update a member's role"""
    org, user_role = await get_user_organization(org_slug, current_user["id"])
    
    # Check permissions
    if user_role not in ["admin", "owner"]:
        raise HTTPException(status_code=403, detail="Insufficient permissions to update member roles")
    
    # Cannot change owner role
    member_membership = await db.organization_members.find_one({
        "organization_id": org["id"],
        "user_id": member_id
    })
    
    if not member_membership:
        raise HTTPException(status_code=404, detail="Member not found")
    
    if member_membership["role"] == "owner":
        raise HTTPException(status_code=400, detail="Cannot change owner role")
    
    # Update role
    await db.organization_members.update_one(
        {"organization_id": org["id"], "user_id": member_id},
        {"$set": {"role": request.role, "updated_at": datetime.utcnow()}}
    )
    
    return {"success": True, "message": "Member role updated successfully"}

@app.delete("/api/{org_slug}/members/{member_id}")
async def remove_member(org_slug: str, member_id: str, current_user = Depends(get_current_user)):
    """Remove a member from the organization"""
    org, user_role = await get_user_organization(org_slug, current_user["id"])
    
    # Check permissions
    if user_role not in ["admin", "owner"]:
        raise HTTPException(status_code=403, detail="Insufficient permissions to remove members")
    
    # Cannot remove owner
    member_membership = await db.organization_members.find_one({
        "organization_id": org["id"],
        "user_id": member_id
    })
    
    if not member_membership:
        raise HTTPException(status_code=404, detail="Member not found")
    
    if member_membership["role"] == "owner":
        raise HTTPException(status_code=400, detail="Cannot remove organization owner")
    
    # Remove member
    await db.organization_members.delete_one({
        "organization_id": org["id"],
        "user_id": member_id
    })
    
    return {"success": True, "message": "Member removed successfully"}

@app.delete("/api/{org_slug}/invitations/{invitation_id}")
async def cancel_invitation(org_slug: str, invitation_id: str, current_user = Depends(get_current_user)):
    """Cancel a pending invitation"""
    org, user_role = await get_user_organization(org_slug, current_user["id"])
    
    if user_role not in ["admin", "owner"]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    
    result = await db.invitations.delete_one({
        "_id": ObjectId(invitation_id),
        "organization_id": org["id"],
        "status": "pending"
    })
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Invitation not found")
    
    return {"success": True, "message": "Invitation cancelled"}

# Settings APIs
class UserSettingsRequest(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    timezone: Optional[str] = None
    language: Optional[str] = None

@app.get("/api/{org_slug}/settings/profile")
async def get_user_settings(org_slug: str, current_user = Depends(get_current_user)):
    """Get user profile settings"""
    org, user_role = await get_user_organization(org_slug, current_user["id"])
    
    user_settings = {
        "first_name": current_user.get("first_name", ""),
        "last_name": current_user.get("last_name", ""),
        "email": current_user.get("email", ""),
        "phone": current_user.get("phone", ""),
        "timezone": current_user.get("timezone", "America/New_York"),
        "language": current_user.get("language", "en")
    }
    
    return {"success": True, "data": user_settings}

@app.put("/api/{org_slug}/settings/profile")
async def update_user_settings(org_slug: str, request: UserSettingsRequest, current_user = Depends(get_current_user)):
    """Update user profile settings"""
    org, user_role = await get_user_organization(org_slug, current_user["id"])
    
    update_data = {}
    if request.first_name is not None:
        update_data["first_name"] = request.first_name
    if request.last_name is not None:
        update_data["last_name"] = request.last_name
    if request.email is not None:
        update_data["email"] = request.email
    if request.phone is not None:
        update_data["phone"] = request.phone
    if request.timezone is not None:
        update_data["timezone"] = request.timezone
    if request.language is not None:
        update_data["language"] = request.language
    
    if update_data:
        update_data["updated_at"] = datetime.utcnow()
        await db.users.update_one(
            {"_id": ObjectId(current_user["id"])},
            {"$set": update_data}
        )
    
    return {"success": True, "message": "Profile updated successfully"}

class OrganizationSettingsRequest(BaseModel):
    name: Optional[str] = None
    website: Optional[str] = None
    description: Optional[str] = None
    industry: Optional[str] = None
    size: Optional[str] = None

@app.get("/api/{org_slug}/settings/organization")
async def get_organization_settings(org_slug: str, current_user = Depends(get_current_user)):
    """Get organization settings"""
    org, user_role = await get_user_organization(org_slug, current_user["id"])
    
    org_settings = {
        "name": org.get("name", ""),
        "website": org.get("website", ""),
        "description": org.get("description", ""),
        "industry": org.get("industry", ""),
        "size": org.get("size", "")
    }
    
    return {"success": True, "data": org_settings}

@app.put("/api/{org_slug}/settings/organization")
async def update_organization_settings(org_slug: str, request: OrganizationSettingsRequest, current_user = Depends(get_current_user)):
    """Update organization settings"""
    org, user_role = await get_user_organization(org_slug, current_user["id"])
    
    # Only admin and owner can update org settings
    if user_role not in ["admin", "owner"]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    
    update_data = {}
    if request.name is not None:
        update_data["name"] = request.name
    if request.website is not None:
        update_data["website"] = request.website
    if request.description is not None:
        update_data["description"] = request.description
    if request.industry is not None:
        update_data["industry"] = request.industry
    if request.size is not None:
        update_data["size"] = request.size
    
    if update_data:
        update_data["updated_at"] = datetime.utcnow()
        await db.organizations.update_one(
            {"_id": ObjectId(org["id"])},
            {"$set": update_data}
        )
    
    return {"success": True, "message": "Organization settings updated successfully"}

class NotificationSettingsRequest(BaseModel):
    email_notifications: bool
    push_notifications: bool

@app.get("/api/{org_slug}/settings/notifications")
async def get_notification_settings(org_slug: str, current_user = Depends(get_current_user)):
    """Get user notification settings"""
    org, user_role = await get_user_organization(org_slug, current_user["id"])
    
    # Get user from database
    user = await db.users.find_one({"_id": ObjectId(current_user["id"])})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    notification_settings = {
        "email_notifications": user.get("notification_settings", {}).get("email_notifications", True),
        "push_notifications": user.get("notification_settings", {}).get("push_notifications", True),
    }
    
    return {"success": True, "data": notification_settings}

@app.put("/api/{org_slug}/settings/notifications")
async def update_notification_settings(org_slug: str, request: NotificationSettingsRequest, current_user = Depends(get_current_user)):
    """Update user notification settings"""
    org, user_role = await get_user_organization(org_slug, current_user["id"])
    
    # Get user from database
    user = await db.users.find_one({"_id": ObjectId(current_user["id"])})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update notification settings
    notification_settings = {
        "email_notifications": request.email_notifications,
        "push_notifications": request.push_notifications,
    }
    
    update_data = {
        "notification_settings": notification_settings,
        "updated_at": datetime.utcnow()
    }
    
    await db.users.update_one(
        {"_id": ObjectId(current_user["id"])},
        {"$set": update_data}
    )
    
    return {"success": True, "message": "Notification settings updated successfully"}

class PasswordChangeRequest(BaseModel):
    current_password: str
    new_password: str

@app.options("/api/{org_slug}/settings/password")
async def change_password_options(org_slug: str):
    """Handle preflight OPTIONS request for password change"""
    from fastapi.responses import JSONResponse
    return JSONResponse(
        content={"message": "OK"},
        headers={
            "Access-Control-Allow-Origin": "http://localhost:3000",
            "Access-Control-Allow-Methods": "PUT, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Credentials": "true",
        }
    )

@app.put("/api/{org_slug}/settings/password")
async def change_password(org_slug: str, request: PasswordChangeRequest, current_user = Depends(get_current_user)):
    """Change user password"""
    from fastapi.responses import JSONResponse
    
    try:
        _, user_role = await get_user_organization(org_slug, current_user["id"])
        
        # Get user from database
        user = await db.users.find_one({"_id": ObjectId(current_user["id"])})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Verify current password
        stored_password = user.get("password_hash") or user.get("password")
        if not stored_password:
            raise HTTPException(status_code=500, detail="User password not properly configured")
            
        # Ensure stored_password is bytes for bcrypt
        if isinstance(stored_password, str):
            stored_password = stored_password.encode('utf-8')
            
        if not bcrypt.checkpw(request.current_password.encode('utf-8'), stored_password):
            raise HTTPException(status_code=400, detail="Current password is incorrect")
        
        # Hash new password
        hashed_password = bcrypt.hashpw(request.new_password.encode('utf-8'), bcrypt.gensalt())
        
        # Update password - try both field names for compatibility
        update_fields = {"updated_at": datetime.utcnow()}
        if "password_hash" in user:
            update_fields["password_hash"] = hashed_password
        else:
            update_fields["password"] = hashed_password
            
        await db.users.update_one(
            {"_id": ObjectId(current_user["id"])},
            {"$set": update_fields}
        )
        
        return JSONResponse(
            content={"success": True, "message": "Password updated successfully"},
            headers={
                "Access-Control-Allow-Origin": "http://localhost:3000",
                "Access-Control-Allow-Credentials": "true",
            }
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.options("/api/{org_slug}/settings/account")
async def options_delete_account(org_slug: str):
    """CORS preflight for delete account endpoint"""
    from fastapi.responses import Response
    return Response(
        headers={
            "Access-Control-Allow-Origin": "http://localhost:3000",
            "Access-Control-Allow-Methods": "DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Credentials": "true",
        }
    )

@app.delete("/api/{org_slug}/settings/account")
async def delete_account(org_slug: str, current_user = Depends(get_current_user)):
    """Delete user account and all associated data"""
    from fastapi.responses import JSONResponse
    
    try:
        org, user_role = await get_user_organization(org_slug, current_user["id"])
        user_id = ObjectId(current_user["id"])
        
        # Check if user is the only admin of the organization
        if user_role == "admin":
            admin_count = await db.organization_members.count_documents({
                "organization_id": org["_id"],
                "role": "admin",
                "status": "active"
            })
            if admin_count <= 1:
                # If this is the only admin, delete the entire organization
                await delete_organization_and_data(org["_id"])
            else:
                # Remove user from organization but keep the org
                await delete_user_from_organization(user_id, org["_id"])
        else:
            # Regular user - just remove from organization
            await delete_user_from_organization(user_id, org["_id"])
        
        # Check if user is a member of any other organizations
        other_memberships = await db.organization_members.count_documents({
            "user_id": user_id,
            "status": "active"
        })
        
        if other_memberships == 0:
            # User has no other organizations, delete user account
            await db.users.delete_one({"_id": user_id})
        
        return JSONResponse(
            content={"success": True, "message": "Account deleted successfully"},
            headers={
                "Access-Control-Allow-Origin": "http://localhost:3000",
                "Access-Control-Allow-Credentials": "true",
            }
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def delete_user_from_organization(user_id: ObjectId, org_id: ObjectId):
    """Remove user from organization and clean up their data"""
    # Remove user from organization
    await db.organization_members.delete_one({
        "user_id": user_id,
        "organization_id": org_id
    })
    
    # Remove user assignments from tasks
    await db.tasks.update_many(
        {"organization_id": org_id, "assigned_to": user_id},
        {"$unset": {"assigned_to": ""}}
    )
    
    # Remove user from project members
    await db.projects.update_many(
        {"organization_id": org_id},
        {"$pull": {"members": {"user_id": user_id}}}
    )

async def delete_organization_and_data(org_id: ObjectId):
    """Delete entire organization and all associated data"""
    # Delete all projects in the organization
    await db.projects.delete_many({"organization_id": org_id})
    
    # Delete all tasks in the organization
    await db.tasks.delete_many({"organization_id": org_id})
    
    # Delete all organization members
    await db.organization_members.delete_many({"organization_id": org_id})
    
    # Delete the organization itself
    await db.organizations.delete_one({"_id": org_id})

# Reports APIs
@app.get("/api/{org_slug}/reports/overview")
async def get_reports_overview(org_slug: str, timeframe: str = "30d", current_user = Depends(get_current_user)):
    """Get overview statistics for reports"""
    org, user_role = await get_user_organization(org_slug, current_user["id"])
    
    # Calculate date range based on timeframe
    now = datetime.utcnow()
    if timeframe == "7d":
        start_date = now - timedelta(days=7)
    elif timeframe == "90d":
        start_date = now - timedelta(days=90)
    elif timeframe == "1y":
        start_date = now - timedelta(days=365)
    else:  # default 30d
        start_date = now - timedelta(days=30)
    
    # Get projects count
    total_projects = await db.projects.count_documents({"organization_id": org["id"]})
    
    # Debug: Let's see what projects and statuses exist
    all_projects = await db.projects.find({"organization_id": org["id"]}).to_list(length=None)
    print(f"DEBUG Dashboard: Found {len(all_projects)} projects for org {org['id']}")
    for project in all_projects:
        print(f"DEBUG Dashboard: Project '{project.get('name')}' has status '{project.get('status')}'")
    
    # Count active projects (case-insensitive search for active status)
    active_projects = await db.projects.count_documents({
        "organization_id": org["id"], 
        "status": {"$regex": "^active$", "$options": "i"}
    })
    completed_projects = await db.projects.count_documents({
        "organization_id": org["id"], 
        "status": {"$regex": "^completed$", "$options": "i"}
    })
    
    print(f"DEBUG Dashboard: active_projects count: {active_projects}")
    print(f"DEBUG Dashboard: total_projects count: {total_projects}")
    
    # Get tasks count
    total_tasks = await db.tasks.count_documents({"organization_id": org["id"]})
    completed_tasks = await db.tasks.count_documents({
        "organization_id": org["id"], 
        "status": "completed"
    })
    overdue_tasks = await db.tasks.count_documents({
        "organization_id": org["id"], 
        "due_date": {"$lt": now},
        "status": {"$ne": "completed"}
    })
    
    # Get team members count
    team_members = await db.organization_members.count_documents({"organization_id": org["id"]})
    
    return {"success": True, "data": {
        "total_projects": total_projects,
        "active_projects": active_projects,
        "completed_projects": completed_projects,
        "total_tasks": total_tasks,
        "completed_tasks": completed_tasks,
        "overdue_tasks": overdue_tasks,
        "team_members": team_members,
        "avg_completion_time": "3.2 days"  # TODO: Calculate actual average
    }}

@app.get("/api/{org_slug}/reports/projects")
async def get_project_reports(org_slug: str, current_user = Depends(get_current_user)):
    """Get project performance reports"""
    org, user_role = await get_user_organization(org_slug, current_user["id"])
    
    project_stats = []
    async for project in db.projects.find({"organization_id": org["id"]}):
        total_tasks = await db.tasks.count_documents({"project_id": str(project["_id"])})
        completed_tasks = await db.tasks.count_documents({
            "project_id": str(project["_id"]), 
            "status": "completed"
        })
        overdue_tasks = await db.tasks.count_documents({
            "project_id": str(project["_id"]), 
            "due_date": {"$lt": datetime.utcnow()},
            "status": {"$ne": "completed"}
        })
        
        completion_rate = (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0
        
        project_stats.append({
            "name": project["name"],
            "total_tasks": total_tasks,
            "completed_tasks": completed_tasks,
            "overdue_tasks": overdue_tasks,
            "completion_rate": round(completion_rate, 1)
        })
    
    return {"success": True, "data": project_stats}

@app.get("/api/{org_slug}/reports/team")
async def get_team_reports(org_slug: str, current_user = Depends(get_current_user)):
    """Get team performance reports"""
    org, user_role = await get_user_organization(org_slug, current_user["id"])
    
    team_stats = []
    async for membership in db.organization_members.find({"organization_id": org["id"]}):
        user = await db.users.find_one({"_id": ObjectId(membership["user_id"])})
        if not user:
            continue
            
        assigned_tasks = await db.tasks.count_documents({
            "organization_id": org["id"],
            "assigned_to": membership["user_id"]
        })
        completed_tasks = await db.tasks.count_documents({
            "organization_id": org["id"],
            "assigned_to": membership["user_id"],
            "status": "completed"
        })
        
        completion_rate = (completed_tasks / assigned_tasks * 100) if assigned_tasks > 0 else 0
        
        team_stats.append({
            "name": f"{user['first_name']} {user['last_name']}",
            "assigned_tasks": assigned_tasks,
            "completed_tasks": completed_tasks,
            "completion_rate": round(completion_rate, 1),
            "average_completion_time": f"{2.5 + (hash(user['email']) % 20) / 10:.1f} days"  # Mock but consistent
        })
    
    return {"success": True, "data": team_stats}

# WebSocket endpoint for real-time updates
@app.websocket("/ws/{org_slug}")
async def websocket_endpoint(websocket: WebSocket, org_slug: str):
    # Get organization ID from slug
    org = await db.organizations.find_one({"slug": org_slug})
    if not org:
        await websocket.close(code=4004, reason="Organization not found")
        return
    
    organization_id = str(org["_id"])
    await websocket_manager.connect(websocket, organization_id)
    
    try:
        while True:
            # Keep connection alive and handle incoming messages
            data = await websocket.receive_text()
            await websocket_manager.send_personal_message(f"Echo: {data}", websocket)
    except WebSocketDisconnect:
        websocket_manager.disconnect(websocket, organization_id)

# Helper function to broadcast real-time updates
async def broadcast_update(org_id: str, update_type: str, data: dict):
    message = {
        "type": update_type,
        "data": data,
        "timestamp": datetime.utcnow().isoformat()
    }
    await websocket_manager.broadcast_to_organization(message, org_id)

if __name__ == "__main__":
    print("Starting SaaS Project Management Platform...")
    print(f"Database: {DATABASE_NAME}")
    print("Features: Multi-tenancy, Organizations, Subscriptions, Real-time Updates")
    print("Connecting to MongoDB Atlas...")
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=False)
