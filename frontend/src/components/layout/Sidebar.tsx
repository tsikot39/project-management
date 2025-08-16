import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Home,
  FolderOpen,
  Users,
  BarChart3,
  Settings,
  X,
  LogOut,
  Building2,
} from 'lucide-react';
import { Button } from '../ui/button';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { orgSlug } = useParams<{ orgSlug: string }>();

  // Get organization data from localStorage
  const organizationData = localStorage.getItem('organization');
  const organization = organizationData ? JSON.parse(organizationData) : null;

  // Get user data from localStorage
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;

  const navigationItems = [
    {
      name: 'Dashboard',
      href: `/${orgSlug}/dashboard`,
      icon: Home,
      active: location.pathname === `/${orgSlug}/dashboard`,
    },
    {
      name: 'Projects',
      href: `/${orgSlug}/projects`,
      icon: FolderOpen,
      active: location.pathname.startsWith(`/${orgSlug}/projects`),
    },
    {
      name: 'Team',
      href: `/${orgSlug}/team`,
      icon: Users,
      active: location.pathname === `/${orgSlug}/team`,
    },
    {
      name: 'Reports',
      href: `/${orgSlug}/reports`,
      icon: BarChart3,
      active: location.pathname === `/${orgSlug}/reports`,
    },
    {
      name: 'Settings',
      href: `/${orgSlug}/settings`,
      icon: Settings,
      active: location.pathname === `/${orgSlug}/settings`,
    },
  ];

  const handleNavigation = (href: string) => {
    navigate(href);
    // Close mobile sidebar after navigation
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    localStorage.removeItem('organization');
    navigate('/login');
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:transform-none lg:flex lg:flex-col lg:w-64`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900">
                  Taskflow
                </h2>
                <p className="text-xs text-gray-500 truncate">
                  {organization?.name || 'Organization'} •{' '}
                  {organization?.subscription_plan
                    ? organization.subscription_plan.charAt(0).toUpperCase() +
                      organization.subscription_plan.slice(1)
                    : 'Free'}{' '}
                  Plan
                </p>
              </div>
            </div>

            {/* Close button for mobile */}
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-1 rounded-md hover:bg-gray-100"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    item.active
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <IconComponent
                    className={`w-5 h-5 mr-3 ${
                      item.active ? 'text-blue-700' : 'text-gray-400'
                    }`}
                  />
                  {item.name}
                </button>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">
                  {user?.first_name?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>

            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="w-full justify-center text-gray-600 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
