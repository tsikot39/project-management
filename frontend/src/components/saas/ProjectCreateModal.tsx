import { useState } from 'react';
import { X, Calendar, Target } from 'lucide-react';
import { Button } from '../ui/button';

interface Project {
  name: string;
  description: string;
  status: 'planning' | 'active' | 'on-hold' | 'completed';
  due_date?: string;
  priority: 'low' | 'medium' | 'high';
}

interface ProjectCreateModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onCreateProject: (project: Project) => Promise<void>;
  readonly isLoading?: boolean;
}

export function ProjectCreateModal({
  isOpen,
  onClose,
  onCreateProject,
  isLoading = false,
}: ProjectCreateModalProps) {
  const [formData, setFormData] = useState<Project>({
    name: '',
    description: '',
    status: 'planning',
    due_date: '',
    priority: 'medium',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Project name must be at least 3 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Project description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
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
      await onCreateProject(formData);
      // Reset form
      setFormData({
        name: '',
        description: '',
        status: 'planning',
        due_date: '',
        priority: 'medium',
      });
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleChange = (field: keyof Project, value: string) => {
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
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Target className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Create New Project
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
          {/* Project Name */}
          <div>
            <label
              htmlFor="project-name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Project Name *
            </label>
            <input
              id="project-name"
              type="text"
              placeholder="Enter project name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300'
              }`}
              disabled={isLoading}
              required
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="project-description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Description *
            </label>
            <textarea
              id="project-description"
              placeholder="Describe what this project is about"
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

          {/* Status */}
          <div>
            <label
              htmlFor="project-status"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Initial Status
            </label>
            <select
              id="project-status"
              value={formData.status}
              onChange={(e) =>
                handleChange('status', e.target.value as Project['status'])
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            >
              <option value="planning">Planning</option>
              <option value="active">Active</option>
              <option value="on-hold">On Hold</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Priority */}
          <div>
            <label
              htmlFor="project-priority"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Priority
            </label>
            <select
              id="project-priority"
              value={formData.priority}
              onChange={(e) =>
                handleChange('priority', e.target.value as Project['priority'])
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Due Date */}
          <div>
            <label
              htmlFor="project-due-date"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Due Date (Optional)</span>
              </div>
            </label>
            <input
              id="project-due-date"
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
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating...</span>
                </div>
              ) : (
                'Create Project'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
