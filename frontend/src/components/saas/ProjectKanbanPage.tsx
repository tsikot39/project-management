import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Plus,
  MoreHorizontal,
  User,
  Calendar,
  AlertCircle,
  RefreshCw,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { tasksApi, projectsApi } from '../../services/saasApi';
import { TaskCreateModal } from './TaskCreateModal';

type Priority = 'low' | 'medium' | 'high';

interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  assigned_to?: string;
  due_date?: string;
  status: string;
  project_id?: string;
  created_at: string;
  updated_at: string;
}

interface Project {
  id: string;
  name: string;
  description?: string;
  status: string;
}

interface Column {
  id: string;
  title: string;
  color: string;
  bgColor: string;
  textColor: string;
  tasks: Task[];
}

const defaultColumns = [
  {
    id: 'todo',
    title: 'To Do',
    color: 'border-gray-300',
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-700',
  },
  {
    id: 'in_progress',
    title: 'In Progress',
    color: 'border-blue-300',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
  },
  {
    id: 'review',
    title: 'In Review',
    color: 'border-amber-300',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
  },
  {
    id: 'done',
    title: 'Done',
    color: 'border-green-300',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
  },
];

export function ProjectKanbanPage() {
  const { orgSlug, projectId } = useParams<{
    orgSlug: string;
    projectId: string;
  }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null);
  const [columns, setColumns] = useState<Column[]>(
    defaultColumns.map((col) => ({ ...col, tasks: [] }))
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [selectedColumnForTask, setSelectedColumnForTask] =
    useState<string>('todo');

  useEffect(() => {
    if (projectId) {
      loadProject();
      loadTasks();
    }
  }, [projectId]);

  const loadProject = async () => {
    try {
      const response = await projectsApi.getAll();
      if (response.success) {
        const projects = response.data as Project[];
        const currentProject = projects.find((p) => p.id === projectId);
        if (currentProject) {
          setProject(currentProject);
        } else {
          setError('Project not found');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load project');
    }
  };

  const loadTasks = async () => {
    if (!projectId) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await tasksApi.getProjectTasks(projectId);
      if (response.success) {
        const tasks = response.data as Task[];

        // Group tasks by status
        const updatedColumns = defaultColumns.map((column) => ({
          ...column,
          tasks: tasks.filter((task) => task.status === column.id),
        }));

        setColumns(updatedColumns);
      } else {
        setError(response.message || 'Failed to load tasks');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskMove = async (taskId: string, newStatus: string) => {
    try {
      console.log(`Moving task ${taskId} to status: ${newStatus}`);
      const response = await tasksApi.update(taskId, { status: newStatus });

      if (response.success) {
        console.log('Task updated successfully');
        // Reload tasks to get fresh data
        await loadTasks();
        setError(null); // Clear any previous errors
      } else {
        console.error('Task update failed:', response.message);
        setError(response.message || 'Failed to update task');
        await loadTasks(); // Reload to revert any optimistic updates
      }
    } catch (err) {
      console.error('Task update error:', err);
      setError(err instanceof Error ? err.message : 'Failed to update task');
      // Reload tasks to revert any optimistic updates
      await loadTasks();
    }
  };

  const handleCreateTask = async (taskData: any) => {
    if (!projectId) return;

    setIsCreatingTask(true);
    try {
      const response = await tasksApi.createProjectTask(projectId, {
        ...taskData,
        status: selectedColumnForTask,
      });

      if (response.success) {
        await loadTasks(); // Reload tasks to show the new task
        setIsCreateModalOpen(false);
        setError(null);
      } else {
        setError(response.message || 'Failed to create task');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
    } finally {
      setIsCreatingTask(false);
    }
  };

  const handleAddTaskClick = (columnId: string) => {
    setSelectedColumnForTask(columnId);
    setIsCreateModalOpen(true);
  };

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    setError(null); // Clear any previous errors
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', task.id);

    // Add some visual feedback
    const target = e.target as HTMLElement;
    target.style.opacity = '0.5';
  };

  const handleDragEnd = (e: React.DragEvent) => {
    // Reset visual feedback
    const target = e.target as HTMLElement;
    target.style.opacity = '1';
    setDraggedTask(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(columnId);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = async (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    setDragOverColumn(null);

    if (!draggedTask) return;

    // Don't do anything if dropped in the same column
    if (draggedTask.status === columnId) {
      setDraggedTask(null);
      return;
    }

    console.log('Updating task:', draggedTask.id, 'to status:', columnId);
    await handleTaskMove(draggedTask.id, columnId);
    setDraggedTask(null);
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading project kanban board...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Breadcrumb */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
              <button
                onClick={() => navigate(`/${orgSlug}/projects`)}
                className="hover:text-gray-700 flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Projects
              </button>
              <span>/</span>
              <span>{project?.name || 'Loading...'}</span>
              <span>/</span>
              <span className="text-gray-900">Kanban Board</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              {project?.name} - Kanban Board
            </h1>
            {project?.description && (
              <p className="text-gray-600 mt-1">{project.description}</p>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={loadTasks}
              variant="outline"
              size="sm"
              disabled={isLoading}
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`}
              />
              Refresh
            </Button>
            <Button size="sm" onClick={() => handleAddTaskClick('todo')}>
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
                <button
                  onClick={loadTasks}
                  className="mt-2 text-sm bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Kanban Board */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {columns.map((column) => (
            <div key={column.id} className="flex flex-col">
              {/* Column Header */}
              <div
                className={`${column.bgColor} ${column.textColor} ${column.color} border-2 rounded-t-lg p-4`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <h3 className="font-semibold text-sm">{column.title}</h3>
                    <span className="ml-2 bg-white bg-opacity-60 text-xs px-2 py-1 rounded-full">
                      {column.tasks.length}
                    </span>
                  </div>
                  <button className="hover:bg-white hover:bg-opacity-20 p-1 rounded">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Column Content */}
              <section
                className={`bg-white border-2 border-t-0 border-gray-200 rounded-b-lg p-4 flex-1 min-h-96 space-y-3 ${
                  dragOverColumn === column.id
                    ? 'bg-blue-50 border-blue-300'
                    : ''
                }`}
                onDragOver={(e) => handleDragOver(e, column.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, column.id)}
                aria-label={`${column.title} tasks`}
              >
                {column.tasks.map((task) => (
                  <button
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                    onDragEnd={handleDragEnd}
                    className={`w-full bg-white border border-gray-200 rounded-lg p-4 cursor-move hover:shadow-md transition-all text-left ${
                      draggedTask?.id === task.id ? 'opacity-50' : 'opacity-100'
                    }`}
                    aria-label={`Task: ${task.title}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-medium text-gray-900 text-sm leading-tight pr-2">
                        {task.title}
                      </h4>
                      <div className="h-6 w-6 p-0 flex-shrink-0 hover:bg-gray-100 rounded flex items-center justify-center">
                        <MoreHorizontal className="w-3 h-3" />
                      </div>
                    </div>

                    {task.description && (
                      <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                        {task.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {task.priority && (
                          <Badge
                            className={`text-xs px-2 py-1 ${getPriorityColor(task.priority)}`}
                          >
                            {task.priority}
                          </Badge>
                        )}
                        {task.due_date && (
                          <div className="flex items-center text-xs text-gray-500">
                            <Calendar className="w-3 h-3 mr-1" />
                            {formatDate(task.due_date)}
                          </div>
                        )}
                      </div>

                      {task.assigned_to && (
                        <div className="flex items-center text-xs text-gray-500">
                          <User className="w-3 h-3 mr-1" />
                          <span className="truncate max-w-16">
                            {task.assigned_to}
                          </span>
                        </div>
                      )}
                    </div>
                  </button>
                ))}

                {/* Add Task Button */}
                <button
                  className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center"
                  onClick={() => handleAddTaskClick(column.id)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add a task
                </button>
              </section>
            </div>
          ))}
        </div>
      </div>

      {/* Task Create Modal */}
      <TaskCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateTask={handleCreateTask}
        isLoading={isCreatingTask}
        projectId={projectId}
        projectName={project?.name}
      />
    </div>
  );
}
