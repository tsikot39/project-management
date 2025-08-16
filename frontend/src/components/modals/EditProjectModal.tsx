import { useState, useEffect } from 'react';
import { X, Edit3, Calendar, Users, FileText } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useUpdateProject } from '../../hooks/useApi';
import { toast } from '../../lib/toast';
import type { Project } from '../../lib/api';

interface EditProjectModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly project: Project | null;
}

export function EditProjectModal({
  isOpen,
  onClose,
  project,
}: EditProjectModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    endDate: '',
    status: 'planning' as const,
  });

  const updateProject = useUpdateProject();

  // Initialize form data when project changes
  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        description: project.description || '',
        endDate: project.endDate || '',
        status: (project.status as any) || 'planning',
      });
    }
  }, [project, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!project) return;

    if (!formData.name.trim()) {
      toast.error('Project name is required');
      return;
    }

    try {
      await updateProject.mutateAsync({ 
        id: project.id, 
        updates: {
          name: formData.name,
          description: formData.description,
          endDate: formData.endDate,
          status: formData.status,
        }
      });

      toast.success('Project updated successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to update project');
      console.error('Error updating project:', error);
    }
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleClose = () => {
    // Reset form data when closing
    if (project) {
      setFormData({
        name: project.name || '',
        description: project.description || '',
        endDate: project.endDate || '',
        status: (project.status as any) || 'planning',
      });
    }
    onClose();
  };

  if (!isOpen || !project) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <button
        className="fixed inset-0 bg-black/50 backdrop-blur-sm border-none cursor-default"
        onClick={handleClose}
        onKeyDown={(e) => e.key === 'Escape' && handleClose()}
        aria-label="Close modal"
        type="button"
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-card border border-border rounded-xl shadow-2xl shadow-primary/10 w-full max-w-md">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                <Edit3 className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                Edit Project
              </h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Project Name */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-medium text-foreground">
                <FileText className="w-4 h-4" />
                <span>Project Name</span>
              </label>
              <Input
                type="text"
                placeholder="Enter project name..."
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="bg-background/50"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label
                htmlFor="edit-project-description"
                className="text-sm font-medium text-foreground"
              >
                Description
              </label>
              <textarea
                id="edit-project-description"
                placeholder="Describe your project..."
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-background/50 border border-border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-colors text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-medium text-foreground">
                <Calendar className="w-4 h-4" />
                <span>End Date</span>
              </label>
              <Input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleChange('endDate', e.target.value)}
                className="bg-background/50"
              />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-medium text-foreground">
                <Users className="w-4 h-4" />
                <span>Status</span>
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full px-3 py-2 bg-background/50 border border-border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-colors text-foreground"
              >
                <option value="planning">Planning</option>
                <option value="active">Active</option>
                <option value="on-hold">On Hold</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-6 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
                disabled={updateProject.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                disabled={updateProject.isPending}
              >
                {updateProject.isPending ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    <span>Updating...</span>
                  </div>
                ) : (
                  'Update Project'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
