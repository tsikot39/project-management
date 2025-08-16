import { AlertTriangle, X, Trash2 } from 'lucide-react';

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

interface DeleteConfirmationModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onConfirm: () => void;
  readonly project: Project | null;
  readonly isDeleting: boolean;
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  project,
  isDeleting,
}: DeleteConfirmationModalProps) {
  if (!isOpen || !project) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <button
        className="fixed inset-0 bg-black/50 backdrop-blur-sm border-none cursor-default"
        onClick={onClose}
        aria-label="Close modal"
        disabled={isDeleting}
      />

      {/* Modal */}
      <div className="flex items-center justify-center min-h-screen px-4 py-8">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 border border-gray-200">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-red-50 to-orange-50 rounded-t-2xl">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg text-white">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Delete Project</h2>
                <p className="text-sm text-gray-600">
                  This action cannot be undone
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-full mb-4">
              <Trash2 className="w-8 h-8 text-red-600" />
            </div>
            
            <div className="text-center space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">
                Are you sure you want to delete this project?
              </h3>
              
              <div className="bg-gray-50 p-4 rounded-lg border">
                <p className="font-medium text-gray-900">{project.name}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {project.description || 'No description'}
                </p>
              </div>
              
              <div className="text-sm text-gray-600 space-y-2">
                <p>
                  This will permanently delete the project and all associated data including:
                </p>
                <ul className="text-left space-y-1 ml-4">
                  <li>• All project tasks</li>
                  <li>• Project settings and configurations</li>
                  <li>• Project history and activity logs</li>
                </ul>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800 font-medium">
                  ⚠️ This action cannot be undone!
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg hover:from-red-700 hover:to-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  <span>Deleting...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Project</span>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
