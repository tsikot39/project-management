import { useState } from 'react';
import { tasksApi } from '../services/saasApi';

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

export interface TaskStore {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  createTask: (task: {
    title: string;
    description?: string;
    status?: string;
    priority?: string;
    project_id?: string;
    assigned_to?: string;
    due_date?: string;
  }) => Promise<void>;
  updateTask: (
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
  ) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
}

// Database-connected task store implementation
export function useTaskStore(): TaskStore {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await tasksApi.getAll();
      if (response.success) {
        setTasks(response.data);
      } else {
        setError(response.message || 'Failed to fetch tasks');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
    } finally {
      setIsLoading(false);
    }
  };

  const createTask = async (task: {
    title: string;
    description?: string;
    status?: string;
    priority?: string;
    project_id?: string;
    assigned_to?: string;
    due_date?: string;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await tasksApi.create(task);
      if (response.success) {
        await fetchTasks(); // Refresh the list
      } else {
        setError(response.message || 'Failed to create task');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
    } finally {
      setIsLoading(false);
    }
  };

  const updateTask = async (
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
    setIsLoading(true);
    setError(null);
    try {
      const response = await tasksApi.update(taskId, task);
      if (response.success) {
        await fetchTasks(); // Refresh the list
      } else {
        setError(response.message || 'Failed to update task');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTask = async (taskId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await tasksApi.delete(taskId);
      if (response.success) {
        await fetchTasks(); // Refresh the list
      } else {
        setError(response.message || 'Failed to delete task');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    tasks,
    isLoading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  };
}
