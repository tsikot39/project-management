import { useState } from 'react';
import { projectsApi } from '../services/saasApi';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority?: 'low' | 'medium' | 'high';
  project_id?: string;
  assigned_to?: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
  tasks?: Task[];
  teamMembers?: string[];
  endDate?: string;
}

export interface ProjectStore {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  createProject: (project: {
    name: string;
    description?: string;
    status?: string;
  }) => Promise<void>;
  updateProject: (
    projectId: string,
    project: { name?: string; description?: string; status?: string }
  ) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
}

// Database-connected store implementation
export function useProjectStore(): ProjectStore {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await projectsApi.getAll();
      if (response.success) {
        setProjects(response.data);
      } else {
        setError(response.message || 'Failed to fetch projects');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
    } finally {
      setIsLoading(false);
    }
  };

  const createProject = async (project: {
    name: string;
    description?: string;
    status?: string;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await projectsApi.create(project);
      if (response.success) {
        await fetchProjects(); // Refresh the list
      } else {
        setError(response.message || 'Failed to create project');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProject = async (
    projectId: string,
    project: { name?: string; description?: string; status?: string }
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await projectsApi.update(projectId, project);
      if (response.success) {
        await fetchProjects(); // Refresh the list
      } else {
        setError(response.message || 'Failed to update project');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update project');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProject = async (projectId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await projectsApi.delete(projectId);
      if (response.success) {
        await fetchProjects(); // Refresh the list
      } else {
        setError(response.message || 'Failed to delete project');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete project');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    projects,
    isLoading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
  };
}
