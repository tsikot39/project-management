from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import socketio

from app.core.config import settings
from app.core.database import connect_to_mongo, close_mongo_connection
from app.api.auth import router as auth_router
from app.api.users import router as users_router
from app.api.projects import router as projects_router
from app.api.tasks import router as tasks_router
from app.api.comments import router as comments_router

# Socket.IO setup
sio = socketio.AsyncServer(
    cors_allowed_origins="*",
    logger=True,
    engineio_logger=True
)

socket_app = socketio.ASGIApp(sio)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await connect_to_mongo()
    yield
    # Shutdown
    await close_mongo_connection()


# Create FastAPI instance
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="A comprehensive project management platform API",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_HOSTS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router, prefix="/api/auth", tags=["authentication"])
app.include_router(users_router, prefix="/api/users", tags=["users"])
app.include_router(projects_router, prefix="/api/projects", tags=["projects"])
app.include_router(tasks_router, prefix="/api/tasks", tags=["tasks"])
app.include_router(comments_router, prefix="/api/comments", tags=["comments"])


@app.get("/")
async def root():
    return {"message": "Project Management Platform API", "version": settings.VERSION}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


# Socket.IO event handlers
@sio.event
async def connect(sid, environ):
    print(f"Client {sid} connected")


@sio.event
async def disconnect(sid):
    print(f"Client {sid} disconnected")


@sio.event
async def join_project(sid, data):
    """Join a project room for real-time updates"""
    project_id = data.get("project_id")
    if project_id:
        await sio.enter_room(sid, f"project_{project_id}")
        await sio.emit("joined_project", {"project_id": project_id}, room=sid)


@sio.event
async def leave_project(sid, data):
    """Leave a project room"""
    project_id = data.get("project_id")
    if project_id:
        await sio.leave_room(sid, f"project_{project_id}")
        await sio.emit("left_project", {"project_id": project_id}, room=sid)


@sio.event
async def task_update(sid, data):
    """Handle task updates and broadcast to project members"""
    project_id = data.get("project_id")
    if project_id:
        await sio.emit(
            "task_updated", 
            data, 
            room=f"project_{project_id}",
            skip_sid=sid
        )


# Mount Socket.IO app
app.mount("/socket.io", socket_app)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
