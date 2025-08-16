from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)


class Database:
    client: AsyncIOMotorClient = None
    database = None


db = Database()


async def get_database():
    return db.database


async def connect_to_mongo():
    """Create database connection"""
    try:
        db.client = AsyncIOMotorClient(settings.MONGODB_URL)
        db.database = db.client[settings.DATABASE_NAME]
        
        # Test the connection
        await db.client.admin.command('ping')
        logger.info(f"Connected to MongoDB at {settings.MONGODB_URL}")
        
        # Create indexes
        await create_indexes()
        
    except Exception as e:
        logger.error(f"Could not connect to MongoDB: {e}")
        raise


async def close_mongo_connection():
    """Close database connection"""
    if db.client:
        db.client.close()
        logger.info("Disconnected from MongoDB")


async def create_indexes():
    """Create database indexes for better performance"""
    try:
        # Users collection indexes
        await db.database.users.create_index("email", unique=True)
        await db.database.users.create_index("created_at")
        
        # Projects collection indexes
        await db.database.projects.create_index("owner_id")
        await db.database.projects.create_index("members")
        await db.database.projects.create_index("created_at")
        await db.database.projects.create_index("status")
        
        # Tasks collection indexes
        await db.database.tasks.create_index("project_id")
        await db.database.tasks.create_index("assignee_id")
        await db.database.tasks.create_index("status")
        await db.database.tasks.create_index("priority")
        await db.database.tasks.create_index("due_date")
        await db.database.tasks.create_index("created_at")
        await db.database.tasks.create_index("position")
        
        # Comments collection indexes
        await db.database.comments.create_index("task_id")
        await db.database.comments.create_index("user_id")
        await db.database.comments.create_index("created_at")
        
        # Notifications collection indexes
        await db.database.notifications.create_index("user_id")
        await db.database.notifications.create_index("read")
        await db.database.notifications.create_index("created_at")
        
        logger.info("Database indexes created successfully")
        
    except Exception as e:
        logger.error(f"Error creating indexes: {e}")
        raise
