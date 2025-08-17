import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

def test_real_email_send():
    """Test sending a real email through Resend"""
    
    smtp_server = "smtp.resend.com"
    smtp_port = 587
    smtp_username = "resend"
    smtp_password = "re_ctqT9sYN_GEXRr75BZY9qoKwdmtA5M7Hg"
    from_email = "onboarding@resend.dev"
    
    # Use a real email for testing (you can change this)
    test_email = input("Enter your email address to test: ").strip()
    if not test_email:
        print("No email provided, exiting...")
        return
    
    try:
        print(f"Testing email send to: {test_email}")
        
        # Create message
        msg = MIMEMultipart('alternative')
        msg['Subject'] = "Test Email from Project Management Platform"
        msg['From'] = f"Project Management <{from_email}>"
        msg['To'] = test_email
        
        # Simple content
        text_content = """
Hello!

This is a test email from the Project Management platform to verify that our email system is working correctly.

If you receive this email, then the SMTP configuration is working properly.

Best regards,
Project Management Team
        """
        
        html_content = """
<html>
<body style="font-family: Arial, sans-serif;">
    <h2 style="color: #333;">Test Email</h2>
    <p>Hello!</p>
    <p>This is a test email from the <strong>Project Management platform</strong> to verify that our email system is working correctly.</p>
    <p>If you receive this email, then the SMTP configuration is working properly.</p>
    <p>Best regards,<br>Project Management Team</p>
</body>
</html>
        """
        
        msg.attach(MIMEText(text_content, 'plain', 'utf-8'))
        msg.attach(MIMEText(html_content, 'html', 'utf-8'))
        
        print("Sending email...")
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(smtp_username, smtp_password)
            server.send_message(msg)
            
        print(f"[SUCCESS] Test email sent successfully to {test_email}!")
        print("Check your inbox (and spam folder) for the test email.")
        return True
        
    except Exception as e:
        print(f"[ERROR] Failed to send email: {e}")
        print(f"Error type: {type(e)}")
        print(f"Error details: {e.args}")
        return False

if __name__ == "__main__":
    print("Resend Email Send Test")
    print("=" * 30)
    test_real_email_send()
