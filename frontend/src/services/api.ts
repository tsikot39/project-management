// API service for backend communication
const API_BASE = 'http://localhost:8000/api';

// Get JWT token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Get organization slug from localStorage or URL
const getOrgSlug = () => {
  return localStorage.getItem('organization_slug') || 'default-org';
};

// Create headers with authentication
const getHeaders = () => ({
  'Content-Type': 'application/json',
  ...(getAuthToken() && { Authorization: `Bearer ${getAuthToken()}` }),
});

export const api = {
  // Authentication
  async register(userData: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    organization_name: string;
    organization_slug: string;
  }) {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (data.success && data.access_token) {
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('organization_slug', data.organization.slug);
    }
    return data;
  },

  async getCurrentUser() {
    const response = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders(),
    });
    return response.json();
  },

  // Dashboard
  async getDashboardStats() {
    const orgSlug = getOrgSlug();
    const response = await fetch(`${API_BASE}/${orgSlug}/dashboard`, {
      headers: getHeaders(),
    });
    return response.json();
  },

  // Projects
  async getProjects() {
    const orgSlug = getOrgSlug();
    const response = await fetch(`${API_BASE}/${orgSlug}/projects`, {
      headers: getHeaders(),
    });
    return response.json();
  },

  async createProject(projectData: {
    name: string;
    description?: string;
    status?: string;
    start_date?: string;
    end_date?: string;
  }) {
    const orgSlug = getOrgSlug();
    const response = await fetch(`${API_BASE}/${orgSlug}/projects`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(projectData),
    });
    return response.json();
  },

  async updateProject(projectId: string, projectData: any) {
    const orgSlug = getOrgSlug();
    const response = await fetch(
      `${API_BASE}/${orgSlug}/projects/${projectId}`,
      {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(projectData),
      }
    );
    return response.json();
  },

  async deleteProject(projectId: string) {
    const orgSlug = getOrgSlug();
    const response = await fetch(
      `${API_BASE}/${orgSlug}/projects/${projectId}`,
      {
        method: 'DELETE',
        headers: getHeaders(),
      }
    );
    return response.json();
  },

  // Tasks
  async getTasks(projectId?: string) {
    const orgSlug = getOrgSlug();
    const url = projectId
      ? `${API_BASE}/${orgSlug}/tasks?project_id=${projectId}`
      : `${API_BASE}/${orgSlug}/tasks`;
    const response = await fetch(url, {
      headers: getHeaders(),
    });
    return response.json();
  },

  async createTask(taskData: {
    title: string;
    description?: string;
    status?: string;
    priority?: string;
    project_id: string;
    assignee_id?: string;
    due_date?: string;
    tags?: string[];
  }) {
    const orgSlug = getOrgSlug();
    const response = await fetch(`${API_BASE}/${orgSlug}/tasks`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(taskData),
    });
    return response.json();
  },

  async updateTask(taskId: string, taskData: any) {
    const orgSlug = getOrgSlug();
    const response = await fetch(`${API_BASE}/${orgSlug}/tasks/${taskId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(taskData),
    });
    return response.json();
  },

  async deleteTask(taskId: string) {
    const orgSlug = getOrgSlug();
    const response = await fetch(`${API_BASE}/${orgSlug}/tasks/${taskId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return response.json();
  },

  // Team Management
  async getTeamMembers() {
    const orgSlug = getOrgSlug();
    const response = await fetch(`${API_BASE}/${orgSlug}/members`, {
      headers: getHeaders(),
    });
    return response.json();
  },

  async inviteTeamMember(inviteData: {
    email: string;
    role: string;
    message?: string;
  }) {
    const orgSlug = getOrgSlug();
    const response = await fetch(`${API_BASE}/${orgSlug}/members/invite`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(inviteData),
    });
    return response.json();
  },

  async updateMemberRole(memberId: string, role: string) {
    const orgSlug = getOrgSlug();
    const response = await fetch(
      `${API_BASE}/${orgSlug}/members/${memberId}/role`,
      {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ role }),
      }
    );
    return response.json();
  },

  async removeMember(memberId: string) {
    const orgSlug = getOrgSlug();
    const response = await fetch(`${API_BASE}/${orgSlug}/members/${memberId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return response.json();
  },

  async cancelInvitation(invitationId: string) {
    const orgSlug = getOrgSlug();
    const response = await fetch(
      `${API_BASE}/${orgSlug}/invitations/${invitationId}`,
      {
        method: 'DELETE',
        headers: getHeaders(),
      }
    );
    return response.json();
  },

  // Settings
  async getUserSettings() {
    const orgSlug = getOrgSlug();
    const response = await fetch(`${API_BASE}/${orgSlug}/settings/profile`, {
      headers: getHeaders(),
    });
    return response.json();
  },

  async updateUserSettings(settingsData: any) {
    const orgSlug = getOrgSlug();
    const response = await fetch(`${API_BASE}/${orgSlug}/settings/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(settingsData),
    });
    return response.json();
  },

  async getOrganizationSettings() {
    const orgSlug = getOrgSlug();
    const response = await fetch(
      `${API_BASE}/${orgSlug}/settings/organization`,
      {
        headers: getHeaders(),
      }
    );
    return response.json();
  },

  async updateOrganizationSettings(settingsData: any) {
    const orgSlug = getOrgSlug();
    const response = await fetch(
      `${API_BASE}/${orgSlug}/settings/organization`,
      {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(settingsData),
      }
    );
    return response.json();
  },

  async changePassword(passwordData: {
    current_password: string;
    new_password: string;
  }) {
    const orgSlug = getOrgSlug();
    const response = await fetch(`${API_BASE}/${orgSlug}/settings/password`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(passwordData),
    });
    return response.json();
  },

  // Reports & Analytics
  async getReportsOverview(timeframe: string = '30d') {
    const orgSlug = getOrgSlug();
    const response = await fetch(
      `${API_BASE}/${orgSlug}/reports/overview?timeframe=${timeframe}`,
      {
        headers: getHeaders(),
      }
    );
    return response.json();
  },

  async getProjectReports() {
    const orgSlug = getOrgSlug();
    const response = await fetch(`${API_BASE}/${orgSlug}/reports/projects`, {
      headers: getHeaders(),
    });
    return response.json();
  },

  async getTeamReports() {
    const orgSlug = getOrgSlug();
    const response = await fetch(`${API_BASE}/${orgSlug}/reports/team`, {
      headers: getHeaders(),
    });
    return response.json();
  },

  // Utility functions
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('organization_slug');
  },

  isAuthenticated() {
    return !!getAuthToken();
  },

  getCurrentOrganization() {
    return getOrgSlug();
  },
};
