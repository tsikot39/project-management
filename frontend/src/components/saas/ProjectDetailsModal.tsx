import { useState, useEffect } from 'react';
import {
  X,
  Eye,
  Calendar,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Tag,
} from 'lucide-react';
import { tasksApi } from '../../services/saasApi';

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
  due_date?: string;
  priority?: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  created_at: string;
  updated_at: string;
  due_date?: string;
  project_id: string;
}

interface ProjectDetailsModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly project: Project | null;
}

export function ProjectDetailsModal({
  isOpen,
  onClose,
  project,
}: ProjectDetailsModalProps) {
  const [projectTasks, setProjectTasks] = useState<Task[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);

  // Load project tasks when modal opens
  useEffect(() => {
    if (isOpen && project) {
      loadProjectTasks();
    }
  }, [isOpen, project]);

  const loadProjectTasks = async () => {
    if (!project) return;

    setIsLoadingTasks(true);
    try {
      const response = await tasksApi.getAll();
      if (response.success && response.data) {
        // Filter tasks for this project
        const filteredTasks = response.data.filter(
          (task: Task) => task.project_id === project.id
        );
        setProjectTasks(filteredTasks);
      }
    } catch (error) {
      console.error('Error loading project tasks:', error);
    } finally {
      setIsLoadingTasks(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'planning':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'on-hold':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTaskStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'done':
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in_progress':
      case 'in-progress':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'review':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const calculateProgress = () => {
    if (projectTasks.length === 0) return 0;
    const completedTasks = projectTasks.filter(
      (task) =>
        task.status.toLowerCase() === 'done' ||
        task.status.toLowerCase() === 'completed'
    ).length;
    return Math.round((completedTasks / projectTasks.length) * 100);
  };

  const getTaskStats = () => {
    return {
      total: projectTasks.length,
      completed: projectTasks.filter(
        (task) =>
          task.status.toLowerCase() === 'done' ||
          task.status.toLowerCase() === 'completed'
      ).length,
      inProgress: projectTasks.filter(
        (task) =>
          task.status.toLowerCase() === 'in_progress' ||
          task.status.toLowerCase() === 'in-progress'
      ).length,
      todo: projectTasks.filter((task) => task.status.toLowerCase() === 'todo')
        .length,
    };
  };

  if (!isOpen || !project) {
    return null;
  }

  const progress = calculateProgress();
  const taskStats = getTaskStats();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <button
        className="fixed inset-0 bg-black/50 backdrop-blur-sm border-none cursor-default"
        onClick={onClose}
        aria-label="Close modal"
      />

      {/* Modal */}
      <div className="flex items-center justify-center min-h-screen px-4 py-8">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 border border-gray-200 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-2xl sticky top-0 z-10">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {project.name}
                </h2>
                <p className="text-sm text-gray-600">
                  Project Details & Overview
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Project Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-500" />
                  Project Information
                </h3>

                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-medium text-gray-500">
                      Description
                    </div>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg mt-1">
                      {project.description || 'No description provided'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-sm font-medium text-gray-500">
                        Status
                      </div>
                      <div className="mt-1">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(project.status)}`}
                        >
                          {project.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-gray-500">
                        Priority
                      </div>
                      <div className="mt-1">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(project.priority || 'medium')}`}
                        >
                          {(project.priority || 'MEDIUM').toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-sm font-medium text-gray-500 flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        Created
                      </div>
                      <p className="text-gray-900 mt-1">
                        {formatDate(project.created_at)}
                      </p>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-gray-500 flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        Due Date
                      </div>
                      <p className="text-gray-900 mt-1">
                        {formatDate(project.due_date)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress & Stats */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-purple-500" />
                  Progress & Statistics
                </h3>

                <div className="space-y-4">
                  {/* Progress Bar */}
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-500">Overall Progress</span>
                      <span className="font-medium text-gray-900">
                        {progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Task Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <div className="text-2xl font-bold text-blue-600">
                        {taskStats.total}
                      </div>
                      <div className="text-sm text-blue-600">Total Tasks</div>
                    </div>

                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                      <div className="text-2xl font-bold text-green-600">
                        {taskStats.completed}
                      </div>
                      <div className="text-sm text-green-600">Completed</div>
                    </div>

                    <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                      <div className="text-2xl font-bold text-yellow-600">
                        {taskStats.inProgress}
                      </div>
                      <div className="text-sm text-yellow-600">In Progress</div>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <div className="text-2xl font-bold text-gray-600">
                        {taskStats.todo}
                      </div>
                      <div className="text-sm text-gray-600">To Do</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tasks List */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                Tasks ({projectTasks.length})
              </h3>

              {isLoadingTasks && (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  <span className="ml-3 text-gray-500">Loading tasks...</span>
                </div>
              )}

              {!isLoadingTasks && projectTasks.length === 0 && (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                  <CheckCircle className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                  <p>No tasks found for this project</p>
                </div>
              )}

              {!isLoadingTasks && projectTasks.length > 0 && (
                <div className="space-y-3">
                  {projectTasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            {getTaskStatusIcon(task.status)}
                            <h4 className="font-medium text-gray-900">
                              {task.title}
                            </h4>
                            <span
                              className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(task.status)}`}
                            >
                              {task.status.replace('_', ' ').toUpperCase()}
                            </span>
                          </div>

                          {task.description && (
                            <p className="text-sm text-gray-600 mb-2">
                              {task.description}
                            </p>
                          )}

                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span className="flex items-center">
                              <Tag className="w-3 h-3 mr-1" />
                              {task.priority || 'Medium'} Priority
                            </span>
                            {task.due_date && (
                              <span className="flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                Due {formatDate(task.due_date)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
