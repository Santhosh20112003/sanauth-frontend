import React, { useState } from 'react';
import {
  RiLockLine, RiBellLine, RiUserSettingsLine, RiGlobalLine, RiKeyLine,
  RiShieldCheckLine, RiMailLine, RiSaveLine, RiInformationLine, RiArrowLeftSLine, RiArrowRightSLine,
  RiAddLine
} from 'react-icons/ri';

function Settings() {
  const [activeSection, setActiveSection] = useState('security');

  // Settings state
  const [securitySettings, setSecuritySettings] = useState({
    mfaEnabled: true,
    passwordExpiration: '90',
    sessionTimeout: '30',
    failedAttempts: '5',
    ipRestrictions: ''
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    loginNotifications: true,
    weeklyReports: false,
    securityAlerts: true
  });

  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'system',
    compactMode: false
  });

  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, type, checked, value } = e.target as HTMLInputElement;
    setSecuritySettings({
      ...securitySettings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotificationSettings({
      ...notificationSettings,
      [name]: checked
    });
  };

  const handleAppearanceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, type, checked, value } = e.target as HTMLInputElement;
    setAppearanceSettings({
      ...appearanceSettings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const resetToDefaultSettings = () => {
    // Implement reset to default
    alert('Settings would be reset to default values');
  };

  // Settings navigation items
  const settingsNavItems = [
    { id: 'security', label: 'Security', icon: RiShieldCheckLine },
    { id: 'notifications', label: 'Notifications', icon: RiBellLine },
    { id: 'appearance', label: 'Appearance', icon: RiUserSettingsLine },
    { id: 'apiKeys', label: 'API Keys', icon: RiKeyLine },
    { id: 'domains', label: 'Domains & URLs', icon: RiGlobalLine }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Product Settings</h1>
        <p className="text-gray-600">Configure your authentication system and preferences</p>
      </div>

      {/* Settings Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar Navigation */}
          <div className="md:w-64 md:border-r border-gray-100 flex-shrink-0">
            <nav className="p-5 space-y-1">
              {settingsNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                    activeSection === item.id 
                      ? 'bg-[#67c6ff]/10 text-[#67c6ff]' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="mr-3 text-lg" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>

            {/* Reset Settings Button */}
            <div className="p-5 border-t border-gray-100">
              <button
                onClick={resetToDefaultSettings}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Reset to Defaults
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-6 md:p-8">
            {/* Security Settings */}
            {activeSection === 'security' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-6">Security Settings</h2>
                
                <div className="space-y-6">
                  {/* MFA Setting */}
                  <div className="flex justify-between items-start pb-5 border-b border-gray-100">
                    <div>
                      <div className="flex items-center mb-1">
                        <RiLockLine className="text-[#67c6ff] mr-2" />
                        <h3 className="font-medium text-gray-800">Multi-Factor Authentication</h3>
                      </div>
                      <p className="text-sm text-gray-500 mb-1">
                        Require users to verify their identity with a second factor when logging in
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        name="mfaEnabled" 
                        checked={securitySettings.mfaEnabled} 
                        onChange={handleSecurityChange} 
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#67c6ff]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#67c6ff]"></div>
                    </label>
                  </div>

                  {/* Password Settings */}
                  <div className="pb-5 border-b border-gray-100">
                    <div className="flex items-center mb-3">
                      <RiKeyLine className="text-[#67c6ff] mr-2" />
                      <h3 className="font-medium text-gray-800">Password Settings</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-700 mb-1">Password Expiration (days)</label>
                          <select
                            name="passwordExpiration"
                            value={securitySettings.passwordExpiration}
                            onChange={handleSecurityChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#67c6ff]/30 focus:border-[#67c6ff]"
                          >
                            <option value="never">Never</option>
                            <option value="30">30 days</option>
                            <option value="60">60 days</option>
                            <option value="90">90 days</option>
                            <option value="180">180 days</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm text-gray-700 mb-1">Failed Login Attempts</label>
                          <select
                            name="failedAttempts"
                            value={securitySettings.failedAttempts}
                            onChange={handleSecurityChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#67c6ff]/30 focus:border-[#67c6ff]"
                          >
                            <option value="3">3 attempts</option>
                            <option value="5">5 attempts</option>
                            <option value="10">10 attempts</option>
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">Session Timeout (minutes)</label>
                        <select
                          name="sessionTimeout"
                          value={securitySettings.sessionTimeout}
                          onChange={handleSecurityChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#67c6ff]/30 focus:border-[#67c6ff]"
                        >
                          <option value="15">15 minutes</option>
                          <option value="30">30 minutes</option>
                          <option value="60">60 minutes</option>
                          <option value="120">2 hours</option>
                          <option value="240">4 hours</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* IP Restrictions */}
                  <div className="pb-5 border-b border-gray-100">
                    <div className="flex items-center mb-3">
                      <RiGlobalLine className="text-[#67c6ff] mr-2" />
                      <h3 className="font-medium text-gray-800">IP Address Restrictions</h3>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Allowed IP Addresses</label>
                      <textarea
                        name="ipRestrictions"
                        value={securitySettings.ipRestrictions}

                        placeholder="Enter IP addresses or CIDR ranges (one per line)"
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#67c6ff]/30 focus:border-[#67c6ff]"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Leave empty to allow all IP addresses. Add one IP address or range per line.
                      </p>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end">
                    <button 
                      className="px-5 py-2.5 bg-[#67c6ff] text-white rounded-lg hover:bg-[#57b6ff] transition-colors flex items-center"
                    >
                      <RiSaveLine className="mr-2" /> Save Security Settings
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeSection === 'notifications' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-6">Notification Settings</h2>
                
                <div className="space-y-6">
                  <div className="space-y-4">
                    {/* Email Alerts */}
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <div>
                        <h3 className="font-medium text-gray-800">Email Alerts</h3>
                        <p className="text-sm text-gray-500">Receive important security and system alerts via email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          name="emailAlerts" 
                          checked={notificationSettings.emailAlerts} 
                          onChange={handleNotificationChange} 
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#67c6ff]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#67c6ff]"></div>
                      </label>
                    </div>
                    
                    {/* Login Notifications */}
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <div>
                        <h3 className="font-medium text-gray-800">Login Notifications</h3>
                        <p className="text-sm text-gray-500">Get notified when users log in to your application</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          name="loginNotifications" 
                          checked={notificationSettings.loginNotifications} 
                          onChange={handleNotificationChange} 
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#67c6ff]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#67c6ff]"></div>
                      </label>
                    </div>
                    
                    {/* Weekly Reports */}
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <div>
                        <h3 className="font-medium text-gray-800">Weekly Activity Reports</h3>
                        <p className="text-sm text-gray-500">Receive a summary of authentication activity each week</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          name="weeklyReports" 
                          checked={notificationSettings.weeklyReports} 
                          onChange={handleNotificationChange} 
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#67c6ff]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#67c6ff]"></div>
                      </label>
                    </div>
                    
                    {/* Security Alerts */}
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <div>
                        <h3 className="font-medium text-gray-800">Security Alerts</h3>
                        <p className="text-sm text-gray-500">Get notified about suspicious activities or security threats</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          name="securityAlerts" 
                          checked={notificationSettings.securityAlerts} 
                          onChange={handleNotificationChange} 
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#67c6ff]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#67c6ff]"></div>
                      </label>
                    </div>
                  </div>

                  {/* Email Settings */}
                  <div className="mt-8">
                    <div className="flex items-center mb-3">
                      <RiMailLine className="text-[#67c6ff] mr-2" />
                      <h3 className="font-medium text-gray-800">Email Preferences</h3>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-3">
                        Notification emails are sent to the following addresses:
                      </p>
                      <div className="flex items-center mb-3">
                        <input
                          type="email"
                          placeholder="Enter email address"
                          className="flex-1 mr-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#67c6ff]/30 focus:border-[#67c6ff]"
                        />
                        <button className="px-4 py-2 bg-[#67c6ff] text-white rounded-lg hover:bg-[#57b6ff] transition-colors">
                          Add
                        </button>
                      </div>
                      <div className="flex items-center justify-between px-3 py-2 bg-white rounded-lg border border-gray-200">
                        <span className="text-sm text-gray-800">admin@example.com</span>
                        <button className="text-red-500 hover:text-red-600">Remove</button>
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end">
                    <button 
                      className="px-5 py-2.5 bg-[#67c6ff] text-white rounded-lg hover:bg-[#57b6ff] transition-colors flex items-center"
                    >
                      <RiSaveLine className="mr-2" /> Save Notification Settings
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Appearance */}
            {activeSection === 'appearance' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-6">Appearance Settings</h2>
                
                <div className="space-y-6">
                  {/* Theme Selection */}
                  <div className="pb-5 border-b border-gray-100">
                    <h3 className="font-medium text-gray-800 mb-3">Theme</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <label className={`cursor-pointer rounded-lg border p-4 flex flex-col items-center ${appearanceSettings.theme === 'light' ? 'border-[#67c6ff] bg-[#67c6ff]/5' : 'border-gray-200'}`}>
                        <input 
                          type="radio" 
                          name="theme" 
                          value="light"
                          checked={appearanceSettings.theme === 'light'} 
                          onChange={handleAppearanceChange} 
                          className="sr-only" 
                        />
                        <div className="h-20 w-full bg-white border border-gray-200 rounded mb-3"></div>
                        <span className="text-sm font-medium text-gray-800">Light</span>
                      </label>
                      
                      <label className={`cursor-pointer rounded-lg border p-4 flex flex-col items-center ${appearanceSettings.theme === 'dark' ? 'border-[#67c6ff] bg-[#67c6ff]/5' : 'border-gray-200'}`}>
                        <input 
                          type="radio" 
                          name="theme" 
                          value="dark"
                          checked={appearanceSettings.theme === 'dark'} 
                          onChange={handleAppearanceChange} 
                          className="sr-only" 
                        />
                        <div className="h-20 w-full bg-gray-800 border border-gray-700 rounded mb-3"></div>
                        <span className="text-sm font-medium text-gray-800">Dark</span>
                      </label>
                      
                      <label className={`cursor-pointer rounded-lg border p-4 flex flex-col items-center ${appearanceSettings.theme === 'system' ? 'border-[#67c6ff] bg-[#67c6ff]/5' : 'border-gray-200'}`}>
                        <input 
                          type="radio" 
                          name="theme" 
                          value="system"
                          checked={appearanceSettings.theme === 'system'} 
                          onChange={handleAppearanceChange} 
                          className="sr-only" 
                        />
                        <div className="h-20 w-full bg-gradient-to-r from-white to-gray-800 rounded mb-3"></div>
                        <span className="text-sm font-medium text-gray-800">System Default</span>
                      </label>
                    </div>
                  </div>

                  {/* Display Preferences */}
                  <div className="pb-5 border-b border-gray-100">
                    <h3 className="font-medium text-gray-800 mb-3">Display Preferences</h3>
                    
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-800">Compact Mode</p>
                        <p className="text-xs text-gray-500">Reduce padding and spacing for a denser view</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          name="compactMode" 
                          checked={appearanceSettings.compactMode} 
                          onChange={handleAppearanceChange} 
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#67c6ff]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#67c6ff]"></div>
                      </label>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end">
                    <button 
                      className="px-5 py-2.5 bg-[#67c6ff] text-white rounded-lg hover:bg-[#57b6ff] transition-colors flex items-center"
                    >
                      <RiSaveLine className="mr-2" /> Save Appearance Settings
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* API Keys */}
            {activeSection === 'apiKeys' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-800">API Keys</h2>
                  <button className="px-3 py-2 bg-[#67c6ff] text-white rounded-lg hover:bg-[#57b6ff] transition-colors flex items-center">
                    <RiAddLine className="mr-1" /> Create API Key
                  </button>
                </div>
                
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Used</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <RiKeyLine className="text-gray-400 mr-2" />
                            <div className="text-sm font-medium text-gray-900">Production API Key</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          2 hours ago
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Oct 15, 2023
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-[#67c6ff] hover:text-[#57b6ff]">Revoke</button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <RiKeyLine className="text-gray-400 mr-2" />
                            <div className="text-sm font-medium text-gray-900">Development API Key</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          5 days ago
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Sep 28, 2023
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-[#67c6ff] hover:text-[#57b6ff]">Revoke</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4 text-sm text-gray-500">
                  <div className="flex items-start">
                    <RiInformationLine className="text-[#67c6ff] mt-0.5 mr-1" />
                    <p>API keys provide access to your authentication system via API. Keep them secure and never share them publicly.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Domains & URLs */}
            {activeSection === 'domains' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-800">Domains & URLs</h2>
                  <button className="px-3 py-2 bg-[#67c6ff] text-white rounded-lg hover:bg-[#57b6ff] transition-colors flex items-center">
                    <RiAddLine className="mr-1" /> Add Domain
                  </button>
                </div>
                
                <div className="space-y-6">
                  {/* Allowed Domains */}
                  <div className="pb-5">
                    <h3 className="font-medium text-gray-800 mb-3">Allowed Origins</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div>
                          <p className="text-sm font-medium text-gray-800">example.com</p>
                          <p className="text-xs text-gray-500">All subdomains included</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="px-3 py-1 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                            Edit
                          </button>
                          <button className="px-3 py-1 text-xs font-medium text-red-600 bg-white border border-gray-300 rounded hover:bg-red-50 transition-colors">
                            Remove
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div>
                          <p className="text-sm font-medium text-gray-800">api.myapp.com</p>
                          <p className="text-xs text-gray-500">Exact domain only</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="px-3 py-1 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                            Edit
                          </button>
                          <button className="px-3 py-1 text-xs font-medium text-red-600 bg-white border border-gray-300 rounded hover:bg-red-50 transition-colors">
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Redirect URLs */}
                  <div className="pb-5 border-t border-gray-100 pt-5">
                    <h3 className="font-medium text-gray-800 mb-3">Default Redirect URLs</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">Login Success URL</label>
                        <input
                          type="url"
                          placeholder="https://example.com/dashboard"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#67c6ff]/30 focus:border-[#67c6ff]"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">Login Failure URL</label>
                        <input
                          type="url"
                          placeholder="https://example.com/login?error=true"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#67c6ff]/30 focus:border-[#67c6ff]"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">Logout Redirect URL</label>
                        <input
                          type="url"
                          placeholder="https://example.com/login"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#67c6ff]/30 focus:border-[#67c6ff]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end">
                    <button 
                      className="px-5 py-2.5 bg-[#67c6ff] text-white rounded-lg hover:bg-[#57b6ff] transition-colors flex items-center"
                    >
                      <RiSaveLine className="mr-2" /> Save URL Settings
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Activity Log */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Recent Settings Changes</h2>
          <button className="text-[#67c6ff] hover:underline text-sm">View Full Log</button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Change
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <RiLockLine className="text-gray-400 mr-2" />
                    <div className="text-sm text-gray-900">Updated MFA Settings</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">admin@example.com</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Nov 2, 2023 at 14:35
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <RiKeyLine className="text-gray-400 mr-2" />
                    <div className="text-sm text-gray-900">Created New API Key</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">admin@example.com</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Oct 15, 2023 at 09:12
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <RiGlobalLine className="text-gray-400 mr-2" />
                    <div className="text-sm text-gray-900">Added Domain: example.com</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">admin@example.com</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Oct 10, 2023 at 16:24
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <div className="text-sm text-gray-500">
          Showing 3 of 24 entries
        </div>
        <div className="flex">
          <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mr-2">
            <RiArrowLeftSLine className="mr-1" /> Previous
          </button>
          <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            Next <RiArrowRightSLine className="ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;