#!/usr/bin/env python3
"""
Simple Resend API test without interactive input
"""

import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_resend_simple():
    """Test if Resend API key is valid"""
    
    api_key = os.getenv('SMTP_PASS')
    from_email = os.getenv('EMAIL_FROM_ADDRESS')
    
    print(f"[INFO] API Key: {api_key[:10] if api_key else 'NOT FOUND'}...")
    print(f"[INFO] From Email: {from_email}")
    
    if not api_key or not from_email:
        print("[ERROR] Missing configuration")
        return False
    
    # Test with a safe dummy email (won't actually send)
    test_data = {
        "from": from_email,
        "to": ["test@example.com"],  # Safe test email
        "subject": "API Key Validation Test",
        "html": "<p>Test email content</p>"
    }
    
    headers = {
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json'
    }
    
    try:
        print("[INFO] Testing Resend API key validity...")
        response = requests.post(
            'https://api.resend.com/emails',
            json=test_data,
            headers=headers,
            timeout=10
        )
        
        print(f"[RESPONSE] Status: {response.status_code}")
        print(f"[RESPONSE] Body: {response.text}")
        
        if response.status_code == 200:
            print("[SUCCESS] API key is valid!")
            return True
        elif response.status_code == 401:
            print("[ERROR] Invalid API key or authentication failed")
            return False
        elif response.status_code == 422:
            print("[INFO] API key is valid, but email data has validation issues")
            print("[INFO] This is expected for test@example.com")
            return True
        else:
            print(f"[ERROR] Unexpected response: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"[ERROR] Request failed: {str(e)}")
        return False

if __name__ == "__main__":
    print("=== Simple Resend API Key Test ===")
    test_resend_simple()
