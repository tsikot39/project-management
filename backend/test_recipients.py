#!/usr/bin/env python3
"""
Test to demonstrate the Resend API key email limitation
"""

import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_email_recipients():
    """Test sending emails to different recipients"""
    
    api_key = os.getenv('SMTP_PASS')
    from_email = os.getenv('EMAIL_FROM_ADDRESS')
    
    print("=== Resend API Email Recipient Test ===\n")
    print(f"API Key: {api_key[:10]}...")
    print(f"From Email: {from_email}\n")
    
    # Test emails
    test_cases = [
        {
            "name": "Owner Email (Expected to work)",
            "email": "corpusjohnbenedict@gmail.com",
            "description": "This should work because it's the owner's email"
        },
        {
            "name": "Different Email (Expected to fail)",
            "email": "test@example.com",
            "description": "This will fail because test API keys can only send to owner"
        },
        {
            "name": "Another Different Email (Expected to fail)", 
            "email": "user@company.com",
            "description": "This will also fail for the same reason"
        }
    ]
    
    headers = {
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json'
    }
    
    for i, test_case in enumerate(test_cases, 1):
        print(f"{i}. {test_case['name']}")
        print(f"   Email: {test_case['email']}")
        print(f"   Description: {test_case['description']}")
        
        test_data = {
            "from": from_email,
            "to": [test_case['email']],
            "subject": f"Test Email #{i} - Project Management Platform",
            "html": f"""
            <h2>Test Email #{i}</h2>
            <p>This is a test email sent to: <strong>{test_case['email']}</strong></p>
            <p>Purpose: {test_case['description']}</p>
            <br>
            <p>Best regards,<br>Project Management Team</p>
            """
        }
        
        try:
            response = requests.post(
                'https://api.resend.com/emails',
                json=test_data,
                headers=headers,
                timeout=10
            )
            
            print(f"   Status: {response.status_code}")
            
            if response.status_code == 200:
                print(f"   Result: ✅ SUCCESS - Email sent!")
                print(f"   Response: {response.json()}")
            elif response.status_code == 403:
                response_data = response.json()
                print(f"   Result: ❌ BLOCKED - {response_data.get('error', 'Access denied')}")
            else:
                print(f"   Result: ❌ ERROR - {response.text}")
                
        except Exception as e:
            print(f"   Result: ❌ EXCEPTION - {str(e)}")
        
        print()
    
    print("=== EXPLANATION ===")
    print("The test API key from Resend can ONLY send emails to the owner's email address.")
    print("To send to other recipients, you need to:")
    print("1. Verify a domain at https://resend.com/domains")
    print("2. Use an email address from that verified domain as the 'from' address")
    print("3. Then you can send to any recipient")
    print("\nThis is why invitations work when sent to corpusjohnbenedict@gmail.com")
    print("but not to other email addresses.")

if __name__ == "__main__":
    test_email_recipients()
