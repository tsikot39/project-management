from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum
from bson import ObjectId


class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")


# Enums
class UserRole(str, Enum):
    ADMIN = "admin"
    MANAGER = "manager"
    MEMBER = "member"
    VIEWER = "viewer"


class ProjectStatus(str, Enum):
    ACTIVE = "active"
    ARCHIVED = "archived"
    COMPLETED = "completed"


class TaskStatus(str, Enum):
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    REVIEW = "review"
    DONE = "done"


class TaskPriority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class NotificationType(str, Enum):
    TASK_ASSIGNED = "task_assigned"
    TASK_COMPLETED = "task_completed"
    TASK_DUE_SOON = "task_due_soon"
    COMMENT_ADDED = "comment_added"
    PROJECT_UPDATED = "project_updated"
    MENTION = "mention"


# Base models
class BaseDocument(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


# User models
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: UserRole = UserRole.MEMBER


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    role: Optional[UserRole] = None
    avatar_url: Optional[str] = None


class UserInDB(BaseDocument, UserBase):
    hashed_password: str
    avatar_url: Optional[str] = None
    is_active: bool = True
    email_verified: bool = False


class User(BaseDocument, UserBase):
    avatar_url: Optional[str] = None
    is_active: bool = True


class UserLogin(BaseModel):
    email: EmailStr
    password: str


# Token models
class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None


# Project models
class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[ProjectStatus] = None


class ProjectInDB(BaseDocument, ProjectBase):
    owner_id: PyObjectId
    members: List[PyObjectId] = []
    status: ProjectStatus = ProjectStatus.ACTIVE


class Project(BaseDocument, ProjectBase):
    owner_id: str
    members: List[str] = []
    status: ProjectStatus = ProjectStatus.ACTIVE


# Task models
class SubtaskBase(BaseModel):
    title: str
    completed: bool = False


class Subtask(SubtaskBase):
    id: str
    created_at: datetime


class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    priority: TaskPriority = TaskPriority.MEDIUM
    due_date: Optional[datetime] = None
    tags: List[str] = []


class TaskCreate(TaskBase):
    project_id: str
    assignee_id: Optional[str] = None


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[TaskStatus] = None
    priority: Optional[TaskPriority] = None
    due_date: Optional[datetime] = None
    assignee_id: Optional[str] = None
    tags: Optional[List[str]] = None
    position: Optional[int] = None


class TaskInDB(BaseDocument, TaskBase):
    project_id: PyObjectId
    assignee_id: Optional[PyObjectId] = None
    status: TaskStatus = TaskStatus.TODO
    position: int = 0
    created_by: PyObjectId
    subtasks: List[Subtask] = []


class Task(BaseDocument, TaskBase):
    project_id: str
    assignee_id: Optional[str] = None
    status: TaskStatus = TaskStatus.TODO
    position: int = 0
    created_by: str
    subtasks: List[Subtask] = []


# Comment models
class CommentBase(BaseModel):
    content: str


class CommentCreate(CommentBase):
    task_id: str


class CommentUpdate(BaseModel):
    content: str


class CommentInDB(BaseDocument, CommentBase):
    task_id: PyObjectId
    user_id: PyObjectId


class Comment(BaseDocument, CommentBase):
    task_id: str
    user_id: str


# Notification models
class NotificationBase(BaseModel):
    title: str
    message: str
    type: NotificationType
    related_id: Optional[str] = None


class NotificationInDB(BaseDocument, NotificationBase):
    user_id: PyObjectId
    read: bool = False


class Notification(BaseDocument, NotificationBase):
    user_id: str
    read: bool = False


# Response models
class BaseResponse(BaseModel):
    success: bool = True
    message: Optional[str] = None


class PaginatedResponse(BaseModel):
    items: List[dict]
    total: int
    page: int
    limit: int
    total_pages: int
