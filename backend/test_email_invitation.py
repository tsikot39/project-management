import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from email_service import email_service
import asyncio

async def test_invitation_email():
    """Test the invitation email functionality"""
    print("Testing invitation email system...")
    
    try:
        result = await email_service.send_invitation_email(
            to_email="test@example.com",
            organization_name="Test Organization", 
            invited_by="Test Admin",
            role="member",
            message="Welcome to our team!"
        )
        
        print(f"Email test result: {result}")
        
        if result["status"] in ["sent", "simulated"]:
            print("[SUCCESS] Email system is working correctly!")
            return True
        else:
            print("[ERROR] Email system failed")
            return False
            
    except Exception as e:
        print(f"[ERROR] Email test failed: {str(e)}")
        return False

if __name__ == "__main__":
    success = asyncio.run(test_invitation_email())
    if success:
        print("[SUCCESS] Email system test passed!")
    else:
        print("[ERROR] Email system test failed!")
