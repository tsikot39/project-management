# Taskflow SaaS Backend

A complete multi-tenant SaaS project management platform built with FastAPI, MongoDB Atlas, and real-time features.

## 🚀 Features

### Core Platform

- **Multi-tenant Architecture**: Organization-based isolation with unique slugs
- **Authentication & Authorization**: JWT-based auth with role-based permissions
- **Subscription Management**: SaaS plans (Free, Starter, Professional, Enterprise)
- **Database**: MongoDB Atlas with automatic indexing and optimization

### Project Management

- **Projects**: Full CRUD operations with status tracking
- **Tasks**: Advanced task management with assignments, due dates, priorities
- **Dashboard**: Real-time statistics and project overviews

### Team Management

- **Member Management**: Add, remove, and manage team member roles
- **Role-based Permissions**: Owner, Admin, Member, Viewer hierarchy
- **Team Invitations**: Email-based invitation system with pending status
- **User Profiles**: Comprehensive user settings and preferences

### Real-time Features

- **WebSocket Integration**: Live updates across all connected clients
- **Real-time Notifications**: Instant updates for tasks, invitations, and changes
- **Broadcast System**: Organization-scoped message broadcasting

### Settings & Configuration

- **User Settings**: Profile management, timezone, language preferences
- **Organization Settings**: Company details, branding, team configuration
- **Security Settings**: Password management and account security
- **Notification Preferences**: Customizable alert settings

### Analytics & Reports

- **Project Analytics**: Completion rates, performance metrics, time tracking
- **Team Performance**: Individual and team productivity insights
- **Data Export**: Export capabilities for reporting and analysis
- **Time-filtered Reports**: Flexible date range analysis (7d, 30d, 90d, 1y)

### Communication

- **Email Service**: Automated invitation and notification emails
- **Template System**: Professional email templates for all communications
- **SMTP Integration**: Configurable email delivery system

## 🛠 Technology Stack

- **Framework**: FastAPI 0.104.1
- **Database**: MongoDB Atlas with Motor (async driver)
- **Authentication**: JWT tokens with bcrypt password hashing
- **Real-time**: WebSocket connections for live updates
- **Email**: SMTP-based email service with templates
- **Validation**: Pydantic models with comprehensive validation
- **CORS**: Configured for React frontend integration

## 📦 Installation

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd project-management/backend
   ```

2. **Install dependencies**:

   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables**:

   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB Atlas connection string and other settings
   ```

4. **Configure MongoDB Atlas**:
   - Create a MongoDB Atlas cluster
   - Get your connection string
   - Update the `MONGODB_URL` in your `.env` file

## 🚀 Running the Server

### Development Mode

```bash
python start_server.py
```

### Direct FastAPI Mode

```bash
python saas_server.py
```

### With uvicorn

```bash
uvicorn saas_server:app --host 0.0.0.0 --port 8000 --reload
```

The server will be available at:

- **API**: http://localhost:8000
- **Documentation**: http://localhost:8000/docs
- **OpenAPI Schema**: http://localhost:8000/openapi.json

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register new user with organization
- `POST /api/auth/login` - User login with JWT token generation
- `GET /api/auth/me` - Get current user information

### Organization Management

- `GET /api/{org_slug}/dashboard` - Organization dashboard with statistics
- `GET /api/{org_slug}/members` - List all organization members
- `POST /api/{org_slug}/members/invite` - Invite new team members
- `PUT /api/{org_slug}/members/{member_id}/role` - Update member role
- `DELETE /api/{org_slug}/members/{member_id}` - Remove team member

### Project Management

- `GET /api/{org_slug}/projects` - List all projects
- `POST /api/{org_slug}/projects` - Create new project
- `PUT /api/{org_slug}/projects/{project_id}` - Update project
- `DELETE /api/{org_slug}/projects/{project_id}` - Delete project

### Task Management

- `GET /api/{org_slug}/tasks` - List all tasks (with filtering)
- `POST /api/{org_slug}/tasks` - Create new task
- `PUT /api/{org_slug}/tasks/{task_id}` - Update task
- `DELETE /api/{org_slug}/tasks/{task_id}` - Delete task

### Settings & Configuration

- `GET/PUT /api/{org_slug}/settings/profile` - User profile settings
- `GET/PUT /api/{org_slug}/settings/organization` - Organization settings
- `PUT /api/{org_slug}/settings/password` - Change user password

### Reports & Analytics

- `GET /api/{org_slug}/reports/overview` - Platform overview statistics
- `GET /api/{org_slug}/reports/projects` - Project performance reports
- `GET /api/{org_slug}/reports/team` - Team performance analytics

### Real-time Features

- `WebSocket /ws/{org_slug}` - Real-time updates and notifications

## 🔧 Configuration

### Environment Variables (.env)

```env
# MongoDB Configuration
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
DATABASE_NAME=project_management_saas

# JWT Configuration
SECRET_KEY=your-super-secret-jwt-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Email Configuration (Optional)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
FROM_EMAIL=noreply@taskflow.app

# Application Configuration
ENVIRONMENT=development
DEBUG=True
CORS_ORIGINS=http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Role-based Access Control**: Hierarchical permission system
- **CORS Protection**: Configured origins for secure frontend integration
- **Input Validation**: Comprehensive Pydantic model validation
- **Database Security**: MongoDB connection with authentication

## 📊 SaaS Plan Limits

### Free Plan

- 5 team members
- 3 projects
- 100MB storage
- Basic support

### Starter Plan ($9.99/month)

- 15 team members
- 25 projects
- 1GB storage
- Priority support
- Time tracking

### Professional Plan ($24.99/month)

- 50 team members
- Unlimited projects
- 10GB storage
- Advanced analytics
- Custom integrations

### Enterprise Plan (Custom pricing)

- Unlimited team members
- Unlimited projects
- 100GB storage
- White-label solution
- 24/7 support

## 🏗 Database Schema

### Collections

- **users**: User accounts and profile information
- **organizations**: Company/team organizations with settings
- **organization_members**: User-organization relationships with roles
- **projects**: Project information and status
- **tasks**: Task details with assignments and deadlines
- **invitations**: Pending team member invitations

### Indexes

- Unique indexes on email addresses and organization slugs
- Compound indexes for efficient queries
- Performance-optimized for multi-tenant operations

## 🔄 Real-time Updates

WebSocket integration provides instant updates for:

- Task creation and status changes
- Team member invitations and role updates
- Project updates and notifications
- Dashboard statistics refresh

## 📧 Email Integration

Automated email notifications for:

- Team member invitations
- Task assignments and updates
- Project deadline reminders
- System notifications

## 🧪 Testing

The platform includes comprehensive error handling and validation:

- Input validation using Pydantic models
- Database constraint validation
- Authentication and authorization checks
- Real-time connection management

## 🚀 Production Deployment

For production deployment:

1. Set `ENVIRONMENT=production` in your `.env` file
2. Use a secure `SECRET_KEY`
3. Configure proper SMTP settings for email delivery
4. Set up MongoDB Atlas with appropriate security settings
5. Use a reverse proxy (nginx) for HTTPS termination
6. Consider using Docker for containerized deployment

## 📈 Monitoring & Logs

The application provides comprehensive logging for:

- Authentication events
- Database operations
- WebSocket connections
- Email delivery status
- Error tracking and debugging

## 🤝 Integration

The backend is designed to integrate seamlessly with:

- React/TypeScript frontend applications
- Mobile applications via REST API
- Third-party tools through webhook support
- Analytics platforms for data insights

---

**Ready for Production**: This backend provides a complete, scalable foundation for a modern SaaS project management platform with all the features needed for a professional multi-tenant application.
