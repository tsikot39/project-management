import { useState, useEffect } from 'react';
import { X, Calendar, Flag, User } from 'lucide-react';
import { Button } from '../ui/button';
import { projectsApi } from '../../services/saasApi';

interface Task {
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  project_id?: string;
  assigned_to?: string;
  due_date?: string;
}

interface Project {
  id: string;
  name: string;
}

interface TaskCreateModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onCreateTask: (task: Task) => Promise<void>;
  readonly isLoading?: boolean;
  readonly projectId?: string; // Optional project ID for project-specific context
  readonly projectName?: string; // Optional project name to display
}

export function TaskCreateModal({
  isOpen,
  onClose,
  onCreateTask,
  isLoading = false,
  projectId,
  projectName,
}: TaskCreateModalProps) {
  const [formData, setFormData] = useState<Task>({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    project_id: projectId || '', // Set project_id from prop if provided
    assigned_to: '',
    due_date: '',
  });

  const [projects, setProjects] = useState<Project[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Reset form data
      setFormData({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        project_id: projectId || '', // Use provided projectId or empty string
        assigned_to: '',
        due_date: '',
      });

      // Only load projects if we don't have a specific project context
      if (!projectId) {
        loadProjects();
      }
      setErrors({});
    }
  }, [isOpen, projectId]);

  const loadProjects = async () => {
    setIsLoadingProjects(true);
    try {
      const response = await projectsApi.getAll();
      if (response.success) {
        setProjects(response.data);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setIsLoadingProjects(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Task title must be at least 3 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Task description is required';
    } else if (formData.description.length < 5) {
      newErrors.description = 'Description must be at least 5 characters';
    }

    if (formData.due_date) {
      const selectedDate = new Date(formData.due_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.due_date = 'Due date cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Clean up the data - remove empty strings
      const cleanedData = {
        ...formData,
        project_id: formData.project_id || undefined,
        assigned_to: formData.assigned_to || undefined,
        due_date: formData.due_date || undefined,
      };

      await onCreateTask(cleanedData);

      // Reset form
      setFormData({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        project_id: '',
        assigned_to: '',
        due_date: '',
      });
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleChange = (field: keyof Task, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Flag className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Create New Task
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Task Title */}
          <div>
            <label
              htmlFor="task-title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Task Title *
            </label>
            <input
              id="task-title"
              type="text"
              placeholder="Enter task title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.title
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300'
              }`}
              disabled={isLoading}
              required
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="task-description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Description *
            </label>
            <textarea
              id="task-description"
              placeholder="Describe what needs to be done"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                errors.description
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300'
              }`}
              disabled={isLoading}
              required
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Status and Priority Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="task-status"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Status
              </label>
              <select
                id="task-status"
                value={formData.status}
                onChange={(e) =>
                  handleChange('status', e.target.value as Task['status'])
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="review">In Review</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="task-priority"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Priority
              </label>
              <select
                id="task-priority"
                value={formData.priority}
                onChange={(e) =>
                  handleChange('priority', e.target.value as Task['priority'])
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Project */}
          {/* Project Selection - only show if not in project-specific context */}
          {!projectId && (
            <div>
              <label
                htmlFor="task-project"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Project (Optional)
              </label>
              <select
                id="task-project"
                value={formData.project_id}
                onChange={(e) => handleChange('project_id', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading || isLoadingProjects}
              >
                <option value="">Select a project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
              {isLoadingProjects && (
                <p className="mt-1 text-sm text-gray-500">
                  Loading projects...
                </p>
              )}
            </div>
          )}

          {/* Project Display - show project name when in project-specific context */}
          {projectId && projectName && (
            <div>
              <div className="block text-sm font-medium text-gray-700 mb-2">
                Project
              </div>
              <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-700">
                {projectName}
              </div>
            </div>
          )}

          {/* Assignee */}
          <div>
            <label
              htmlFor="task-assignee"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              <div className="flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span>Assign to (Optional)</span>
              </div>
            </label>
            <input
              id="task-assignee"
              type="text"
              placeholder="Enter email or name"
              value={formData.assigned_to}
              onChange={(e) => handleChange('assigned_to', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
          </div>

          {/* Due Date */}
          <div>
            <label
              htmlFor="task-due-date"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Due Date (Optional)</span>
              </div>
            </label>
            <input
              id="task-due-date"
              type="date"
              value={formData.due_date}
              onChange={(e) => handleChange('due_date', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.due_date
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300'
              }`}
              disabled={isLoading}
            />
            {errors.due_date && (
              <p className="mt-1 text-sm text-red-600">{errors.due_date}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-green-500 to-blue-500 text-white"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating...</span>
                </div>
              ) : (
                'Create Task'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
