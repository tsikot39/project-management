import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

def test_resend_connection():
    """Test Resend SMTP connection with minimal email"""
    
    # Resend SMTP configuration
    smtp_server = "smtp.resend.com"
    smtp_port = 587
    smtp_username = "resend"
    smtp_password = "re_ctqT9sYN_GEXRr75BZY9qoKwdmtA5M7Hg"
    from_email = "onboarding@resend.dev"
    
    try:
        print("1. Testing SMTP connection...")
        # Create a simple test message
        msg = MIMEMultipart()
        msg['From'] = f"Project Management <{from_email}>"
        msg['To'] = "test@example.com"  # This won't actually send, just test connection
        msg['Subject'] = "Test Email Connection"
        
        # Simple text content
        text_content = "This is a test email to verify SMTP connection."
        msg.attach(MIMEText(text_content, 'plain', 'utf-8'))
        
        print("2. Connecting to SMTP server...")
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            print("3. Starting TLS...")
            server.starttls()
            
            print("4. Attempting login...")
            server.login(smtp_username, smtp_password)
            print("[SUCCESS] Successfully authenticated with Resend SMTP!")
            
            # Don't actually send to avoid spam, just test connection
            print("5. Connection test complete - SMTP ready for sending")
            
        return True
        
    except smtplib.SMTPAuthenticationError as e:
        print(f"[ERROR] Authentication failed: {e}")
        print("Check your Resend API key and credentials")
        return False
        
    except smtplib.SMTPServerDisconnected as e:
        print(f"[ERROR] Server disconnected: {e}")
        print("Check your internet connection and SMTP server settings")
        return False
        
    except Exception as e:
        print(f"[ERROR] SMTP Error: {e}")
        print("Detailed error information:")
        print(f"  Error type: {type(e)}")
        print(f"  Error args: {e.args}")
        return False

if __name__ == "__main__":
    print("Testing Resend SMTP Configuration...")
    print("=" * 50)
    
    success = test_resend_connection()
    
    print("=" * 50)
    if success:
        print("[RESULT] SMTP configuration is working correctly!")
        print("The email service should be able to send real emails.")
    else:
        print("[RESULT] SMTP configuration has issues.")
        print("Emails will fall back to simulation mode.")
