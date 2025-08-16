import { useState } from 'react';
import {
  Plus,
  MoreHorizontal,
  User,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { AppLayout, PageHeader } from '../components/layout/AppLayout';
import { CreateTaskModal } from '../components/modals/CreateTaskModal';

type Priority = 'low' | 'medium' | 'high';

interface Task {
  id: number;
  title: string;
  description?: string;
  priority: Priority;
  assignee: string;
  dueDate: string;
  tags: string[];
}

interface Column {
  id: string;
  title: string;
  color: string;
  bgColor: string;
  textColor: string;
  tasks: Task[];
}

export function KanbanPage() {
  const [createTaskModalOpen, setCreateTaskModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('todo');

  const [columns] = useState<Column[]>([
    {
      id: 'todo',
      title: 'To Do',
      color: 'border-gray-300',
      bgColor: 'bg-gray-50',
      textColor: 'text-gray-700',
      tasks: [
        {
          id: 1,
          title: 'Design user onboarding flow',
          description:
            'Create wireframes and user journey maps for the new user onboarding process',
          priority: 'high',
          assignee: 'Sarah Chen',
          dueDate: '2024-11-25',
          tags: ['ui/ux', 'design'],
        },
        {
          id: 2,
          title: 'Set up CI/CD pipeline',
          description: 'Configure automated testing and deployment workflow',
          priority: 'medium',
          assignee: 'Mike Johnson',
          dueDate: '2024-11-30',
          tags: ['devops', 'automation'],
        },
        {
          id: 3,
          title: 'Create mobile responsive layouts',
          description: 'Ensure all components work properly on mobile devices',
          priority: 'high',
          assignee: 'Emma Wilson',
          dueDate: '2024-11-28',
          tags: ['frontend', 'responsive'],
        },
      ],
    },
    {
      id: 'in_progress',
      title: 'In Progress',
      color: 'border-blue-300',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      tasks: [
        {
          id: 4,
          title: 'Implement authentication API',
          description:
            'Build JWT-based authentication system with refresh tokens',
          priority: 'high',
          assignee: 'David Kim',
          dueDate: '2024-11-22',
          tags: ['backend', 'security'],
        },
        {
          id: 5,
          title: 'Database optimization',
          description: 'Optimize slow queries and add proper indexing',
          priority: 'low',
          assignee: 'Tom Wilson',
          dueDate: '2024-12-01',
          tags: ['backend', 'performance'],
        },
      ],
    },
    {
      id: 'review',
      title: 'In Review',
      color: 'border-amber-300',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-700',
      tasks: [
        {
          id: 6,
          title: 'API documentation update',
          description: 'Update OpenAPI specs and add usage examples',
          priority: 'medium',
          assignee: 'Anna Davis',
          dueDate: '2024-11-20',
          tags: ['documentation', 'api'],
        },
        {
          id: 7,
          title: 'User interface testing',
          description: 'Conduct usability tests with 5 target users',
          priority: 'high',
          assignee: 'Lisa Thompson',
          dueDate: '2024-11-24',
          tags: ['testing', 'ux'],
        },
      ],
    },
    {
      id: 'done',
      title: 'Done',
      color: 'border-green-300',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      tasks: [
        {
          id: 8,
          title: 'User research interviews',
          description: 'Completed interviews with 10 potential users',
          priority: 'medium',
          assignee: 'Rachel Davis',
          dueDate: '2024-11-15',
          tags: ['research', 'user-testing'],
        },
        {
          id: 9,
          title: 'Initial mockup designs',
          description: 'Created high-fidelity mockups for main features',
          priority: 'high',
          assignee: 'Kevin Lee',
          dueDate: '2024-11-18',
          tags: ['design', 'mockups'],
        },
      ],
    },
  ]);

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/10 text-red-700 border-red-500/20';
      case 'medium':
        return 'bg-amber-500/10 text-amber-700 border-amber-500/20';
      case 'low':
        return 'bg-green-500/10 text-green-700 border-green-500/20';
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-500/20';
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const totalTasks = columns.reduce(
    (acc, column) => acc + column.tasks.length,
    0
  );

  const handleAddTask = (status: string) => {
    setSelectedStatus(status);
    setCreateTaskModalOpen(true);
  };

  return (
    <AppLayout>
      <PageHeader
        title="Kanban Board"
        description={`Visual task management with ${totalTasks} tasks across ${columns.length} columns`}
        action={
          <Button
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/25"
            onClick={() => handleAddTask('todo')}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </Button>
        }
      />

      {/* Kanban Board */}
      <div className="overflow-x-auto">
        <div className="flex gap-6 pb-6" style={{ minWidth: 'max-content' }}>
          {columns.map((column) => (
            <div
              key={column.id}
              className="flex-shrink-0 w-80 bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl shadow-lg shadow-primary/5"
            >
              {/* Column Header */}
              <div
                className={`${column.bgColor} ${column.color} border-b p-4 rounded-t-xl`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h3 className={`font-semibold text-lg ${column.textColor}`}>
                      {column.title}
                    </h3>
                    <Badge
                      variant="outline"
                      className={`${column.textColor} border-current bg-transparent`}
                    >
                      {column.tasks.length}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Column Content */}
              <div className="p-4 space-y-3 min-h-[600px]">
                {column.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="group bg-card border border-border/50 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
                  >
                    <div className="p-4">
                      {/* Task Header */}
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 flex-1 pr-2">
                          {task.title}
                        </h4>
                        <Badge
                          className={`capitalize ${getPriorityColor(task.priority)} border flex-shrink-0`}
                        >
                          {task.priority}
                        </Badge>
                      </div>

                      {/* Task Description */}
                      {task.description && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {task.description}
                        </p>
                      )}

                      {/* Task Tags */}
                      {task.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {task.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-background/80 text-xs text-muted-foreground rounded-md border border-border/30"
                            >
                              #{tag}
                            </span>
                          ))}
                          {task.tags.length > 2 && (
                            <span className="px-2 py-1 bg-background/80 text-xs text-muted-foreground rounded-md border border-border/30">
                              +{task.tags.length - 2}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Task Footer */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <User className="w-4 h-4" />
                          <span className="truncate">{task.assignee}</span>
                        </div>

                        <div
                          className={`flex items-center gap-1 ${isOverdue(task.dueDate) ? 'text-red-600' : 'text-muted-foreground'}`}
                        >
                          {isOverdue(task.dueDate) && (
                            <AlertCircle className="w-4 h-4" />
                          )}
                          <Calendar className="w-4 h-4" />
                          <span className="text-xs">
                            {new Date(task.dueDate).toLocaleDateString(
                              'en-US',
                              {
                                month: 'short',
                                day: 'numeric',
                              }
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add Task Button */}
                <Button
                  variant="ghost"
                  className="w-full border-2 border-dashed border-border/50 hover:border-primary/50 hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all duration-200"
                  onClick={() => handleAddTask(column.id)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Task
                </Button>
              </div>
            </div>
          ))}

          {/* Add Column Button */}
          <div className="flex-shrink-0 w-80">
            <Button
              variant="ghost"
              className="w-full h-32 border-2 border-dashed border-border/50 hover:border-primary/50 hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all duration-200 rounded-xl"
            >
              <Plus className="w-6 h-6 mr-2" />
              Add Column
            </Button>
          </div>
        </div>
      </div>

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={createTaskModalOpen}
        onClose={() => setCreateTaskModalOpen(false)}
        initialStatus={selectedStatus}
      />
    </AppLayout>
  );
}
