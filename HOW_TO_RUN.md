# 🚀 How to Run the SaaS Project Management Platform

## Prerequisites

- Node.js (v16 or higher)
- Python 3.11+
- MongoDB Atlas account (you already have this configured)

## 📁 Project Structure

```
project-management/
├── backend/           # FastAPI SaaS backend
├── frontend/          # React frontend
├── package.json       # Root package.json with dev scripts
├── start.bat         # Windows batch script
├── start.ps1         # PowerShell script
└── README.md         # This file
```

## � Quick Start (Recommended)

### Option 1: Using NPM Scripts (Easiest)

```bash
# Install dependencies for both frontend and backend
npm run install:all

# Run both servers simultaneously
npm run dev
```

### Option 2: Run Individual Servers

```bash
# Backend only
npm run dev:backend

# Frontend only (in another terminal)
npm run dev:frontend
```

### Option 3: Using Scripts

**Windows Batch:**

```cmd
start.bat
```

**PowerShell:**

```powershell
.\start.ps1
```

## 📦 Available NPM Scripts

````json
{
  "scripts": {
    "dev": "Run both servers simultaneously",
    "dev:backend": "Run only the backend server",
    "dev:frontend": "Run only the frontend server",
    "install:all": "Install dependencies for both projects",
    "install:frontend": "Install frontend dependencies",
    "install:backend": "Install backend dependencies",
    "build:frontend": "Build frontend for production",
    "start:production": "Start backend in production mode"
  }
}

## 🌐 Access the Application

### Landing Page
Visit: **http://localhost:3000**
- Beautiful SaaS landing page
- Pricing plans
- Signup and login options

### Create Your Organization
1. Click **"Get Started Free"**
2. Fill out the signup form:
   - Your name and email
   - Password
   - Organization name (e.g., "My Company")
   - Organization URL slug (e.g., "my-company")
3. Click **"Create Account"**

### Organization Dashboard
After signup, you'll be redirected to:
**http://localhost:3000/your-org-slug/dashboard**

Features available:
- 📊 **Dashboard**: Overview of projects and team
- 🏗️ **Projects**: Manage your projects
- 👥 **Team Members**: Invite and manage team members
- 📈 **Analytics**: Track performance (coming soon)
- ⚙️ **Settings**: Organization and subscription management

## 🔑 Login
Visit: **http://localhost:3000/login**
- Use your email and password to sign in
- Redirects to your organization dashboard

## 🛠️ Troubleshooting

### Backend Issues
If port 8000 is in use:
```powershell
# Kill any process using port 8000
netstat -ano | findstr :8000
# Then kill the process ID shown
````

### Frontend Issues

If port 3000 is in use:

```powershell
# The dev server will automatically use the next available port
```

### MongoDB Connection

- Your MongoDB Atlas connection is already configured
- Database: `project_management_saas`
- Check console output for connection status

## 🎯 Key Features

### Multi-Tenancy

- Each organization has isolated data
- URL structure: `/organization-slug/dashboard`
- Secure JWT authentication

### Subscription Plans

- **Free**: 5 members, 3 projects
- **Starter**: $9.99/mo - 15 members, 25 projects
- **Professional**: $24.99/mo - 50 members, 100 projects
- **Enterprise**: $49.99/mo - Unlimited

### Security

- JWT tokens with 30-minute expiration
- Bcrypt password hashing
- Organization-based data isolation

## 🚨 Quick Start Commands

In one terminal (Backend):

```powershell
cd backend
python saas_server.py
```

In another terminal (Frontend):

```powershell
cd frontend
npm run dev
```

Then visit: **http://localhost:3000** 🎉

## 📝 Next Steps

Once running, you can:

1. Create your organization account
2. Invite team members
3. Create projects and tasks
4. Manage subscription plans
5. Explore the dashboard features

Your SaaS Project Management Platform is ready for production! 🚀
