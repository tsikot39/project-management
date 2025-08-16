import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  apiClient,
  type Project,
  type Task,
  type ApiResponse,
} from '../lib/api';
import { toast } from '../lib/toast';

// Query Keys
export const queryKeys = {
  projects: {
    all: ['projects'] as const,
    lists: () => [...queryKeys.projects.all, 'list'] as const,
    list: (filters: string) =>
      [...queryKeys.projects.lists(), { filters }] as const,
    details: () => [...queryKeys.projects.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.projects.details(), id] as const,
  },
  tasks: {
    all: ['tasks'] as const,
    lists: () => [...queryKeys.tasks.all, 'list'] as const,
    list: (filters: string) =>
      [...queryKeys.tasks.lists(), { filters }] as const,
    details: () => [...queryKeys.tasks.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.tasks.details(), id] as const,
  },
  users: {
    all: ['users'] as const,
    current: () => [...queryKeys.users.all, 'current'] as const,
  },
} as const;

// Project Hooks
export function useProjects() {
  return useQuery({
    queryKey: queryKeys.projects.lists(),
    queryFn: async () => {
      const response = await apiClient.getProjects();
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: queryKeys.projects.detail(id),
    queryFn: async () => {
      const response = await apiClient.getProject(id);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) =>
      apiClient.createProject(project),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
      toast.success('Project created successfully!');
    },
    onError: (error: ApiResponse<never>) => {
      toast.error(error.message || 'Failed to create project');
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Project> }) =>
      apiClient.updateProject(id, updates),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.detail(variables.id),
      });
      toast.success('Project updated successfully!');
    },
    onError: (error: ApiResponse<never>) => {
      toast.error(error.message || 'Failed to update project');
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
      toast.success('Project deleted successfully!');
    },
    onError: (error: ApiResponse<never>) => {
      toast.error(error.message || 'Failed to delete project');
    },
  });
}

// Task Hooks
export function useTasks(projectId?: string) {
  return useQuery({
    queryKey: queryKeys.tasks.list(projectId || 'all'),
    queryFn: async () => {
      const response = await apiClient.getTasks(projectId);
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useTask(id: string) {
  return useQuery({
    queryKey: queryKeys.tasks.detail(id),
    queryFn: async () => {
      const response = await apiClient.getTask(id);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) =>
      apiClient.createTask(task),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.detail(variables.projectId),
      });
      toast.success('Task created successfully!');
    },
    onError: (error: ApiResponse<never>) => {
      toast.error(error.message || 'Failed to create task');
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Task> }) =>
      apiClient.updateTask(id, updates),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.tasks.detail(variables.id),
      });
      if (response.data?.projectId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.projects.detail(response.data.projectId),
        });
      }
      toast.success('Task updated successfully!');
    },
    onError: (error: ApiResponse<never>) => {
      toast.error(error.message || 'Failed to update task');
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
      toast.success('Task deleted successfully!');
    },
    onError: (error: ApiResponse<never>) => {
      toast.error(error.message || 'Failed to delete task');
    },
  });
}

// User Hooks
export function useUsers() {
  return useQuery({
    queryKey: queryKeys.users.all,
    queryFn: async () => {
      const response = await apiClient.getUsers();
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.users.current(),
    queryFn: async () => {
      const response = await apiClient.getCurrentUser();
      return response.data;
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
    retry: false, // Don't retry if user is not authenticated
  });
}
