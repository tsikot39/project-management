import { useState, useEffect } from 'react';
import { X, Plus, User, Calendar, Flag, Hash } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { useCreateTask, useProjects } from '../../hooks/useApi';
import { toast } from '../../lib/toast';

type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';

interface CreateTaskModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly projectId?: string;
  readonly initialStatus?: string;
}

export function CreateTaskModal({
  isOpen,
  onClose,
  projectId,
  initialStatus,
}: CreateTaskModalProps) {
  const getInitialStatus = (): TaskStatus => {
    if (
      initialStatus === 'todo' ||
      initialStatus === 'in_progress' ||
      initialStatus === 'review' ||
      initialStatus === 'done'
    ) {
      return initialStatus;
    }
    return 'todo';
  };

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: getInitialStatus(),
    priority: 'medium' as const,
    assignee: '',
    projectId: projectId || '',
    dueDate: '',
    tags: [] as string[],
  });
  const [tagInput, setTagInput] = useState('');

  const createTask = useCreateTask();
  const { data: projects = [] } = useProjects();

  // Reset form when modal opens with new initial status
  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: '',
        description: '',
        status: getInitialStatus(),
        priority: 'medium' as const,
        assignee: '',
        projectId: projectId || '',
        dueDate: '',
        tags: [] as string[],
      });
    }
  }, [isOpen, initialStatus, projectId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Task title is required');
      return;
    }

    if (!formData.projectId) {
      toast.error('Please select a project');
      return;
    }

    try {
      await createTask.mutateAsync({
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        assignee: formData.assignee,
        projectId: formData.projectId,
        dueDate: formData.dueDate || undefined,
        tags: formData.tags,
      });

      // Reset form and close modal
      setFormData({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        assignee: '',
        projectId: projectId || '',
        dueDate: '',
        tags: [],
      });
      setTagInput('');
      onClose();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleChange = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <button
        className="fixed inset-0 bg-black/50 backdrop-blur-sm border-none cursor-default"
        onClick={onClose}
        onKeyDown={(e) => e.key === 'Escape' && onClose()}
        aria-label="Close modal"
        type="button"
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-card border border-border rounded-xl shadow-2xl shadow-primary/10 w-full max-w-lg">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                Create New Task
              </h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Task Title */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-medium text-foreground">
                <Hash className="w-4 h-4" />
                <span>Task Title</span>
              </label>
              <Input
                type="text"
                placeholder="Enter task title..."
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="bg-background/50"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label
                htmlFor="task-description"
                className="text-sm font-medium text-foreground"
              >
                Description
              </label>
              <textarea
                id="task-description"
                placeholder="Describe the task..."
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-background/50 border border-border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-colors text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {/* Project Selection */}
            <div className="space-y-2">
              <label
                htmlFor="project-select"
                className="text-sm font-medium text-foreground"
              >
                Project
              </label>
              <select
                id="project-select"
                value={formData.projectId}
                onChange={(e) => handleChange('projectId', e.target.value)}
                className="w-full px-3 py-2 bg-background/50 border border-border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-colors text-foreground"
                required
              >
                <option value="">Select a project...</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority and Status */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-foreground">
                  <Flag className="w-4 h-4" />
                  <span>Priority</span>
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => handleChange('priority', e.target.value)}
                  className="w-full px-3 py-2 bg-background/50 border border-border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-colors text-foreground"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="status-select"
                  className="text-sm font-medium text-foreground"
                >
                  Status
                </label>
                <select
                  id="status-select"
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full px-3 py-2 bg-background/50 border border-border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-colors text-foreground"
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="review">In Review</option>
                  <option value="done">Done</option>
                </select>
              </div>
            </div>

            {/* Assignee and Due Date */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-foreground">
                  <User className="w-4 h-4" />
                  <span>Assignee</span>
                </label>
                <Input
                  type="text"
                  placeholder="Assign to..."
                  value={formData.assignee}
                  onChange={(e) => handleChange('assignee', e.target.value)}
                  className="bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Due Date</span>
                </label>
                <Input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleChange('dueDate', e.target.value)}
                  className="bg-background/50"
                />
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <label
                htmlFor="tag-input"
                className="text-sm font-medium text-foreground"
              >
                Tags
              </label>
              <div className="flex gap-2">
                <Input
                  id="tag-input"
                  type="text"
                  placeholder="Add a tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  className="bg-background/50 flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addTag}
                  disabled={!tagInput.trim()}
                >
                  Add
                </Button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag) => (
                    <Badge
                      key={tag}
                      className="bg-primary/10 text-primary border-primary/20 pr-1"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-primary/60 hover:text-primary"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-6 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={createTask.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                disabled={createTask.isPending}
              >
                {createTask.isPending ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
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
    </div>
  );
}
