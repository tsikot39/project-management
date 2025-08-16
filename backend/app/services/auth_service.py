"""
SaaS Authentication & Authorization Service
"""
import jwt
import bcrypt
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.models.saas import User, Organization, OrganizationMember, UserRole, PlanType
from fastapi import HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import Depends

# JWT Configuration
SECRET_KEY = "your-super-secret-jwt-key-change-this-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7

security = HTTPBearer()

class AuthService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
    
    def hash_password(self, password: str) -> str:
        """Hash a password using bcrypt"""
        salt = bcrypt.gensalt()
        return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')
    
    def verify_password(self, password: str, hashed: str) -> bool:
        """Verify a password against its hash"""
        return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))
    
    def create_access_token(self, data: dict, expires_delta: Optional[timedelta] = None) -> str:
        """Create a JWT access token"""
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        
        to_encode.update({"exp": expire, "type": "access"})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt
    
    def create_refresh_token(self, data: dict) -> str:
        """Create a JWT refresh token"""
        to_encode = data.copy()
        expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
        to_encode.update({"exp": expire, "type": "refresh"})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt
    
    def decode_token(self, token: str) -> Dict[str, Any]:
        """Decode and validate a JWT token"""
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
    
    async def authenticate_user(self, email: str, password: str) -> Optional[Dict[str, Any]]:
        """Authenticate a user with email and password"""
        user = await self.db.users.find_one({"email": email})
        if not user:
            return None
        
        if not self.verify_password(password, user["password_hash"]):
            return None
        
        # Get user's organizations
        memberships = await self.db.organization_members.find(
            {"user_id": str(user["_id"])}
        ).to_list(length=100)
        
        organizations = []
        for membership in memberships:
            org = await self.db.organizations.find_one(
                {"_id": membership["organization_id"]}
            )
            if org:
                organizations.append({
                    "id": str(org["_id"]),
                    "name": org["name"],
                    "slug": org["slug"],
                    "role": membership["role"]
                })
        
        return {
            "id": str(user["_id"]),
            "email": user["email"],
            "first_name": user["first_name"],
            "last_name": user["last_name"],
            "organizations": organizations
        }
    
    async def create_user_and_organization(self, email: str, password: str, 
                                         first_name: str, last_name: str,
                                         org_name: str, org_slug: str) -> Dict[str, Any]:
        """Create a new user and their organization (signup)"""
        # Check if user already exists
        existing_user = await self.db.users.find_one({"email": email})
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this email already exists"
            )
        
        # Check if organization slug is available
        existing_org = await self.db.organizations.find_one({"slug": org_slug})
        if existing_org:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Organization slug already taken"
            )
        
        # Create user
        user_doc = {
            "email": email,
            "first_name": first_name,
            "last_name": last_name,
            "password_hash": self.hash_password(password),
            "is_verified": False,
            "is_active": True,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }
        
        user_result = await self.db.users.insert_one(user_doc)
        user_id = str(user_result.inserted_id)
        
        # Create organization with free plan
        org_doc = {
            "name": org_name,
            "slug": org_slug,
            "plan_type": PlanType.FREE.value,
            "max_users": 5,
            "max_projects": 3,
            "max_storage_mb": 100,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }
        
        org_result = await self.db.organizations.insert_one(org_doc)
        org_id = str(org_result.inserted_id)
        
        # Add user as owner of the organization
        membership_doc = {
            "organization_id": org_id,
            "user_id": user_id,
            "role": UserRole.OWNER.value,
            "joined_at": datetime.utcnow().isoformat(),
            "created_at": datetime.utcnow().isoformat()
        }
        
        await self.db.organization_members.insert_one(membership_doc)
        
        return {
            "user": {
                "id": user_id,
                "email": email,
                "first_name": first_name,
                "last_name": last_name
            },
            "organization": {
                "id": org_id,
                "name": org_name,
                "slug": org_slug,
                "plan_type": PlanType.FREE.value
            }
        }
    
    async def get_current_user(self, credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict[str, Any]:
        """Get current authenticated user from JWT token"""
        token = credentials.credentials
        payload = self.decode_token(token)
        
        if payload.get("type") != "access":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token type"
            )
        
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
        
        user = await self.db.users.find_one({"_id": user_id})
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
    
    async def check_organization_permission(self, user_id: str, org_id: str, 
                                          required_role: UserRole = UserRole.MEMBER) -> bool:
        """Check if user has required permission in organization"""
        membership = await self.db.organization_members.find_one({
            "user_id": user_id,
            "organization_id": org_id
        })
        
        if not membership:
            return False
        
        user_role = membership["role"]
        
        # Role hierarchy: owner > admin > member > viewer
        role_hierarchy = {
            UserRole.VIEWER.value: 1,
            UserRole.MEMBER.value: 2,
            UserRole.ADMIN.value: 3,
            UserRole.OWNER.value: 4
        }
        
        return role_hierarchy.get(user_role, 0) >= role_hierarchy.get(required_role.value, 0)
    
    async def check_plan_limits(self, org_id: str, resource_type: str, current_count: int) -> bool:
        """Check if organization is within plan limits"""
        org = await self.db.organizations.find_one({"_id": org_id})
        if not org:
            return False
        
        plan_type = org.get("plan_type", PlanType.FREE.value)
        
        limits = {
            PlanType.FREE.value: {"users": 5, "projects": 3, "storage_mb": 100},
            PlanType.STARTER.value: {"users": 15, "projects": 25, "storage_mb": 1000},
            PlanType.PROFESSIONAL.value: {"users": 50, "projects": 100, "storage_mb": 10000},
            PlanType.ENTERPRISE.value: {"users": -1, "projects": -1, "storage_mb": -1}
        }
        
        limit = limits.get(plan_type, {}).get(resource_type, 0)
        
        # -1 means unlimited
        if limit == -1:
            return True
        
        return current_count < limit
