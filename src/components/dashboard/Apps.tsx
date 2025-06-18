import React, { useState } from 'react';
import { 
  RiAddLine, RiSearchLine, RiFilterLine, RiApps2Line, 
  RiEyeLine, RiMore2Line, RiRefreshLine, RiLockLine, 
  RiDeleteBin6Line, RiSettings3Line, RiArrowRightSLine,
  RiCodeSSlashLine, RiDatabase2Line, RiShieldCheckLine,
  RiCheckLine
} from 'react-icons/ri';

function Apps() {
  // Sample application data
  const [apps, setApps] = useState([
    {
      id: 'app-1234',
      name: 'E-commerce Portal',
      description: 'Main customer-facing web application for our online store',
      type: 'Web Application',
      clientId: 'client_12345xyz',
      clientSecret: '•••••••••••••••••',
      status: 'active',
      createdAt: '2023-08-15T00:00:00Z',
      lastUsed: '2023-11-02T00:00:00Z',
      redirectUris: ['https://mystore.com/callback', 'https://mystore.com/auth/callback'],
      logo: null,
      apiUsage: 8750,
      activeUsers: 2340
    },
    {
      id: 'app-5678',
      name: 'Admin Dashboard',
      description: 'Internal admin panel for store management',
      type: 'Single Page App',
      clientId: 'client_67890abc',
      clientSecret: '•••••••••••••••••',
      status: 'active',
      createdAt: '2023-09-20T00:00:00Z',
      lastUsed: '2023-11-05T00:00:00Z',
      redirectUris: ['https://admin.mystore.com/auth/callback'],
      logo: null,
      apiUsage: 3420,
      activeUsers: 45
    },
    {
      id: 'app-9012',
      name: 'Mobile App',
      description: 'Native mobile application for iOS and Android',
      type: 'Native App',
      clientId: 'client_mobile123',
      clientSecret: '•••••••••••••••••',
      status: 'inactive',
      createdAt: '2023-07-10T00:00:00Z',
      lastUsed: '2023-10-15T00:00:00Z',
      redirectUris: ['com.mystore.app://callback'],
      logo: null,
      apiUsage: 12500,
      activeUsers: 1820
    }
  ]);

  // UI state management
  const [searchTerm, setSearchTerm] = useState('');
  const [appFilter, setAppFilter] = useState('all');
  const [showNewAppForm, setShowNewAppForm] = useState(false);
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const [newApp, setNewApp] = useState({
    name: '',
    description: '',
    type: 'Web Application',
    redirectUris: ['']
  });

  // Total API usage of all active applications
  const totalApiUsage = apps
    .filter(app => app.status === 'active')
    .reduce((sum, app) => sum + app.apiUsage, 0);

  // Filtered applications
  const filteredApps = apps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          app.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = appFilter === 'all' || 
                          (appFilter === 'active' && app.status === 'active') ||
                          (appFilter === 'inactive' && app.status === 'inactive');
    
    return matchesSearch && matchesFilter;
  });

  // Handle dropdown toggle
  const toggleDropdown = (appId: string) => {
    setShowDropdown(prev => prev === appId ? null : appId);
  };

  // Handle new app form submission
  const handleCreateApp = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create new app with generated IDs and default values
    const newAppData = {
      id: `app-${Math.floor(Math.random() * 10000)}`,
      clientId: `client_${Math.random().toString(36).substring(2, 10)}`,
      clientSecret: '•••••••••••••••••',
      status: 'active',
      createdAt: new Date().toISOString(),
      lastUsed: new Date().toISOString(),
      logo: null,
      apiUsage: 0,
      activeUsers: 0,
      ...newApp
    };
    
    setApps(prevApps => [newAppData, ...prevApps]);
    setShowNewAppForm(false);
    setNewApp({
      name: '',
      description: '',
      type: 'Web Application',
      redirectUris: ['']
    });
  };

  // Add a redirect URI field
  const addRedirectUri = () => {
    setNewApp(prev => ({
      ...prev,
      redirectUris: [...prev.redirectUris, '']
    }));
  };

  // Update a redirect URI field
  const updateRedirectUri = (index: number, value: string) => {
    const updatedUris = [...newApp.redirectUris];
    updatedUris[index] = value;
    setNewApp(prev => ({
      ...prev,
      redirectUris: updatedUris
    }));
  };

  // Remove a redirect URI field
  const removeRedirectUri = (index: number) => {
    if (newApp.redirectUris.length > 1) {
      const updatedUris = newApp.redirectUris.filter((_, i) => i !== index);
      setNewApp(prev => ({
        ...prev,
        redirectUris: updatedUris
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Applications</h1>
        <p className="text-gray-600">Manage your applications and API integrations</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex justify-between mb-3">
            <h2 className="text-sm font-medium text-gray-500">Total Apps</h2>
            <div className="p-2 bg-purple-100 rounded-full">
              <RiApps2Line className="text-purple-600 h-4 w-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">{apps.length}</p>
            <p className="text-xs text-gray-500 mt-1">
              <span className={apps.filter(app => app.status === 'active').length === apps.length ? "text-green-500" : "text-amber-500"}>
                {apps.filter(app => app.status === 'active').length} active
              </span> · {apps.filter(app => app.status === 'inactive').length} inactive
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex justify-between mb-3">
            <h2 className="text-sm font-medium text-gray-500">Active Users</h2>
            <div className="p-2 bg-blue-100 rounded-full">
              <RiUserLine className="text-blue-600 h-4 w-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">
              {apps.reduce((sum, app) => sum + app.activeUsers, 0).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">Across all applications</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex justify-between mb-3">
            <h2 className="text-sm font-medium text-gray-500">API Usage</h2>
            <div className="p-2 bg-green-100 rounded-full">
              <RiDatabase2Line className="text-green-600 h-4 w-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">{totalApiUsage.toLocaleString()}</p>
            <div className="w-full bg-gray-200 h-1.5 rounded-full mt-2">
              <div 
                className="bg-green-500 h-1.5 rounded-full" 
                style={{ width: `${Math.min((totalApiUsage / 50000) * 100, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">{Math.round((totalApiUsage / 50000) * 100)}% of monthly limit</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex justify-between mb-3">
            <h2 className="text-sm font-medium text-gray-500">Security</h2>
            <div className="p-2 bg-amber-100 rounded-full">
              <RiShieldCheckLine className="text-amber-600 h-4 w-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">Good</p>
            <p className="text-xs text-gray-500 mt-1">
              <span className="text-amber-600">2 issues</span> need attention
            </p>
            <button className="mt-2 text-xs text-[#67c6ff] hover:underline flex items-center">
              View security report <RiArrowRightSLine className="ml-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Action bar */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
        <div className="flex flex-wrap gap-4 justify-between items-center">
          <div className="flex flex-wrap gap-3">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#67c6ff]/30 focus:border-[#67c6ff] w-full sm:w-64"
              />
              <RiSearchLine className="absolute left-3 top-2.5 text-gray-400" />
            </div>
            
            {/* Filter */}
            <div className="relative">
              <select
                value={appFilter}
                onChange={(e) => setAppFilter(e.target.value)}
                className="pl-4 pr-10 py-2 rounded-lg appearance-none border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#67c6ff]/30 focus:border-[#67c6ff]"
              >
                <option value="all">All Apps</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <RiFilterLine className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" />
            </div>
          </div>
          
          <button 
            onClick={() => setShowNewAppForm(true)}
            className="px-4 py-2 bg-[#67c6ff] text-white rounded-lg flex items-center gap-2 hover:bg-[#57b6ff] transition-colors"
          >
            <RiAddLine className="text-base" /> New Application
          </button>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4 mb-6">
        {filteredApps.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-10 border border-gray-100 text-center">
            <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <RiApps2Line className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No applications found</h3>
            <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
              {searchTerm || appFilter !== 'all' ? 
                "No applications match your current filters. Try adjusting your search or filters." : 
                "You haven't created any applications yet. Click the 'New Application' button to get started."}
            </p>
            {(searchTerm || appFilter !== 'all') && (
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setAppFilter('all');
                }}
                className="mt-4 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
        
        {filteredApps.map((app) => (
          <div key={app.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <div className="h-12 w-12 rounded-lg bg-[#67c6ff]/10 flex items-center justify-center mr-4 text-[#67c6ff] font-bold">
                    {app.logo ? (
                      <img src={app.logo} alt={app.name} className="h-full w-full object-cover rounded-lg" />
                    ) : (
                      app.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <div className="flex items-center">
                      <h3 className="font-semibold text-lg text-gray-800">{app.name}</h3>
                      <span className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${
                        app.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {app.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{app.description}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="px-2 py-1 bg-gray-100 text-xs rounded text-gray-600">{app.type}</span>
                      <span className="px-2 py-1 bg-gray-100 text-xs rounded text-gray-600">
                        Created {new Date(app.createdAt).toLocaleDateString()}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-xs rounded text-gray-600">
                        {app.apiUsage.toLocaleString()} API calls
                      </span>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <button 
                    onClick={() => toggleDropdown(app.id)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <RiMore2Line className="text-gray-500" />
                  </button>
                  
                  {showDropdown === app.id && (
                    <div className="absolute right-0 mt-1 w-48 bg-white/90 backdrop-blur-sm rounded-md shadow-lg border border-gray-100/80 z-10">
                      <div className="py-1">
                        <button className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center w-full text-left">
                          <RiEyeLine className="mr-2" /> View Details
                        </button>
                        <button className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center w-full text-left">
                          <RiSettings3Line className="mr-2" /> Settings
                        </button>
                        <button className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center w-full text-left">
                          <RiRefreshLine className="mr-2" /> Reset Client Secret
                        </button>
                        <button className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center w-full text-left">
                          {app.status === 'active' ? (
                            <>
                              <RiLockLine className="mr-2" /> Disable App
                            </>
                          ) : (
                            <>
                              <RiCheckLine className="mr-2" /> Enable App
                            </>
                          )}
                        </button>
                        <hr className="my-1 border-gray-200" />
                        <button className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center w-full text-left">
                          <RiDeleteBin6Line className="mr-2" /> Delete App
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-5 pt-5 border-t border-gray-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <h4 className="text-xs font-medium uppercase text-gray-500 mb-2">Credentials</h4>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-gray-500">Client ID</p>
                        <div className="flex items-center mt-0.5">
                          <p className="text-sm font-mono text-gray-800 mr-2">{app.clientId}</p>
                          <button className="text-xs text-[#67c6ff]">Copy</button>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Client Secret</p>
                        <div className="flex items-center mt-0.5">
                          <p className="text-sm font-mono text-gray-800 mr-2">{app.clientSecret}</p>
                          <button className="text-xs text-[#67c6ff]">Reveal</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-medium uppercase text-gray-500 mb-2">Redirect URIs</h4>
                    <div className="space-y-1">
                      {app.redirectUris.map((uri, index) => (
                        <div key={index} className="flex items-center">
                          <p className="text-sm text-gray-800 font-mono truncate">{uri}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end gap-3">
                  <button className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg">
                    <RiCodeSSlashLine className="inline-block mr-1" /> Integration Guide
                  </button>
                  <button className="px-3 py-1.5 text-sm font-medium text-white bg-[#67c6ff] hover:bg-[#57b6ff] rounded-lg">
                    Manage App
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Application Modal */}
      {showNewAppForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Create New Application</h2>
              <button 
                onClick={() => setShowNewAppForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleCreateApp} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Application Name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={newApp.name}
                  onChange={(e) => setNewApp({...newApp, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#67c6ff]/30 focus:border-[#67c6ff]"
                  placeholder="My Application"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  value={newApp.description}
                  onChange={(e) => setNewApp({...newApp, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#67c6ff]/30 focus:border-[#67c6ff]"
                  rows={3}
                  placeholder="Brief description of your application"
                />
              </div>
              
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Application Type *
                </label>
                <select
                  id="type"
                  value={newApp.type}
                  onChange={(e) => setNewApp({...newApp, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#67c6ff]/30 focus:border-[#67c6ff]"
                  required
                >
                  <option value="Web Application">Web Application</option>
                  <option value="Single Page App">Single Page App</option>
                  <option value="Native App">Native App</option>
                  <option value="Machine to Machine">Machine to Machine</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  The type of application affects the authentication flow and security requirements.
                </p>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Redirect URIs *
                  </label>
                  <button 
                    type="button"
                    onClick={addRedirectUri}
                    className="text-xs text-[#67c6ff] hover:text-[#57b6ff]"
                  >
                    + Add Another
                  </button>
                </div>
                <p className="text-xs text-gray-500 mb-2">
                  URIs that authentication can redirect back to after login
                </p>
                
                <div className="space-y-2">
                  {newApp.redirectUris.map((uri, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="url"
                        value={uri}
                        onChange={(e) => updateRedirectUri(index, e.target.value)}
                        placeholder="https://myapp.com/callback"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#67c6ff]/30 focus:border-[#67c6ff]"
                        required
                      />
                      {newApp.redirectUris.length > 1 && (
                        <button 
                          type="button"
                          onClick={() => removeRedirectUri(index)}
                          className="p-2 text-gray-500 hover:text-red-500"
                        >
                          <RiDeleteBin6Line />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-5 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setShowNewAppForm(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-[#67c6ff] text-white rounded-lg hover:bg-[#57b6ff]"
                >
                  Create Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function RiUserLine(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      stroke="currentColor" 
      fill="currentColor" 
      strokeWidth="0" 
      viewBox="0 0 24 24" 
      height="1em" 
      width="1em" 
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g>
        <path fill="none" d="M0 0h24v24H0z"></path>
        <path d="M4 22a8 8 0 1 1 16 0h-2a6 6 0 1 0-12 0H4zm8-9c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6zm0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"></path>
      </g>
    </svg>
  );
}

export default Apps;