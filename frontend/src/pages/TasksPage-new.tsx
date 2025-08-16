import { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import {
  AppLayout,
  PageHeader,
  Section,
  EmptyState,
} from '../components/layout/AppLayout';

interface Task {
  id: number;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee: string;
  project: string;
  dueDate: string;
  tags: string[];
  progress: number;
}

export function TasksPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'todo' | 'in_progress' | 'review' | 'done'
  >('all');
  const [priorityFilter, setPriorityFilter] = useState<
    'all' | 'low' | 'medium' | 'high'
  >('all');

  const [tasks] = useState<Task[]>([
    {
      id: 1,
      title: 'Design user registration flow',
      description:
        'Create wireframes and mockups for the user registration process',
      status: 'in_progress',
      priority: 'high',
      assignee: 'Sarah Chen',
      project: 'Website Redesign',
      dueDate: '2024-11-25',
      tags: ['ui/ux', 'design'],
      progress: 60,
    },
    {
      id: 2,
      title: 'Implement API authentication',
      description: 'Set up JWT authentication for the REST API endpoints',
      status: 'todo',
      priority: 'high',
      assignee: 'Mike Johnson',
      project: 'Mobile App Development',
      dueDate: '2024-11-22',
      tags: ['backend', 'security'],
      progress: 0,
    },
    {
      id: 3,
      title: 'Write documentation for deployment',
      description:
        'Create comprehensive deployment guide for production environment',
      status: 'review',
      priority: 'medium',
      assignee: 'David Kim',
      project: 'API Documentation',
      dueDate: '2024-11-20',
      tags: ['documentation', 'devops'],
      progress: 90,
    },
    {
      id: 4,
      title: 'Conduct user interviews',
      description:
        'Interview 10 potential users to gather feedback on the prototype',
      status: 'done',
      priority: 'medium',
      assignee: 'Rachel Davis',
      project: 'User Research Study',
      dueDate: '2024-11-15',
      tags: ['research', 'user-testing'],
      progress: 100,
    },
    {
      id: 5,
      title: 'Optimize database queries',
      description: 'Improve performance by optimizing slow database queries',
      status: 'todo',
      priority: 'low',
      assignee: 'Tom Wilson',
      project: 'Website Redesign',
      dueDate: '2024-12-01',
      tags: ['backend', 'performance'],
      progress: 0,
    },
  ]);

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.project.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority =
      priorityFilter === 'all' || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'todo':
        return <Circle className="w-4 h-4" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'review':
        return <AlertCircle className="w-4 h-4 text-amber-500" />;
      case 'done':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      default:
        return <Circle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    const statusColors = {
      todo: 'bg-gray-500/10 text-gray-700 border-gray-500/20',
      in_progress: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
      review: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
      done: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
    };
    return (
      statusColors[status as keyof typeof statusColors] ||
      'bg-gray-100 text-gray-700'
    );
  };

  const getPriorityColor = (priority: string) => {
    const priorityColors = {
      low: 'bg-green-500/10 text-green-700 border-green-500/20',
      medium: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
      high: 'bg-red-500/10 text-red-700 border-red-500/20',
    };
    return (
      priorityColors[priority as keyof typeof priorityColors] ||
      'bg-gray-100 text-gray-700'
    );
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <AppLayout>
      <PageHeader
        title="Tasks"
        description="Track and manage individual tasks across all projects"
        action={
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/25">
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </Button>
        }
      />

      <Section className="space-y-6">
        {/* Search and Filter Bar */}
        <div className="flex flex-col space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search tasks, projects, or assignees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background/50 backdrop-blur-sm border-primary/20 focus:border-primary/40"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="flex gap-1">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('all')}
              >
                All Status
              </Button>
              <Button
                variant={statusFilter === 'todo' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('todo')}
              >
                To Do
              </Button>
              <Button
                variant={statusFilter === 'in_progress' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('in_progress')}
              >
                In Progress
              </Button>
              <Button
                variant={statusFilter === 'review' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('review')}
              >
                Review
              </Button>
              <Button
                variant={statusFilter === 'done' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('done')}
              >
                Done
              </Button>
            </div>

            <div className="flex gap-1">
              <Button
                variant={priorityFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPriorityFilter('all')}
              >
                All Priority
              </Button>
              <Button
                variant={priorityFilter === 'high' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPriorityFilter('high')}
              >
                High
              </Button>
              <Button
                variant={priorityFilter === 'medium' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPriorityFilter('medium')}
              >
                Medium
              </Button>
              <Button
                variant={priorityFilter === 'low' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPriorityFilter('low')}
              >
                Low
              </Button>
            </div>
          </div>
        </div>

        {/* Tasks List */}
        {filteredTasks.length === 0 ? (
          <EmptyState
            icon={<Filter className="w-12 h-12" />}
            title="No tasks found"
            description={
              searchQuery
                ? 'Try adjusting your search criteria'
                : 'Get started by creating your first task'
            }
            action={
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Task
              </Button>
            }
          />
        ) : (
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="group bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl shadow-lg shadow-primary/5 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-3 flex-1 min-w-0">
                      <div className="mt-1">{getStatusIcon(task.status)}</div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-200 truncate">
                          {task.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {task.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
                      <Badge
                        className={`capitalize ${getStatusColor(task.status)} border`}
                      >
                        {task.status.replace('_', ' ')}
                      </Badge>
                      <Badge
                        className={`capitalize ${getPriorityColor(task.priority)} border`}
                      >
                        {task.priority}
                      </Badge>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {task.progress > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium text-foreground">
                          {task.progress}%
                        </span>
                      </div>
                      <div className="w-full bg-primary/10 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Task Meta Information */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <div className="text-muted-foreground">
                        <span className="font-medium">Project:</span>{' '}
                        {task.project}
                      </div>
                      <div className="text-muted-foreground">
                        <span className="font-medium">Assigned to:</span>{' '}
                        {task.assignee}
                      </div>
                    </div>

                    <div
                      className={`text-sm ${isOverdue(task.dueDate) && task.status !== 'done' ? 'text-red-600 font-medium' : 'text-muted-foreground'}`}
                    >
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                      {isOverdue(task.dueDate) &&
                        task.status !== 'done' &&
                        ' (Overdue)'}
                    </div>
                  </div>

                  {/* Tags */}
                  {task.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {task.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-background/50 text-xs text-muted-foreground rounded-md border border-border/30"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>
    </AppLayout>
  );
}
