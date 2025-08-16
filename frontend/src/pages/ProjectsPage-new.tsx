import { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import {
  AppLayout,
  PageHeader,
  Section,
  EmptyState,
} from '../components/layout/AppLayout';

export function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const [projects] = useState([
    {
      id: 1,
      name: 'Website Redesign',
      description: 'Complete overhaul of company website with modern design',
      status: 'active',
      progress: 75,
      endDate: '2024-12-15',
      teamMembers: ['John', 'Sarah', 'Mike'],
      tasks: [
        { id: 1, completed: true, priority: 'high' },
        { id: 2, completed: true, priority: 'medium' },
        { id: 3, completed: false, priority: 'low' },
        { id: 4, completed: false, priority: 'high' },
      ],
    },
    {
      id: 2,
      name: 'Mobile App Development',
      description: 'Cross-platform mobile app using React Native',
      status: 'active',
      progress: 45,
      endDate: '2024-12-30',
      teamMembers: ['Lisa', 'Tom', 'Emma', 'Alex'],
      tasks: [
        { id: 5, completed: true, priority: 'high' },
        { id: 6, completed: false, priority: 'medium' },
        { id: 7, completed: false, priority: 'high' },
      ],
    },
    {
      id: 3,
      name: 'API Documentation',
      description: 'Comprehensive REST API documentation and examples',
      status: 'on-hold',
      progress: 90,
      endDate: '2024-11-20',
      teamMembers: ['David', 'Anna'],
      tasks: [
        { id: 8, completed: true, priority: 'medium' },
        { id: 9, completed: true, priority: 'low' },
      ],
    },
    {
      id: 4,
      name: 'User Research Study',
      description: 'Conduct user interviews and usability testing',
      status: 'completed',
      progress: 100,
      endDate: '2024-11-15',
      teamMembers: ['Rachel', 'Kevin', 'Sophia'],
      tasks: [
        { id: 10, completed: true, priority: 'high' },
        { id: 11, completed: true, priority: 'medium' },
      ],
    },
  ]);

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filter === 'all' ||
      (filter === 'active' && project.status !== 'completed') ||
      (filter === 'completed' && project.status === 'completed');

    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    const statusColors = {
      planning: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
      active: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
      'on-hold': 'bg-amber-500/10 text-amber-700 border-amber-500/20',
      completed: 'bg-gray-500/10 text-gray-700 border-gray-500/20',
    };
    return (
      statusColors[status as keyof typeof statusColors] ||
      'bg-gray-100 text-gray-700'
    );
  };

  const getProgress = (project: any) => {
    const totalTasks = project.tasks?.length || 0;
    const completedTasks =
      project.tasks?.filter((task: any) => task.completed)?.length || 0;
    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  };

  return (
    <AppLayout>
      <PageHeader
        title="Projects"
        description="Manage and track all your projects in one place"
        action={
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/25">
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        }
      />

      <Section className="space-y-6">
        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background/50 backdrop-blur-sm border-primary/20 focus:border-primary/40"
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button
              variant={filter === 'active' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('active')}
            >
              Active
            </Button>
            <Button
              variant={filter === 'completed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('completed')}
            >
              Completed
            </Button>
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <EmptyState
            icon={<Filter className="w-12 h-12" />}
            title="No projects found"
            description={
              searchQuery
                ? 'Try adjusting your search criteria'
                : 'Get started by creating your first project'
            }
            action={
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Project
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => {
              const progress = getProgress(project);
              return (
                <div
                  key={project.id}
                  className="group bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl shadow-lg shadow-primary/5 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                >
                  <div className="p-6">
                    {/* Project Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-200 truncate">
                          {project.name}
                        </h3>
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

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium text-foreground">
                          {progress}%
                        </span>
                      </div>
                      <div className="w-full bg-primary/10 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Project Stats */}
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="bg-background/50 rounded-lg p-3">
                        <div className="text-lg font-bold text-foreground">
                          {project.tasks?.length || 0}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Tasks
                        </div>
                      </div>
                      <div className="bg-background/50 rounded-lg p-3">
                        <div className="text-lg font-bold text-foreground">
                          {project.teamMembers?.length || 0}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Members
                        </div>
                      </div>
                      <div className="bg-background/50 rounded-lg p-3">
                        <div className="text-lg font-bold text-foreground">
                          {project.tasks?.filter(
                            (task: any) => task.priority === 'high'
                          )?.length || 0}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          High Priority
                        </div>
                      </div>
                    </div>

                    {/* Due Date */}
                    {project.endDate && (
                      <div className="mt-4 pt-4 border-t border-border/50">
                        <div className="text-xs text-muted-foreground">
                          Due: {new Date(project.endDate).toLocaleDateString()}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Section>
    </AppLayout>
  );
}
