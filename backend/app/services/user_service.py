from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import Optional, List
from bson import ObjectId
from datetime import datetime

from app.models import User, UserCreate, UserUpdate, UserInDB
from app.core.security import get_password_hash


class UserService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.collection = db.users

    async def create_user(self, user_data: UserCreate) -> UserInDB:
        """Create a new user"""
        user_dict = user_data.model_dump()
        user_dict["hashed_password"] = get_password_hash(user_data.password)
        del user_dict["password"]
        user_dict["created_at"] = datetime.utcnow()
        user_dict["updated_at"] = datetime.utcnow()
        
        result = await self.collection.insert_one(user_dict)
        user_dict["_id"] = result.inserted_id
        
        return UserInDB(**user_dict)

    async def get_user_by_id(self, user_id: str) -> Optional[UserInDB]:
        """Get user by ID"""
        if not ObjectId.is_valid(user_id):
            return None
            
        user_doc = await self.collection.find_one({"_id": ObjectId(user_id)})
        if user_doc:
            return UserInDB(**user_doc)
        return None

    async def get_user_by_email(self, email: str) -> Optional[UserInDB]:
        """Get user by email"""
        user_doc = await self.collection.find_one({"email": email})
        if user_doc:
            return UserInDB(**user_doc)
        return None

    async def update_user(self, user_id: str, user_data: UserUpdate) -> Optional[UserInDB]:
        """Update user information"""
        if not ObjectId.is_valid(user_id):
            return None

        update_data = user_data.model_dump(exclude_unset=True)
        update_data["updated_at"] = datetime.utcnow()

        result = await self.collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": update_data}
        )

        if result.modified_count > 0:
            return await self.get_user_by_id(user_id)
        return None

    async def delete_user(self, user_id: str) -> bool:
        """Delete user"""
        if not ObjectId.is_valid(user_id):
            return False

        result = await self.collection.delete_one({"_id": ObjectId(user_id)})
        return result.deleted_count > 0

    async def get_users(self, skip: int = 0, limit: int = 20) -> List[User]:
        """Get list of users with pagination"""
        cursor = self.collection.find().skip(skip).limit(limit)
        users = []
        async for user_doc in cursor:
            user = UserInDB(**user_doc)
            # Convert to User model (without sensitive info)
            user_dict = user.model_dump(exclude={"hashed_password"})
            users.append(User(**user_dict))
        return users

    async def get_users_count(self) -> int:
        """Get total count of users"""
        return await self.collection.count_documents({})

    async def activate_user(self, user_id: str) -> bool:
        """Activate user account"""
        if not ObjectId.is_valid(user_id):
            return False

        result = await self.collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"is_active": True, "updated_at": datetime.utcnow()}}
        )
        return result.modified_count > 0

    async def deactivate_user(self, user_id: str) -> bool:
        """Deactivate user account"""
        if not ObjectId.is_valid(user_id):
            return False

        result = await self.collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"is_active": False, "updated_at": datetime.utcnow()}}
        )
        return result.modified_count > 0

    async def verify_email(self, email: str) -> bool:
        """Mark user email as verified"""
        result = await self.collection.update_one(
            {"email": email},
            {"$set": {"email_verified": True, "updated_at": datetime.utcnow()}}
        )
        return result.modified_count > 0
