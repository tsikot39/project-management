import { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  Download,
  Filter,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface ProjectStats {
  name: string;
  total_tasks: number;
  completed_tasks: number;
  overdue_tasks: number;
  completion_rate: number;
}

interface TeamMemberStats {
  name: string;
  assigned_tasks: number;
  completed_tasks: number;
  completion_rate: number;
  average_completion_time: string;
}

export function ReportsPage() {
  const [timeFilter, setTimeFilter] = useState('30d');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - replace with actual API calls
  const overallStats = {
    total_projects: 12,
    active_projects: 8,
    completed_projects: 4,
    total_tasks: 156,
    completed_tasks: 98,
    overdue_tasks: 12,
    team_members: 8,
    avg_completion_time: '3.2 days',
  };

  const projectStats: ProjectStats[] = [
    {
      name: 'Website Redesign',
      total_tasks: 24,
      completed_tasks: 18,
      overdue_tasks: 2,
      completion_rate: 75,
    },
    {
      name: 'Mobile App Development',
      total_tasks: 32,
      completed_tasks: 20,
      overdue_tasks: 3,
      completion_rate: 62.5,
    },
    {
      name: 'Marketing Campaign',
      total_tasks: 16,
      completed_tasks: 14,
      overdue_tasks: 0,
      completion_rate: 87.5,
    },
    {
      name: 'API Integration',
      total_tasks: 20,
      completed_tasks: 12,
      overdue_tasks: 4,
      completion_rate: 60,
    },
    {
      name: 'User Research',
      total_tasks: 12,
      completed_tasks: 11,
      overdue_tasks: 1,
      completion_rate: 91.7,
    },
  ];

  const teamStats: TeamMemberStats[] = [
    {
      name: 'Sarah Chen',
      assigned_tasks: 18,
      completed_tasks: 16,
      completion_rate: 88.9,
      average_completion_time: '2.5 days',
    },
    {
      name: 'Mike Johnson',
      assigned_tasks: 22,
      completed_tasks: 18,
      completion_rate: 81.8,
      average_completion_time: '3.1 days',
    },
    {
      name: 'Emma Wilson',
      assigned_tasks: 15,
      completed_tasks: 13,
      completion_rate: 86.7,
      average_completion_time: '2.8 days',
    },
    {
      name: 'David Kim',
      assigned_tasks: 20,
      completed_tasks: 15,
      completion_rate: 75.0,
      average_completion_time: '3.6 days',
    },
    {
      name: 'Lisa Thompson',
      assigned_tasks: 14,
      completed_tasks: 12,
      completion_rate: 85.7,
      average_completion_time: '2.2 days',
    },
  ];

  const timeFilters = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 3 months' },
    { value: '1y', label: 'Last year' },
  ];

  const getCompletionColor = (rate: number) => {
    if (rate >= 80) return 'text-green-600 bg-green-100';
    if (rate >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const exportReport = () => {
    setIsLoading(true);
    // Simulate export process
    setTimeout(() => {
      setIsLoading(false);
      // In real app, this would trigger file download
      alert('Report exported successfully!');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-lg">
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Reports & Analytics
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Track your team's progress and project performance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {timeFilters.map((filter) => (
                  <option key={filter.value} value={filter.value}>
                    {filter.label}
                  </option>
                ))}
              </select>
            </div>

            <Button
              onClick={exportReport}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              {isLoading ? 'Exporting...' : 'Export Report'}
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Projects
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {overallStats.total_projects}
                </p>
                <p className="text-sm text-green-600 mt-1">
                  {overallStats.active_projects} active
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Task Completion
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {Math.round(
                    (overallStats.completed_tasks / overallStats.total_tasks) *
                      100
                  )}
                  %
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {overallStats.completed_tasks}/{overallStats.total_tasks}{' '}
                  tasks
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Overdue Tasks
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {overallStats.overdue_tasks}
                </p>
                <p className="text-sm text-red-600 mt-1">
                  {Math.round(
                    (overallStats.overdue_tasks / overallStats.total_tasks) *
                      100
                  )}
                  % of total
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Avg. Completion
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {overallStats.avg_completion_time}
                </p>
                <p className="text-sm text-gray-500 mt-1">per task</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Project Performance */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Project Performance
                </h2>
                <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                  {projectStats.length} Projects
                </Badge>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {projectStats.map((project, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-900">
                        {project.name}
                      </h3>
                      <Badge
                        className={`${getCompletionColor(project.completion_rate)} border-0`}
                      >
                        {project.completion_rate.toFixed(1)}%
                      </Badge>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${project.completion_rate}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>
                        {project.completed_tasks}/{project.total_tasks} tasks
                        completed
                      </span>
                      {project.overdue_tasks > 0 && (
                        <span className="text-red-600 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          {project.overdue_tasks} overdue
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Team Performance */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Team Performance
                </h2>
                <Badge className="bg-green-100 text-green-800 border-green-300">
                  {teamStats.length} Members
                </Badge>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {teamStats.map((member, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {member.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </div>
                        <h3 className="font-medium text-gray-900">
                          {member.name}
                        </h3>
                      </div>
                      <Badge
                        className={`${getCompletionColor(member.completion_rate)} border-0`}
                      >
                        {member.completion_rate.toFixed(1)}%
                      </Badge>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${member.completion_rate}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>
                        {member.completed_tasks}/{member.assigned_tasks} tasks
                      </span>
                      <span>Avg: {member.average_completion_time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Productivity Trends Chart Placeholder */}
        <div className="bg-white rounded-xl border border-gray-200 mt-8">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Productivity Trends
              </h2>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600 font-medium">
                  +12% this month
                </span>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">
                  Interactive Chart Coming Soon
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  This area will display productivity trends over time
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
