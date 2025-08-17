#!/usr/bin/env python3
"""
Test Resend with owner's email address
"""

import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_owner_email():
    """Test sending to owner's email address"""
    
    api_key = os.getenv('SMTP_PASS')
    from_email = os.getenv('EMAIL_FROM_ADDRESS')
    owner_email = "corpusjohnbenedict@gmail.com"  # From the error message
    
    print(f"[INFO] API Key: {api_key[:10] if api_key else 'NOT FOUND'}...")
    print(f"[INFO] From Email: {from_email}")
    print(f"[INFO] Testing with owner email: {owner_email}")
    
    test_data = {
        "from": from_email,
        "to": [owner_email],
        "subject": "Project Management Platform - Test Invitation",
        "html": """
        <h2>You've been invited to join a project!</h2>
        <p>This is a test email to verify that our Resend integration is working properly.</p>
        <p>If you receive this email, then our invitation system is functioning correctly.</p>
        
        <div style="margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px;">
            <h3>Project: Test Project</h3>
            <p><strong>Invited by:</strong> Test User</p>
            <p><strong>Role:</strong> Member</p>
        </div>
        
        <p>Click the link below to accept this invitation:</p>
        <a href="http://localhost:3000/accept-invitation?token=test123" 
           style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
           Accept Invitation
        </a>
        
        <br><br>
        <p>Best regards,<br>Project Management Team</p>
        """
    }
    
    headers = {
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json'
    }
    
    try:
        print("[INFO] Attempting to send test invitation email...")
        response = requests.post(
            'https://api.resend.com/emails',
            json=test_data,
            headers=headers,
            timeout=15
        )
        
        print(f"[RESPONSE] Status: {response.status_code}")
        print(f"[RESPONSE] Body: {response.text}")
        
        if response.status_code == 200:
            print("[SUCCESS] Test invitation email sent successfully!")
            print(f"[INFO] Check the inbox of {owner_email}")
            return True
        else:
            print(f"[ERROR] Failed to send email. Status: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"[ERROR] Request failed: {str(e)}")
        return False

if __name__ == "__main__":
    print("=== Testing Email with Owner Address ===")
    test_owner_email()
