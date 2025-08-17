#!/usr/bin/env python3
"""
Test Resend API key and email sending
"""

import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_resend_api():
    """Test if Resend API key is valid by trying to send an email via API"""
    
    api_key = os.getenv('SMTP_PASS')  # This is actually the API key for Resend
    from_email = os.getenv('EMAIL_FROM_ADDRESS')
    
    if not api_key:
        print("[ERROR] No SMTP_PASS found in .env file")
        return False
        
    if not from_email:
        print("[ERROR] No EMAIL_FROM_ADDRESS found in .env file")  
        return False
        
    print(f"[INFO] Testing Resend API with key: {api_key[:10]}...")
    print(f"[INFO] From email: {from_email}")
    
    # Test data
    test_email = {
        "from": from_email,
        "to": ["your-email@gmail.com"],  # Replace with your actual email for testing
        "subject": "Test Email from Project Management Platform",
        "html": """
        <h1>Hello from Project Management Platform!</h1>
        <p>This is a test email to verify that our Resend integration is working properly.</p>
        <p>If you receive this email, then our email service is functioning correctly.</p>
        <br>
        <p>Best regards,<br>Project Management Team</p>
        """
    }
    
    # Make API request to Resend
    headers = {
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json'
    }
    
    try:
        print("[INFO] Attempting to send test email via Resend API...")
        response = requests.post(
            'https://api.resend.com/emails',
            json=test_email,
            headers=headers,
            timeout=10
        )
        
        print(f"[INFO] Response status: {response.status_code}")
        print(f"[INFO] Response data: {response.text}")
        
        if response.status_code == 200:
            print("[SUCCESS] Test email sent successfully via Resend API!")
            return True
        else:
            print(f"[ERROR] Failed to send test email. Status: {response.status_code}")
            print(f"[ERROR] Response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"[ERROR] Request failed: {str(e)}")
        return False
    except Exception as e:
        print(f"[ERROR] Unexpected error: {str(e)}")
        return False

if __name__ == "__main__":
    print("=== Testing Resend API Key ===")
    success = test_resend_api()
    if success:
        print("\n[SUCCESS] Resend API test completed successfully!")
    else:
        print("\n[FAILED] Resend API test failed. Check your API key and configuration.")
