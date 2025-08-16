"""
MongoDB Connection Test
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def test_mongodb_connection():
    # Your MongoDB Atlas connection string
    mongodb_url = "mongodb+srv://tsikot39:n4w5rb@cluster0.3f8yqnc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    
    try:
        # Create MongoDB client
        client = AsyncIOMotorClient(mongodb_url)
        
        # Test the connection by pinging the database
        await client.admin.command('ping')
        print("✅ Successfully connected to MongoDB Atlas!")
        
        # Get database
        db = client.project_management
        
        # Test creating a collection and inserting a document
        test_collection = db.test_connection
        result = await test_collection.insert_one({"test": "connection successful", "timestamp": "2024-11-20"})
        print(f"✅ Test document inserted with ID: {result.inserted_id}")
        
        # List collections
        collections = await db.list_collection_names()
        print(f"✅ Available collections: {collections}")
        
        # Clean up test document
        await test_collection.delete_one({"_id": result.inserted_id})
        print("✅ Test document cleaned up")
        
        # Close connection
        client.close()
        print("✅ Connection closed successfully")
        
    except Exception as e:
        print(f"❌ Failed to connect to MongoDB: {e}")

if __name__ == "__main__":
    asyncio.run(test_mongodb_connection())
