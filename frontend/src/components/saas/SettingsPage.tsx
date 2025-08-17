import { useState, useEffect } from 'react';
import {
  Settings,
  User,
  Building2,
  Bell,
  Shield,
  Database,
  Trash2,
  Save,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { api } from '../../services/api';

interface UserSettings {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  timezone: string;
  language: string;
  avatar?: string;
}

interface OrganizationSettings {
  name: string;
  website: string;
  description: string;
  industry: string;
  size: string;
  logo?: string;
}

interface NotificationSettings {
  email_notifications: boolean;
  push_notifications: boolean;
  project_updates: boolean;
  task_assignments: boolean;
  team_invitations: boolean;
  weekly_reports: boolean;
}

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const [userSettings, setUserSettings] = useState<UserSettings>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    timezone: 'America/New_York',
    language: 'en',
  });

  // Load user settings when component mounts
  useEffect(() => {
    const loadUserSettings = async () => {
      try {
        console.log('Loading user settings...');
        const response = await api.getUserSettings();
        console.log('API Response:', response);

        if (response.success && response.data) {
          console.log('Setting user data:', response.data);
          setUserSettings({
            first_name: response.data.first_name || '',
            last_name: response.data.last_name || '',
            email: response.data.email || '',
            phone: response.data.phone || '',
            timezone: response.data.timezone || 'America/New_York',
            language: response.data.language || 'en',
          });
        } else {
          console.log(
            'API call successful but no data or success=false:',
            response
          );
        }
      } catch (error) {
        console.error('Failed to load user settings:', error);
        setMessage({
          type: 'error',
          text: 'Failed to load user settings.',
        });
      }
    };

    loadUserSettings();
  }, []);

  const [orgSettings, setOrgSettings] = useState<OrganizationSettings>({
    name: 'Acme Corporation',
    website: 'https://acme.com',
    description: 'Leading software development company',
    industry: 'Technology',
    size: '50-100',
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    email_notifications: true,
    push_notifications: true,
    project_updates: true,
    task_assignments: true,
    team_invitations: true,
    weekly_reports: false,
  });

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
    show_current: false,
    show_new: false,
    show_confirm: false,
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
    {
      id: 'organization',
      label: 'Organization',
      icon: <Building2 className="w-4 h-4" />,
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <Bell className="w-4 h-4" />,
    },
    { id: 'security', label: 'Security', icon: <Shield className="w-4 h-4" /> },
    {
      id: 'data',
      label: 'Data & Privacy',
      icon: <Database className="w-4 h-4" />,
    },
  ];

  const timezones = [
    'America/New_York',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Berlin',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Australia/Sydney',
  ];

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'ja', label: 'Japanese' },
    { value: 'zh', label: 'Chinese' },
  ];

  const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Retail',
    'Manufacturing',
    'Consulting',
    'Other',
  ];

  const companySizes = [
    '1-10',
    '11-50',
    '51-100',
    '101-500',
    '501-1000',
    '1000+',
  ];

  const handleSave = async (section: string) => {
    setIsLoading(true);
    setMessage(null);

    try {
      if (section === 'profile') {
        // Save profile settings
        const response = await api.updateUserSettings({
          first_name: userSettings.first_name,
          last_name: userSettings.last_name,
          email: userSettings.email,
          phone: userSettings.phone,
          timezone: userSettings.timezone,
          language: userSettings.language,
        });

        if (response.success) {
          setMessage({
            type: 'success',
            text: response.message || 'Profile settings updated successfully!',
          });
        } else {
          throw new Error(
            response.message || 'Failed to update profile settings'
          );
        }
      } else if (section === 'password') {
        // Change password
        const response = await api.changePassword({
          current_password: passwordData.current_password,
          new_password: passwordData.new_password,
        });

        if (response.success) {
          setMessage({
            type: 'success',
            text: response.message || 'Password changed successfully!',
          });
        } else {
          throw new Error(
            response.message || 'Failed to change password'
          );
        }
      } else {
        // For other sections, simulate API call for now
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setMessage({
          type: 'success',
          text: `${section} settings updated successfully!`,
        });
      }

      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      console.error('Error updating settings:', error);
      setMessage({
        type: 'error',
        text:
          error.message ||
          `Failed to update ${section} settings. Please try again.`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.new_password !== passwordData.confirm_password) {
      setMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    if (passwordData.new_password.length < 8) {
      setMessage({
        type: 'error',
        text: 'New password must be at least 8 characters long.',
      });
      return;
    }

    await handleSave('password');

    if (message?.type === 'success') {
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: '',
        show_current: false,
        show_new: false,
        show_confirm: false,
      });
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE') {
      setMessage({ type: 'error', text: 'Please type "DELETE" to confirm.' });
      return;
    }

    setIsLoading(true);
    try {
      await api.deleteAccount();
      // Redirect to login page after successful deletion
      window.location.href = '/login';
    } catch (error) {
      console.error('Delete account error:', error);
      setMessage({ 
        type: 'error', 
        text: 'Failed to delete account. Please try again.' 
      });
    } finally {
      setIsLoading(false);
      setShowDeleteDialog(false);
      setDeleteConfirmation('');
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Profile Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={userSettings.first_name}
                    onChange={(e) =>
                      setUserSettings((prev) => ({
                        ...prev,
                        first_name: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={userSettings.last_name}
                    onChange={(e) =>
                      setUserSettings((prev) => ({
                        ...prev,
                        last_name: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={userSettings.email}
                    onChange={(e) =>
                      setUserSettings((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={userSettings.phone}
                    onChange={(e) =>
                      setUserSettings((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timezone
                  </label>
                  <select
                    value={userSettings.timezone}
                    onChange={(e) =>
                      setUserSettings((prev) => ({
                        ...prev,
                        timezone: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {timezones.map((tz) => (
                      <option key={tz} value={tz}>
                        {tz}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    value={userSettings.language}
                    onChange={(e) =>
                      setUserSettings((prev) => ({
                        ...prev,
                        language: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {languages.map((lang) => (
                      <option key={lang.value} value={lang.value}>
                        {lang.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Button
                  onClick={() => handleSave('profile')}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-colors"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        );

      case 'organization':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Organization Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organization Name
                  </label>
                  <input
                    type="text"
                    value={orgSettings.name}
                    onChange={(e) =>
                      setOrgSettings((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    value={orgSettings.website}
                    onChange={(e) =>
                      setOrgSettings((prev) => ({
                        ...prev,
                        website: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industry
                  </label>
                  <select
                    value={orgSettings.industry}
                    onChange={(e) =>
                      setOrgSettings((prev) => ({
                        ...prev,
                        industry: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {industries.map((industry) => (
                      <option key={industry} value={industry}>
                        {industry}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Size
                  </label>
                  <select
                    value={orgSettings.size}
                    onChange={(e) =>
                      setOrgSettings((prev) => ({
                        ...prev,
                        size: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {companySizes.map((size) => (
                      <option key={size} value={size}>
                        {size} employees
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={orgSettings.description}
                    onChange={(e) =>
                      setOrgSettings((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Button
                  onClick={() => handleSave('organization')}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-colors"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Notification Preferences
              </h3>
              <div className="space-y-4">
                {Object.entries(notifications).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {key
                          .split('_')
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(' ')}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {key === 'email_notifications' &&
                          'Receive notifications via email'}
                        {key === 'push_notifications' &&
                          'Receive push notifications in the browser'}
                        {key === 'project_updates' &&
                          'Get notified about project status changes'}
                        {key === 'task_assignments' &&
                          'Get notified when tasks are assigned to you'}
                        {key === 'team_invitations' &&
                          'Get notified about team member invitations'}
                        {key === 'weekly_reports' &&
                          'Receive weekly progress reports'}
                      </p>
                    </div>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) =>
                          setNotifications((prev) => ({
                            ...prev,
                            [key]: e.target.checked,
                          }))
                        }
                        className="sr-only"
                      />
                      <div
                        className={`w-12 h-6 rounded-full transition-colors ${value ? 'bg-blue-600' : 'bg-gray-300'}`}
                      >
                        <div
                          className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${value ? 'translate-x-6' : 'translate-x-0.5'} mt-0.5`}
                        />
                      </div>
                    </label>
                  </div>
                ))}
              </div>

              <div className="flex justify-end mt-6">
                <Button
                  onClick={() => handleSave('notifications')}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-colors"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Change Password
              </h3>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={passwordData.show_current ? 'text' : 'password'}
                      value={passwordData.current_password}
                      onChange={(e) =>
                        setPasswordData((prev) => ({
                          ...prev,
                          current_password: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setPasswordData((prev) => ({
                          ...prev,
                          show_current: !prev.show_current,
                        }))
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >
                      {passwordData.show_current ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={passwordData.show_new ? 'text' : 'password'}
                      value={passwordData.new_password}
                      onChange={(e) =>
                        setPasswordData((prev) => ({
                          ...prev,
                          new_password: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setPasswordData((prev) => ({
                          ...prev,
                          show_new: !prev.show_new,
                        }))
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >
                      {passwordData.show_new ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={passwordData.show_confirm ? 'text' : 'password'}
                      value={passwordData.confirm_password}
                      onChange={(e) =>
                        setPasswordData((prev) => ({
                          ...prev,
                          confirm_password: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setPasswordData((prev) => ({
                          ...prev,
                          show_confirm: !prev.show_confirm,
                        }))
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >
                      {passwordData.show_confirm ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-colors"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Update Password
                  </Button>
                </div>
              </form>
            </div>
          </div>
        );

      case 'data':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Account Management
              </h3>
              <div className="space-y-4">
                <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                  <h4 className="font-medium text-red-900 mb-2">Danger Zone</h4>
                  <p className="text-sm text-red-700 mb-4">
                    Permanently delete your account and all associated data.
                    This action cannot be undone.
                  </p>
                  <Button
                    variant="outline"
                    className="text-red-600 border-red-600 hover:bg-red-100"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </div>
            </div>

            {/* Delete Account Confirmation Dialog */}
            {showDeleteDialog && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Delete Account
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    This action cannot be undone. All your data, including projects, 
                    tasks, and team information, will be permanently deleted.
                  </p>
                  <p className="text-sm font-medium text-red-600 mb-4">
                    Type <strong>DELETE</strong> to confirm:
                  </p>
                  <input
                    type="text"
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 mb-4"
                    placeholder="Type DELETE here"
                  />
                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowDeleteDialog(false);
                        setDeleteConfirmation('');
                        setMessage(null);
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleDeleteAccount}
                      disabled={deleteConfirmation !== 'DELETE' || isLoading}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    >
                      {isLoading ? 'Deleting...' : 'Delete Account'}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <p className="text-gray-600">Settings content for {activeTab}</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-lg">
              <Settings className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage your account and organization preferences
              </p>
            </div>
          </div>
          {message && (
            <Badge
              className={
                message.type === 'success'
                  ? 'bg-green-100 text-green-800 border-green-300'
                  : 'bg-red-100 text-red-800 border-red-300'
              }
            >
              {message.text}
            </Badge>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 p-2">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
