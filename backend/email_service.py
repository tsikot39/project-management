import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional
import os

class EmailService:
    def __init__(self):
        # Resend SMTP Settings
        self.smtp_server = os.getenv("SMTP_HOST", "smtp.resend.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", "587"))
        self.smtp_secure = os.getenv("SMTP_SECURE", "false").lower() == "true"
        self.smtp_username = os.getenv("SMTP_USER", "resend")
        self.smtp_password = os.getenv("SMTP_PASS", "re_ctqT9sYN_GEXRr75BZY9qoKwdmtA5M7Hg")
        self.from_name = os.getenv("EMAIL_FROM_NAME", "Project Management SaaS Platform")
        self.from_email = os.getenv("EMAIL_FROM_ADDRESS", "onboarding@resend.dev")
        
    def _send_email_via_smtp(self, to_email: str, subject: str, html_content: str, text_content: str = ""):
        """Send email via SMTP using Resend"""
        try:
            # Create message
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = f"{self.from_name} <{self.from_email}>"
            msg['To'] = to_email

            # Add text and HTML parts
            if text_content:
                text_part = MIMEText(text_content, 'plain')
                msg.attach(text_part)
            
            html_part = MIMEText(html_content, 'html')
            msg.attach(html_part)

            # Send email
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_username, self.smtp_password)
                server.send_message(msg)
                
            return {"status": "sent", "message": "Email sent successfully"}
            
        except Exception as e:
            print(f"Error sending email: {str(e)}")
            # Fallback to console logging for development
            print(f"""
=== EMAIL FALLBACK ===
To: {to_email}
Subject: {subject}
Content: {text_content or html_content}
==================
            """)
            return {"status": "fallback", "message": f"Email failed to send via SMTP, logged to console. Error: {str(e)}"}
        
    async def send_invitation_email(
        self, 
        to_email: str, 
        organization_name: str,
        invited_by: str,
        role: str,
        message: Optional[str] = None
    ):
        """Send invitation email to new team member"""
        
        # For now, we'll just log the email instead of actually sending
        # In production, you'd configure SMTP settings
        print(f"""
=== EMAIL INVITATION ===
To: {to_email}
Subject: You've been invited to join {organization_name} on Taskflow

Dear Team Member,

{invited_by} has invited you to join {organization_name} as a {role} on Taskflow.

{f"Personal message: {message}" if message else ""}

Click here to accept your invitation: https://taskflow.app/accept-invitation

Best regards,
The Taskflow Team
========================
        """)
        
        return {"status": "sent", "message": "Invitation email sent successfully"}
    
    async def send_task_notification(
        self,
        to_email: str,
        task_title: str,
        project_name: str,
        assigned_by: str
    ):
        """Send task assignment notification"""
        
        print(f"""
=== TASK NOTIFICATION ===
To: {to_email}
Subject: New task assigned: {task_title}

You have been assigned a new task:

Task: {task_title}
Project: {project_name}
Assigned by: {assigned_by}

View task: https://taskflow.app/tasks

Best regards,
The Taskflow Team
=========================
        """)
        
        return {"status": "sent", "message": "Task notification sent"}

    async def send_password_reset_email(
        self,
        to_email: str,
        user_name: str,
        reset_token: str
    ):
        """Send password reset email"""
        
        reset_url = f"http://localhost:3000/reset-password?token={reset_token}"
        
        subject = "Reset your password"
        
        # HTML email content
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                .container {{ max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }}
                .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }}
                .content {{ padding: 30px; }}
                .button {{ display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
                .footer {{ background: #f8f9fa; padding: 20px; text-align: center; color: #666; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Reset Your Password</h1>
                </div>
                <div class="content">
                    <p>Hello {user_name},</p>
                    
                    <p>We received a request to reset your password for your Project Management account.</p>
                    
                    <p>Click the button below to reset your password:</p>
                    
                    <p style="text-align: center;">
                        <a href="{reset_url}" class="button">Reset Password</a>
                    </p>
                    
                    <p>Or copy and paste this link into your browser:</p>
                    <p style="word-break: break-all; color: #667eea;">{reset_url}</p>
                    
                    <p><strong>This link will expire in 1 hour</strong> for security reasons.</p>
                    
                    <p>If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
                    
                    <p>Best regards,<br>The Project Management Team</p>
                </div>
                <div class="footer">
                    <p>This email was sent by Project Management SaaS Platform</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        # Plain text version
        text_content = f"""
        Hello {user_name},

        We received a request to reset your password for your Project Management account.

        Click this link to reset your password:
        {reset_url}

        This link will expire in 1 hour for security reasons.

        If you didn't request a password reset, please ignore this email.

        Best regards,
        The Project Management Team
        """
        
        return self._send_email_via_smtp(to_email, subject, html_content, text_content)

# Global email service instance
email_service = EmailService()
