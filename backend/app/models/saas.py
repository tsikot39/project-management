"""
SaaS Models for Multi-tenant Project Management Platform
"""
from datetime import datetime, timedelta
from typing import List, Optional
from pydantic import BaseModel, EmailStr
from enum import Enum

class PlanType(str, Enum):
    FREE = "free"
    STARTER = "starter"
    PROFESSIONAL = "professional"
    ENTERPRISE = "enterprise"

class SubscriptionStatus(str, Enum):
    ACTIVE = "active"
    CANCELED = "canceled"
    PAST_DUE = "past_due"
    UNPAID = "unpaid"
    TRIALING = "trialing"

class UserRole(str, Enum):
    OWNER = "owner"
    ADMIN = "admin"
    MEMBER = "member"
    VIEWER = "viewer"

# SaaS Models
class Organization(BaseModel):
    id: Optional[str] = None
    name: str
    slug: str  # Unique identifier for subdomains (e.g., acme.projectmanager.com)
    description: Optional[str] = None
    logo_url: Optional[str] = None
    website: Optional[str] = None
    industry: Optional[str] = None
    company_size: Optional[str] = None
    subscription_id: Optional[str] = None
    plan_type: PlanType = PlanType.FREE
    max_users: int = 5
    max_projects: int = 3
    max_storage_mb: int = 100
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

class Subscription(BaseModel):
    id: Optional[str] = None
    organization_id: str
    plan_type: PlanType
    status: SubscriptionStatus
    stripe_subscription_id: Optional[str] = None
    stripe_customer_id: Optional[str] = None
    current_period_start: str
    current_period_end: str
    trial_end: Optional[str] = None
    price_per_month: float
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

class User(BaseModel):
    id: Optional[str] = None
    email: EmailStr
    first_name: str
    last_name: str
    password_hash: Optional[str] = None
    avatar_url: Optional[str] = None
    is_verified: bool = False
    is_active: bool = True
    last_login: Optional[str] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

class OrganizationMember(BaseModel):
    id: Optional[str] = None
    organization_id: str
    user_id: str
    role: UserRole
    invited_by: Optional[str] = None
    invited_at: Optional[str] = None
    joined_at: Optional[str] = None
    created_at: Optional[str] = None

# Enhanced Project and Task models for multi-tenancy
class Project(BaseModel):
    id: Optional[str] = None
    organization_id: str  # Multi-tenant field
    name: str
    description: Optional[str] = None
    status: str = "active"
    owner_id: str
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    budget: Optional[float] = None
    currency: str = "USD"
    color: Optional[str] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

class Task(BaseModel):
    id: Optional[str] = None
    organization_id: str  # Multi-tenant field
    project_id: str
    title: str
    description: Optional[str] = None
    status: str = "todo"
    priority: str = "medium"
    assignee_id: Optional[str] = None
    created_by: str
    due_date: Optional[str] = None
    estimated_hours: Optional[float] = None
    actual_hours: Optional[float] = None
    tags: List[str] = []
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

# API Request/Response models
class OrganizationCreate(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    industry: Optional[str] = None
    company_size: Optional[str] = None

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

class InviteUser(BaseModel):
    email: EmailStr
    role: UserRole = UserRole.MEMBER

class UpgradeSubscription(BaseModel):
    plan_type: PlanType
    payment_method_id: str  # Stripe payment method ID

# Plan configurations
PLAN_LIMITS = {
    PlanType.FREE: {
        "max_users": 5,
        "max_projects": 3,
        "max_storage_mb": 100,
        "price": 0,
        "features": [
            "Up to 5 team members",
            "3 projects",
            "100MB storage",
            "Basic task management",
            "Email support"
        ]
    },
    PlanType.STARTER: {
        "max_users": 15,
        "max_projects": 25,
        "max_storage_mb": 1000,
        "price": 9.99,
        "features": [
            "Up to 15 team members",
            "25 projects",
            "1GB storage",
            "Advanced task management",
            "Time tracking",
            "Priority support"
        ]
    },
    PlanType.PROFESSIONAL: {
        "max_users": 50,
        "max_projects": 100,
        "max_storage_mb": 10000,
        "price": 24.99,
        "features": [
            "Up to 50 team members",
            "100 projects",
            "10GB storage",
            "Advanced analytics",
            "Custom fields",
            "API access",
            "Priority support"
        ]
    },
    PlanType.ENTERPRISE: {
        "max_users": -1,  # Unlimited
        "max_projects": -1,  # Unlimited
        "max_storage_mb": -1,  # Unlimited
        "price": 49.99,
        "features": [
            "Unlimited team members",
            "Unlimited projects",
            "Unlimited storage",
            "Advanced security",
            "SSO integration",
            "Custom branding",
            "Dedicated support",
            "SLA guarantee"
        ]
    }
}
