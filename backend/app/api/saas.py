"""
SaaS API Routes - Authentication, Organizations, and Billing
"""
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.services.auth_service import AuthService
from app.models.saas import (
    UserSignup, UserLogin, OrganizationCreate, InviteUser, 
    UpgradeSubscription, PlanType, PLAN_LIMITS
)
from app.core.database import get_database
from datetime import datetime
from typing import List, Dict, Any

router = APIRouter(prefix="/api/saas", tags=["SaaS"])
security = HTTPBearer()

async def get_auth_service(db: AsyncIOMotorDatabase = Depends(get_database)):
    return AuthService(db)

# Authentication Routes
@router.post("/signup")
async def signup(
    user_data: UserSignup,
    auth_service: AuthService = Depends(get_auth_service)
):
    """Sign up a new user and create their organization"""
    try:
        result = await auth_service.create_user_and_organization(
            email=user_data.email,
            password=user_data.password,
            first_name=user_data.first_name,
            last_name=user_data.last_name,
            org_name=user_data.organization_name,
            org_slug=user_data.organization_slug
        )
        
        # Create tokens
        token_data = {"sub": result["user"]["id"]}
        access_token = auth_service.create_access_token(token_data)
        refresh_token = auth_service.create_refresh_token(token_data)
        
        return {
            "success": True,
            "data": {
                "user": result["user"],
                "organization": result["organization"],
                "access_token": access_token,
                "refresh_token": refresh_token,
                "token_type": "bearer"
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.post("/login")
async def login(
    credentials: UserLogin,
    auth_service: AuthService = Depends(get_auth_service)
):
    """Authenticate user and return tokens"""
    user = await auth_service.authenticate_user(credentials.email, credentials.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Create tokens
    token_data = {"sub": user["id"]}
    access_token = auth_service.create_access_token(token_data)
    refresh_token = auth_service.create_refresh_token(token_data)
    
    return {
        "success": True,
        "data": {
            "user": user,
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer"
        }
    }

@router.get("/me")
async def get_current_user(
    current_user: Dict[str, Any] = Depends(AuthService.get_current_user)
):
    """Get current authenticated user"""
    return {"success": True, "data": current_user}

# Organization Management Routes
@router.get("/organizations/{org_slug}")
async def get_organization(
    org_slug: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: Dict[str, Any] = Depends(AuthService.get_current_user)
):
    """Get organization details"""
    org = await db.organizations.find_one({"slug": org_slug})
    if not org:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found"
        )
    
    # Check if user has access to this organization
    auth_service = AuthService(db)
    has_access = await auth_service.check_organization_permission(
        current_user["id"], str(org["_id"])
    )
    
    if not has_access:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    # Get member count and project count
    member_count = await db.organization_members.count_documents(
        {"organization_id": str(org["_id"])}
    )
    project_count = await db.projects.count_documents(
        {"organization_id": str(org["_id"])}
    )
    
    org_data = {
        "id": str(org["_id"]),
        "name": org["name"],
        "slug": org["slug"],
        "description": org.get("description"),
        "plan_type": org.get("plan_type", "free"),
        "member_count": member_count,
        "project_count": project_count,
        "limits": PLAN_LIMITS.get(org.get("plan_type", "free"), PLAN_LIMITS["free"])
    }
    
    return {"success": True, "data": org_data}

@router.get("/organizations/{org_slug}/members")
async def get_organization_members(
    org_slug: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: Dict[str, Any] = Depends(AuthService.get_current_user)
):
    """Get organization members"""
    org = await db.organizations.find_one({"slug": org_slug})
    if not org:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found"
        )
    
    # Check if user has access to this organization
    auth_service = AuthService(db)
    has_access = await auth_service.check_organization_permission(
        current_user["id"], str(org["_id"])
    )
    
    if not has_access:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    # Get members with user details
    members = []
    async for membership in db.organization_members.find({"organization_id": str(org["_id"])}):
        user = await db.users.find_one({"_id": membership["user_id"]})
        if user:
            members.append({
                "id": str(user["_id"]),
                "email": user["email"],
                "first_name": user["first_name"],
                "last_name": user["last_name"],
                "role": membership["role"],
                "joined_at": membership.get("joined_at")
            })
    
    return {"success": True, "data": members}

@router.post("/organizations/{org_slug}/invite")
async def invite_user(
    org_slug: str,
    invite_data: InviteUser,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: Dict[str, Any] = Depends(AuthService.get_current_user)
):
    """Invite a user to the organization"""
    org = await db.organizations.find_one({"slug": org_slug})
    if not org:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found"
        )
    
    # Check if user has admin access
    auth_service = AuthService(db)
    from app.models.saas import UserRole
    has_access = await auth_service.check_organization_permission(
        current_user["id"], str(org["_id"]), UserRole.ADMIN
    )
    
    if not has_access:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    # Check plan limits
    current_member_count = await db.organization_members.count_documents(
        {"organization_id": str(org["_id"])}
    )
    
    can_add_member = await auth_service.check_plan_limits(
        str(org["_id"]), "users", current_member_count
    )
    
    if not can_add_member:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail="User limit reached. Please upgrade your plan."
        )
    
    # TODO: Send invitation email
    # For now, return success message
    return {
        "success": True,
        "data": {
            "message": f"Invitation sent to {invite_data.email}",
            "role": invite_data.role
        }
    }

