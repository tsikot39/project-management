import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional
import os

class EmailService:
    def __init__(self):
        self.smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", "587"))
        self.smtp_username = os.getenv("SMTP_USERNAME", "")
        self.smtp_password = os.getenv("SMTP_PASSWORD", "")
        self.from_email = os.getenv("FROM_EMAIL", "noreply@taskflow.app")
        
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

# Global email service instance
email_service = EmailService()
