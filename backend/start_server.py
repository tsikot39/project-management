#!/usr/bin/env python3
"""
Production startup script for Taskflow SaaS Platform
Performs health checks and starts the server
"""

import asyncio
import sys
import os
from motor.motor_asyncio import AsyncIOMotorClient

# Add the current directory to Python path
sys.path.append(os.path.dirname(__file__))

async def check_mongodb_connection():
    """Check MongoDB Atlas connection"""
    try:
        mongodb_url = os.getenv("MONGODB_URL", "mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority")
        client = AsyncIOMotorClient(mongodb_url)
        await client.admin.command('ping')
        print("✓ MongoDB Atlas connection successful")
        await client.close()
        return True
    except Exception as e:
        print(f"✗ MongoDB connection failed: {e}")
        return False

async def pre_flight_checks():
    """Run pre-flight checks before starting the server"""
    print("=== Taskflow SaaS Platform Startup ===")
    print("Running pre-flight checks...\n")
    
    # Check environment variables
    required_env_vars = ["MONGODB_URL", "SECRET_KEY"]
    missing_vars = []
    
    for var in required_env_vars:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if missing_vars:
        print(f"✗ Missing required environment variables: {', '.join(missing_vars)}")
        print("Please set these variables or create a .env file")
        return False
    else:
        print("✓ Environment variables configured")
    
    # Check MongoDB connection
    if not await check_mongodb_connection():
        return False
    
    print("\n✓ All pre-flight checks passed!")
    return True

def main():
    """Main startup function"""
    import uvicorn
    from dotenv import load_dotenv
    
    # Load environment variables
    load_dotenv()
    
    # Run pre-flight checks
    if not asyncio.run(pre_flight_checks()):
        print("\n❌ Startup aborted due to failed checks")
        sys.exit(1)
    
    print("\n🚀 Starting Taskflow SaaS Platform...")
    print("Features enabled:")
    print("  - Multi-tenant Organizations")
    print("  - Project & Task Management")  
    print("  - Team Management & Invitations")
    print("  - Real-time WebSocket Updates")
    print("  - Settings & Reports")
    print("  - Email Notifications")
    print("\nServer will be available at: http://localhost:8000")
    print("API Documentation: http://localhost:8000/docs")
    print("\n" + "="*50)
    
    # Import and start the FastAPI app
    from saas_server import app
    
    uvicorn.run(
        app, 
        host="0.0.0.0", 
        port=8000, 
        reload=False,
        log_level="info"
    )

if __name__ == "__main__":
    main()
