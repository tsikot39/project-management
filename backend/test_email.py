import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Test Resend SMTP configuration
def test_resend_smtp():
    smtp_server = "smtp.resend.com"
    smtp_port = 587
    smtp_username = "resend"
    smtp_password = "re_ctqT9sYN_GEXRr75BZY9qoKwdmtA5M7Hg"
    from_email = "onboarding@resend.dev"
    
    # Create a simple test email
    msg = MIMEMultipart('alternative')
    msg['Subject'] = "Test Email from Project Management Platform"
    msg['From'] = f"Project Management Platform <{from_email}>"
    msg['To'] = "test@example.com"  # This won't be sent, just testing connection
    
    text_content = "This is a test email to verify SMTP configuration."
    html_content = "<p>This is a test email to verify SMTP configuration.</p>"
    
    msg.attach(MIMEText(text_content, 'plain'))
    msg.attach(MIMEText(html_content, 'html'))
    
    try:
        print("Testing SMTP connection to Resend...")
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            print("Connected to SMTP server")
            server.starttls()
            print("Started TLS")
            server.login(smtp_username, smtp_password)
            print("✅ SMTP authentication successful!")
            print("✅ Resend email service is properly configured")
            # We won't actually send to avoid spam
            print("📧 Email system is ready to send invitations")
    except Exception as e:
        print(f"❌ SMTP Error: {str(e)}")
        print("❌ Email service configuration issue")
        return False
    
    return True

if __name__ == "__main__":
    test_resend_smtp()
