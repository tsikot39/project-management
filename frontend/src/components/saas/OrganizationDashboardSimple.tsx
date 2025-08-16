import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Building2,
  Users,
  FolderOpen,
  CheckSquare,
  BarChart3,
  Settings,
  Plus,
  Crown,
  TrendingUp,
  AlertTriangle,
  LogOut,
} from 'lucide-react';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

interface Organization {
  id: string;
  name: string;
  slug: string;
  subscription_plan: string;
  subscription_status: string;
  created_at: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  created_at: string;
  tasks_count: number;
}

export function OrganizationDashboardSimple() {
  const { orgSlug } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('projects');
  const [user, setUser] = useState<User | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [members, setMembers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user and organization from localStorage
    const storedUser = localStorage.getItem('user');
    const storedOrganization = localStorage.getItem('organization');

    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedOrganization) setOrganization(JSON.parse(storedOrganization));

    // Load dashboard data
    loadDashboardData();
  }, [orgSlug]);

  const loadDashboardData = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Load projects
      const projectsResponse = await fetch(
        `http://localhost:8000/api/organizations/${orgSlug}/projects`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json();
        setProjects(projectsData.data || []);
      }

      // Load members
      const membersResponse = await fetch(
        `http://localhost:8000/api/organizations/${orgSlug}/members`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (membersResponse.ok) {
        const membersData = await membersResponse.json();
        setMembers(membersData.data || []);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    localStorage.removeItem('organization');
    navigate('/');
  };

  const getSubscriptionBadgeColor = (plan: string) => {
    switch (plan) {
      case 'free':
        return 'bg-gray-100 text-gray-800';
      case 'starter':
        return 'bg-blue-100 text-blue-800';
      case 'professional':
        return 'bg-purple-100 text-purple-800';
      case 'enterprise':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">{organization?.name}</h1>
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getSubscriptionBadgeColor(organization?.subscription_plan || 'free')}`}
                  >
                    {organization?.subscription_plan?.toUpperCase() || 'FREE'}
                  </span>
                  <span className="text-sm text-gray-500">
                    projecthub.com/{orgSlug}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user?.first_name}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                Total Projects
              </span>
              <FolderOpen className="h-4 w-4 text-gray-400" />
            </div>
            <div className="text-2xl font-bold">{projects.length}</div>
            <p className="text-xs text-gray-500">+2 from last month</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                Team Members
              </span>
              <Users className="h-4 w-4 text-gray-400" />
            </div>
            <div className="text-2xl font-bold">{members.length}</div>
            <p className="text-xs text-gray-500">+1 from last week</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                Active Tasks
              </span>
              <CheckSquare className="h-4 w-4 text-gray-400" />
            </div>
            <div className="text-2xl font-bold">
              {projects.reduce(
                (sum, project) => sum + (project.tasks_count || 0),
                0
              )}
            </div>
            <p className="text-xs text-gray-500">+12% from last week</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                Completion Rate
              </span>
              <TrendingUp className="h-4 w-4 text-gray-400" />
            </div>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-gray-500">+5% from last month</p>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'projects', label: 'Projects', icon: FolderOpen },
                { id: 'members', label: 'Team Members', icon: Users },
                { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                { id: 'settings', label: 'Settings', icon: Settings },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Projects Tab */}
            {activeTab === 'projects' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Projects</h2>
                  <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Plus className="w-4 h-4 mr-2" />
                    New Project
                  </button>
                </div>

                <div className="space-y-4">
                  {projects.length === 0 ? (
                    <div className="text-center py-12">
                      <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">
                        No projects yet
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Get started by creating your first project
                      </p>
                      <button className="flex items-center mx-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Project
                      </button>
                    </div>
                  ) : (
                    projects.map((project) => (
                      <div
                        key={project.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-medium">
                            {project.name}
                          </h3>
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                            {project.status}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-4">
                          {project.description}
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>{project.tasks_count || 0} tasks</span>
                          <span>
                            Created{' '}
                            {new Date(project.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Members Tab */}
            {activeTab === 'members' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Team Members</h2>
                  <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Plus className="w-4 h-4 mr-2" />
                    Invite Member
                  </button>
                </div>

                <div className="space-y-4">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                          {member.first_name[0]}
                          {member.last_name[0]}
                        </div>
                        <div>
                          <p className="font-medium">
                            {member.first_name} {member.last_name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {member.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            member.role === 'owner'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {member.role === 'owner' && (
                            <Crown className="w-3 h-3 inline mr-1" />
                          )}
                          {member.role.toUpperCase()}
                        </span>
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            member.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {member.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Analytics</h2>
                <div className="text-center py-12">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    Analytics Coming Soon
                  </h3>
                  <p className="text-gray-600">
                    We're working on detailed analytics to help you track your
                    team's performance.
                  </p>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Organization Settings</h2>

                <div className="space-y-6">
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-medium mb-4">
                      Subscription Plan
                    </h3>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="font-medium">Current Plan</p>
                        <p className="text-sm text-gray-600">
                          {organization?.subscription_plan?.toUpperCase() ||
                            'FREE'}{' '}
                          Plan
                        </p>
                      </div>
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        Upgrade Plan
                      </button>
                    </div>

                    {organization?.subscription_plan === 'free' && (
                      <div className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg">
                        <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-yellow-800">
                            Upgrade to unlock more features
                          </p>
                          <p className="text-sm text-yellow-600">
                            Get more projects, team members, and advanced
                            features with a paid plan.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-medium mb-4">
                      Organization Details
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Organization Name
                        </p>
                        <p className="text-sm text-gray-600">
                          {organization?.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Organization URL
                        </p>
                        <p className="text-sm text-gray-600">
                          projecthub.com/{organization?.slug}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Created
                        </p>
                        <p className="text-sm text-gray-600">
                          {organization?.created_at
                            ? new Date(
                                organization.created_at
                              ).toLocaleDateString()
                            : 'N/A'}
                        </p>
                      </div>
                      <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        <Settings className="w-4 h-4 mr-2" />
                        Edit Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
