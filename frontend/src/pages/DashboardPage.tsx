import { useState, useEffect } from 'react';
import {
  Calendar,
  TrendingUp,
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  useProjectStore,
  type Project,
  type Task,
} from '../stores/projectStore';
import { tasksApi } from '../services/saasApi';
import {
  AppLayout,
  PageHeader,
  StatsCard,
  Section,
} from '../components/layout/AppLayout';

export function DashboardPage() {
  const { projects, isLoading, fetchProjects } = useProjectStore();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [recentTasks] = useState([
    {
      id: 1,
      title: 'Design user registration flow',
      project: 'Website Redesign',
      status: 'in_progress',
      priority: 'high',
      dueDate: '2024-11-25',
    },
    {
      id: 2,
      title: 'Implement API authentication',
      project: 'Mobile App',
      status: 'todo',
      priority: 'high',
      dueDate: '2024-11-22',
    },
    {
      id: 3,
      title: 'User testing sessions',
      project: 'User Research',
      status: 'completed',
      priority: 'medium',
      dueDate: '2024-11-20',
    },
  ]);

  const fetchTasks = async () => {
    setIsLoadingTasks(true);
    try {
      const response = await tasksApi.getAll();
      if (response.success) {
        setTasks(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setIsLoadingTasks(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchTasks();
  }, [fetchProjects]);

  // Calculate stats
  const totalProjects = projects.length;
  const activeProjects = projects.filter(
    (p: Project) => p.status !== 'completed'
  ).length;

  // Debug: Log project statuses to help troubleshoot
  console.log('Projects:', projects.map(p => ({ name: p.name, status: p.status })));
  console.log('Tasks:', tasks.map(t => ({ title: t.title, status: t.status })));
  
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task: Task) => task.status === 'completed').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20';
      case 'in_progress':
        return 'bg-blue-500/10 text-blue-700 border-blue-500/20';
      case 'todo':
        return 'bg-amber-500/10 text-amber-700 border-amber-500/20';
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-500/20';
    }
  };

  const getPriorityColor = (priority: string) => {
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

  const getTaskStatusIcon = (task: { status: string; dueDate: string }) => {
    if (task.status === 'completed') {
      return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    }
    if (new Date(task.dueDate) < new Date()) {
      return <AlertTriangle className="w-4 h-4 text-red-500" />;
    }
    return <Clock className="w-4 h-4" />;
  };

  if (isLoading || isLoadingTasks) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's what's happening with your projects today."
      />

      {/* Stats Cards */}
      <Section className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Projects"
            value={totalProjects}
            description="Active and completed projects"
            icon={<Calendar className="w-6 h-6" />}
            trend={{ value: '+12% this month', isPositive: true }}
            color="primary"
          />
          <StatsCard
            title="Active Projects"
            value={activeProjects}
            description="Currently in progress"
            icon={<TrendingUp className="w-6 h-6" />}
            trend={{ value: '+8% this week', isPositive: true }}
            color="success"
          />
          <StatsCard
            title="Total Tasks"
            value={totalTasks}
            description="Across all projects"
            icon={<CheckCircle2 className="w-6 h-6" />}
            trend={{ value: `${completedTasks} completed`, isPositive: true }}
            color="secondary"
          />
          <StatsCard
            title="Team Members"
            value="12"
            description="Active contributors"
            icon={<Users className="w-6 h-6" />}
            trend={{ value: '+2 this month', isPositive: true }}
            color="warning"
          />
        </div>
      </Section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Projects */}
        <Section title="Recent Projects">
          <div className="space-y-4">
            {projects.slice(0, 3).map((project: Project) => {
              const projectTasks = tasks.filter(task => task.project_id === project.id);
              const progress = projectTasks.length
                ? Math.round(
                    (projectTasks.filter((task: Task) => task.status === 'completed')
                      .length /
                      projectTasks.length) *
                      100
                  )
                : 0;

              return (
                <div
                  key={project.id}
                  className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg p-4 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                        {project.name}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {project.description}
                      </p>
                    </div>
                    <Badge
                      className={`ml-3 capitalize ${getStatusColor(project.status)} border`}
                    >
                      {project.status}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>{project.tasks?.length || 0} tasks</span>
                      <span>{project.teamMembers?.length || 0} members</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{progress}%</span>
                      <div className="w-16 bg-primary/10 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <Button
              variant="outline"
              className="w-full border-dashed hover:border-primary hover:bg-primary/5 transition-all duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Project
            </Button>
          </div>
        </Section>

        {/* Recent Tasks & Deadlines */}
        <Section title="Recent Tasks & Deadlines">
          <div className="space-y-4">
            {recentTasks.map((task) => (
              <div
                key={task.id}
                className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg p-4 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
                      {task.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {task.project}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 ml-3">
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

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                  {getTaskStatusIcon(task)}
                </div>
              </div>
            ))}

            <Button variant="outline" className="w-full group">
              View All Tasks
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </Section>
      </div>

      {/* Quick Actions */}
      <Section title="Quick Actions" className="mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button className="h-20 flex-col space-y-2 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/25">
            <Plus className="w-6 h-6" />
            <span>New Project</span>
          </Button>
          <Button className="h-20 flex-col space-y-2 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg shadow-green-500/25">
            <CheckCircle2 className="w-6 h-6" />
            <span>New Task</span>
          </Button>
          <Button className="h-20 flex-col space-y-2 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-lg shadow-purple-500/25">
            <Users className="w-6 h-6" />
            <span>Invite Team</span>
          </Button>
          <Button className="h-20 flex-col space-y-2 bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/25">
            <TrendingUp className="w-6 h-6" />
            <span>View Reports</span>
          </Button>
        </div>
      </Section>
    </AppLayout>
  );
}
