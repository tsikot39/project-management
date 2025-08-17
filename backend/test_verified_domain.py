#!/usr/bin/env python3
"""
Test email sending after domain verification
"""

import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_verified_domain():
    """Test email sending with verified domain"""
    
    api_key = os.getenv('SMTP_PASS')
    from_email = os.getenv('EMAIL_FROM_ADDRESS')
    
    print("=== Testing Verified Domain Email ===\n")
    print(f"API Key: {api_key[:10]}...")
    print(f"From Email: {from_email}")
    
    # Test with any email address (should work after domain verification)
    test_email = input("Enter any email address to test: ").strip()
    
    if not test_email:
        print("No email provided, exiting...")
        return
    
    test_data = {
        "from": from_email,
        "to": [test_email],
        "subject": "🎉 Project Management Platform - Domain Verification Success!",
        "html": """
        <h2>🎉 Success! Domain Verification Complete</h2>
        <p>Congratulations! Your domain has been verified and email delivery is now working for all recipients.</p>
        
        <div style="margin: 20px 0; padding: 15px; background-color: #f0f9f0; border: 1px solid #d4edda; border-radius: 5px;">
            <h3>✅ What's Now Working:</h3>
            <ul>
                <li>✉️ Email invitations to any recipient</li>
                <li>🔔 Task notifications</li>
                <li>📧 Password reset emails</li>
                <li>🚀 Full production email capability</li>
            </ul>
        </div>
        
        <p>Your project management platform is now ready for production use!</p>
        
        <br>
        <p>Best regards,<br>Project Management Team</p>
        """
    }
    
    headers = {
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json'
    }
    
    try:
        print(f"\nSending test email to: {test_email}")
        response = requests.post(
            'https://api.resend.com/emails',
            json=test_data,
            headers=headers,
            timeout=15
        )
        
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ SUCCESS! Email sent successfully!")
            print(f"Email ID: {result.get('id')}")
            print(f"Check the inbox of: {test_email}")
        else:
            print(f"❌ Failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")

if __name__ == "__main__":
    test_verified_domain()
