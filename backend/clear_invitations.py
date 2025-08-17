import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def clear_invitations():
    mongodb_url = 'mongodb+srv://tsikot39:n4w5rb@cluster0.3f8yqnc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
    client = AsyncIOMotorClient(mongodb_url)
    db = client.project_management_saas
    
    # Clear all pending invitations
    result = await db.invitations.delete_many({'status': 'pending'})
    print(f'Cleared {result.deleted_count} pending invitations')
    
    await client.close()

if __name__ == "__main__":
    asyncio.run(clear_invitations())
