// API service for backend communication
const API_BASE = 'http://localhost:8000/api';

// Get JWT token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('access_token');
};

// Get organization slug from localStorage or URL
const getOrgSlug = () => {
  // First try to get from organization object, fallback to direct slug
  const orgData = localStorage.getItem('organization');
  if (orgData) {
    const org = JSON.parse(orgData);
    console.log('Org data from localStorage:', org);
    return org.slug;
  }
  const directSlug = localStorage.getItem('organization_slug') || 'default-org';
  console.log('Using direct slug:', directSlug);
  return directSlug;
};

// Create headers with authentication
const getHeaders = () => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
  console.log('Auth headers:', headers);
  console.log('Auth token present:', !!token);
  return headers;
};

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
      localStorage.setItem('access_token', data.access_token);
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

  async refreshUserData() {
    const response = await this.getCurrentUser();
    if (response.success && response.data) {
      // Update localStorage with fresh data from database
      localStorage.setItem('user', JSON.stringify(response.data));
      
      // Dispatch event to notify components of user data update
      window.dispatchEvent(new CustomEvent('userDataUpdated', { 
        detail: response.data 
      }));
      
      return response.data;
    }
    return null;
  },

  async forgotPassword(email: string) {
    const response = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return response.json();
  },

  async resetPassword(token: string, newPassword: string) {
    const response = await fetch(`${API_BASE}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        token, 
        new_password: newPassword 
      }),
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
    
    const data = await response.json();
    return data;
  },  async updateUserSettings(settingsData: any) {
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

  async getNotificationSettings() {
    const orgSlug = getOrgSlug();
    const response = await fetch(
      `${API_BASE}/${orgSlug}/settings/notifications`,
      {
        headers: getHeaders(),
      }
    );
    return response.json();
  },

  async updateNotificationSettings(settingsData: any) {
    const orgSlug = getOrgSlug();
    const response = await fetch(
      `${API_BASE}/${orgSlug}/settings/notifications`,
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
    console.log('Attempting to change password for org:', orgSlug);
    console.log('API endpoint:', `${API_BASE}/${orgSlug}/settings/password`);
    try {
      const response = await fetch(`${API_BASE}/${orgSlug}/settings/password`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(passwordData),
      });
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      return response.json();
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  },

  async deleteAccount() {
    const orgSlug = getOrgSlug();
    console.log('Attempting to delete account for org:', orgSlug);
    console.log('API endpoint:', `${API_BASE}/${orgSlug}/settings/account`);
    try {
      const response = await fetch(`${API_BASE}/${orgSlug}/settings/account`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      console.log('Delete account response status:', response.status);
      console.log('Delete account response ok:', response.ok);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      // Clear all local storage on successful deletion
      localStorage.clear();
      
      return response.json();
    } catch (error) {
      console.error('Delete account error:', error);
      throw error;
    }
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
