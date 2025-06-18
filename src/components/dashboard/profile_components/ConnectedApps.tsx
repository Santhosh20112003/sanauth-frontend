import React from 'react';
import { RiApps2Line, RiShieldLine, RiArrowLeftLine } from 'react-icons/ri';
import { Link } from 'react-router-dom';

interface ConnectedApp {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  permissions: string[];
  connectedOn: string;
  lastUsed: string;
}

interface ConnectedAppsProps {
  apps?: ConnectedApp[];
  onRevokeAccess?: (appId: string) => void;
  standalone?: boolean;
  isLoading?: boolean;
}

// Date formatting utilities
const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    console.error("Date formatting error:", error);
    return "Invalid date";
  }
};

const getTimeSince = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  } catch (error) {
    console.error("Time calculation error:", error);
    return "Unknown time";
  }
};

// App card component
const AppCard: React.FC<{
  app: ConnectedApp;
  onRevoke: (appId: string) => void;
}> = ({ app, onRevoke }) => (
  <div className="border border-gray-200 rounded-lg p-4">
    <div className="flex justify-between">
      <div className="flex items-center">
        <div className="h-10 w-10 flex items-center justify-center text-lg bg-gray-100 rounded-lg mr-3">
          {app.icon}
        </div>
        <div>
          <h3 className="font-medium text-gray-900">{app.name}</h3>
          <p className="text-xs text-gray-500">{app.description}</p>
        </div>
      </div>
      <button
        onClick={() => onRevoke(app.id)}
        className="text-sm text-red-600 hover:text-red-700"
        aria-label={`Revoke access for ${app.name}`}
      >
        Revoke access
      </button>
    </div>

    <div className="mt-4 pt-3 border-t border-gray-100">
      <p className="text-xs text-gray-500 mb-1">Permissions:</p>
      <div className="flex flex-wrap gap-2">
        {app.permissions.map((permission, index) => (
          <span key={index} className="px-2 py-1 bg-gray-100 text-xs rounded text-gray-600">
            {permission}
          </span>
        ))}
      </div>
      <div className="flex justify-between mt-3 text-xs text-gray-500">
        <span>Connected on {formatDate(app.connectedOn)}</span>
        <span>Last used {getTimeSince(app.lastUsed)}</span>
      </div>
    </div>
  </div>
);

const ConnectedApps: React.FC<ConnectedAppsProps> = () => {
  const apps: ConnectedApp[] = [
    {
      id: '1',
      name: 'Example App',
      icon: <RiApps2Line className="h-6 w-6 text-gray-600" />,
      description: 'An example application that connects to your account.',
      permissions: ['Read profile', 'Access emails'],
      connectedOn: '2023-10-01T12:00:00Z',
      lastUsed: '2023-10-02T08:20:30Z'
    },
    {
      id: '2',
      name: 'Another App',
      icon: <RiApps2Line className="h-6 w-6 text-gray-600" />,
      description: 'Another application with different permissions.',
      permissions: ['Read profile', 'Write posts'],
      connectedOn: '2023-09-15T10:30:00Z',
      lastUsed: '2023-10-03T15:45:00Z'
    }
  ];

  const onRevokeAccess = (appId: string) => {
    console.log(`Revoke access for app ID: ${appId}`);
  };
  const standalone = false; // This would typically be passed as a prop
  const isLoading = false; // This would typically be managed by state or props

  return (
    <div className={`${standalone ? 'p-6 max-w-6xl mx-auto' : ''}`}>
      {standalone && (
        <div className="flex items-center mb-6">
          <Link to="/profile" className="flex items-center text-gray-600 hover:text-gray-900 mr-4">
            <RiArrowLeftLine className="mr-1" /> Back to Profile
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Connected Applications</h1>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="mb-6">
          {!standalone && <h2 className="text-lg font-semibold text-gray-800">Connected Applications</h2>}
          <p className="text-sm text-gray-500 mt-1">
            These applications have access to your account through OAuth. You can revoke access at any time.
          </p>
        </div>

        {isLoading ? (
          <div className="py-8 flex justify-center">
            <div className="animate-pulse text-center">
              <div className="h-4 w-48 bg-gray-200 rounded mb-4 mx-auto"></div>
              <div className="h-12 w-full max-w-lg bg-gray-100 rounded"></div>
            </div>
          </div>
        ) : apps.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <div className="mx-auto h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <RiApps2Line className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">No connected applications</h3>
            <p className="text-sm text-gray-500">
              You haven't authorized any applications to access your account.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {apps.map(app => (
              <AppCard
                key={app.id}
                app={app}
                onRevoke={onRevokeAccess}
              />
            ))}
          </div>
        )}

        <div className="mt-6 bg-blue-50 p-4 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <RiShieldLine className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Understanding app permissions</h3>
              <p className="text-sm text-blue-700 mt-1">
                Third-party applications can request access to different parts of your account. Always review permissions before connecting apps.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectedApps;