# Subscription & Billing Routes
@router.get("/plans")
async def get_subscription_plans():
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

@router.post("/organizations/{org_slug}/upgrade")
async def upgrade_subscription(
    org_slug: str,
    upgrade_data: UpgradeSubscription,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: Dict[str, Any] = Depends(AuthService.get_current_user)
):
    """Upgrade organization subscription"""
    org = await db.organizations.find_one({"slug": org_slug})
    if not org:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found"
        )
    
    # Check if user is owner
    auth_service = AuthService(db)
    from app.models.saas import UserRole
    is_owner = await auth_service.check_organization_permission(
        current_user["id"], str(org["_id"]), UserRole.OWNER
    )
    
    if not is_owner:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Owner access required"
        )
    
    # TODO: Integrate with Stripe for payment processing
    # For now, simulate successful upgrade
    
    # Update organization plan
    plan_limits = PLAN_LIMITS.get(upgrade_data.plan_type.value)
    if not plan_limits:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid plan type"
        )
    
    await db.organizations.update_one(
        {"_id": org["_id"]},
        {
            "$set": {
                "plan_type": upgrade_data.plan_type.value,
                "max_users": plan_limits["max_users"],
                "max_projects": plan_limits["max_projects"],
                "max_storage_mb": plan_limits["max_storage_mb"],
                "updated_at": datetime.utcnow().isoformat()
            }
        }
    )
    
    return {
        "success": True,
        "data": {
            "message": f"Successfully upgraded to {upgrade_data.plan_type.value} plan",
            "plan_type": upgrade_data.plan_type.value,
            "limits": plan_limits
        }
    }

@router.get("/organizations/{org_slug}/billing")
async def get_billing_info(
    org_slug: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: Dict[str, Any] = Depends(AuthService.get_current_user)
):
    """Get organization billing information"""
    org = await db.organizations.find_one({"slug": org_slug})
    if not org:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found"
        )
    
    # Check if user is owner or admin
    auth_service = AuthService(db)
    from app.models.saas import UserRole
    has_access = await auth_service.check_organization_permission(
        current_user["id"], str(org["_id"]), UserRole.ADMIN
    )
    
    if not has_access:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    # Get current usage
    member_count = await db.organization_members.count_documents(
        {"organization_id": str(org["_id"])}
    )
    project_count = await db.projects.count_documents(
        {"organization_id": str(org["_id"])}
    )
    
    plan_type = org.get("plan_type", "free")
    plan_limits = PLAN_LIMITS.get(plan_type)
    
    billing_info = {
        "current_plan": {
            "type": plan_type,
            "price": plan_limits["price"] if plan_limits else 0,
            "features": plan_limits["features"] if plan_limits else []
        },
        "usage": {
            "members": {"current": member_count, "limit": plan_limits["max_users"] if plan_limits else 0},
            "projects": {"current": project_count, "limit": plan_limits["max_projects"] if plan_limits else 0},
            "storage": {"current": 0, "limit": plan_limits["max_storage_mb"] if plan_limits else 0}
        },
        "next_billing_date": None,  # TODO: Implement with Stripe
        "payment_method": None  # TODO: Implement with Stripe
    }
    
    return {"success": True, "data": billing_info}
