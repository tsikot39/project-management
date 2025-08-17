// SaaS API service for database operations
const API_BASE = 'http://localhost:8000/api';

// Helper to get auth token
const getAuthToken = () => localStorage.getItem('access_token');

// Helper to get organization slug
const getOrgSlug = () => {
  const orgData = localStorage.getItem('organization');
  if (orgData) {
    const org = JSON.parse(orgData);
    return org.slug;
  }
  return null;
};

// Auth API calls
export const authApi = {
  signup: async (data: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    organization_name: string;
  }) => {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  me: async () => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  },
};

// Projects API calls
export const projectsApi = {
  getAll: async () => {
    const token = getAuthToken();
    const orgSlug = getOrgSlug();

    if (!token || !orgSlug) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE}/${orgSlug}/projects`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }

    return response.json();
  },

  create: async (project: {
    name: string;
    description?: string;
    status?: string;
  }) => {
    const token = getAuthToken();
    const orgSlug = getOrgSlug();

    if (!token || !orgSlug) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE}/${orgSlug}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(project),
    });

    if (!response.ok) {
      throw new Error('Failed to create project');
    }

    return response.json();
  },

  update: async (
    projectId: string,
    project: { name?: string; description?: string; status?: string }
  ) => {
    const token = getAuthToken();
    const orgSlug = getOrgSlug();

    if (!token || !orgSlug) {
      throw new Error('Authentication required');
    }

    const response = await fetch(
      `${API_BASE}/${orgSlug}/projects/${projectId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(project),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to update project');
    }

    return response.json();
  },

  delete: async (projectId: string) => {
    const token = getAuthToken();
    const orgSlug = getOrgSlug();

    if (!token || !orgSlug) {
      throw new Error('Authentication required');
    }

    const response = await fetch(
      `${API_BASE}/${orgSlug}/projects/${projectId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to delete project');
    }

    return response.json();
  },
};

// Tasks API calls
export const tasksApi = {
  getAll: async () => {
    const token = getAuthToken();
    const orgSlug = getOrgSlug();

    if (!token || !orgSlug) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE}/${orgSlug}/tasks`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }

    return response.json();
  },

  create: async (task: {
    title: string;
    description?: string;
    status?: string;
    priority?: string;
    project_id?: string;
    assigned_to?: string;
    due_date?: string;
  }) => {
    const token = getAuthToken();
    const orgSlug = getOrgSlug();

    if (!token || !orgSlug) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE}/${orgSlug}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(task),
    });

    if (!response.ok) {
      throw new Error('Failed to create task');
    }

    return response.json();
  },

  update: async (
    taskId: string,
    task: {
      title?: string;
      description?: string;
      status?: string;
      priority?: string;
      project_id?: string;
      assigned_to?: string;
      due_date?: string;
    }
  ) => {
    const token = getAuthToken();
    const orgSlug = getOrgSlug();

    if (!token || !orgSlug) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE}/${orgSlug}/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(task),
    });

    if (!response.ok) {
      throw new Error('Failed to update task');
    }

    return response.json();
  },

  delete: async (taskId: string) => {
    const token = getAuthToken();
    const orgSlug = getOrgSlug();

    if (!token || !orgSlug) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE}/${orgSlug}/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete task');
    }

    return response.json();
  },

  // Project-specific task methods
  getProjectTasks: async (projectId: string) => {
    const token = getAuthToken();
    const orgSlug = getOrgSlug();

    if (!token || !orgSlug) {
      throw new Error('Authentication required');
    }

    const response = await fetch(
      `${API_BASE}/${orgSlug}/projects/${projectId}/tasks`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch project tasks');
    }

    return response.json();
  },

  createProjectTask: async (
    projectId: string,
    task: {
      title: string;
      description?: string;
      status?: string;
      priority?: string;
      assigned_to?: string;
      due_date?: string;
    }
  ) => {
    const token = getAuthToken();
    const orgSlug = getOrgSlug();

    if (!token || !orgSlug) {
      throw new Error('Authentication required');
    }

    const response = await fetch(
      `${API_BASE}/${orgSlug}/projects/${projectId}/tasks`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(task),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to create project task');
    }

    return response.json();
  },
};

// Dashboard API calls
export const dashboardApi = {
  getDashboardData: async () => {
    const token = getAuthToken();
    const orgSlug = getOrgSlug();

    if (!token || !orgSlug) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE}/${orgSlug}/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch dashboard data');
    }

    return response.json();
  },

  getMembers: async () => {
    const token = getAuthToken();
    const orgSlug = getOrgSlug();

    if (!token || !orgSlug) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE}/${orgSlug}/members`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch members');
    }

    return response.json();
  },

  inviteMember: async (inviteData: {
    email: string;
    role: string;
    message?: string;
  }) => {
    const token = getAuthToken();
    const orgSlug = getOrgSlug();

    if (!token || !orgSlug) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE}/${orgSlug}/members/invite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(inviteData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to send invitation');
    }

    return response.json();
  },

  // Remove team member
  async removeMember(memberId: string) {
    const token = getAuthToken();
    const orgSlug = getOrgSlug();

    if (!token || !orgSlug) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE}/${orgSlug}/members/${memberId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to remove member');
    }

    return response.json();
  },

  // Delete invitation
  async deleteInvitation(invitationId: string) {
    const token = getAuthToken();
    const orgSlug = getOrgSlug();

    if (!token || !orgSlug) {
      throw new Error('Authentication required');
    }

    const response = await fetch(
      `${API_BASE}/${orgSlug}/invitations/${invitationId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to delete invitation');
    }

    return response.json();
  },
};
