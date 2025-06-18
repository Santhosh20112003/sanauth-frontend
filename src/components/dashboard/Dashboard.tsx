import React, { useState } from 'react';
import {
  RiUserLine, RiShieldCheckLine, RiTimeLine, RiAlertLine, RiArrowUpLine, RiArrowDownLine,
  RiSearchLine, RiDashboardLine, RiApps2Line, RiBarChart2Line, RiPieChart2Line,
  RiArrowRightSLine, RiAddLine
} from 'react-icons/ri';
import { GoArrowUpRight } from 'react-icons/go';

function Dashboard() {
  const [stats] = useState([
    { id: 1, title: 'Total Users', value: '2,845', change: '-3%', isUp: false, icon: RiUserLine, color: 'bg-[#67c6ff]' },
    { id: 2, title: 'Active Sessions', value: '1,257', change: '+12%', isUp: true, icon: RiShieldCheckLine, color: 'bg-green-500' },
    { id: 3, title: 'Avg. Response Time', value: '384ms', change: '-8%', isUp: true, icon: RiTimeLine, color: 'bg-amber-500' },
    { id: 4, title: 'Failed Logins', value: '24', change: '+5%', isUp: false, icon: RiAlertLine, color: 'bg-red-500' }
  ]);

  const [recentActivity] = useState([
    { id: 1, user: 'Sarah Johnson', action: 'Logged in', time: '2 minutes ago', avatar: 'SJ', color: 'bg-purple-500' },
    { id: 2, user: 'Michael Chen', action: 'Updated profile', time: '15 minutes ago', avatar: 'MC', color: 'bg-blue-500' },
    { id: 3, user: 'Emma Wilson', action: 'Changed password', time: '1 hour ago', avatar: 'EW', color: 'bg-green-500' },
    { id: 4, user: 'James Brown', action: 'Logged out', time: '3 hours ago', avatar: 'JB', color: 'bg-amber-500' },
    { id: 5, user: 'Olivia Taylor', action: 'Failed login attempt', time: '5 hours ago', avatar: 'OT', color: 'bg-red-500' }
  ]);

  const [lastUpdate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Simplified Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-800">Product Activity Insights</h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">Your authentication and user management dashboard</p>
        </div>

        <div className="mt-4 md:mt-0 flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <input
              type="text"
              placeholder="Search dashboard..."
              className="pl-9 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#67c6ff]/30 focus:border-[#67c6ff] w-full md:w-56 text-sm"
            />
            <RiSearchLine className="absolute left-3 top-2.5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Navigation Tabs - Simplified */}
      <div className="mb-6">
        <div className="flex items-center space-x-1 border-b border-gray-200 overflow-x-auto">
          {['overview', 'analytics', 'applications', 'users'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 rounded-t-lg text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab
                ? 'text-[#67c6ff] border-b-2 border-[#67c6ff] bg-white/50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
            >
              <div className="flex items-center gap-1.5">
                {tab === 'overview' && <RiDashboardLine />}
                {tab === 'analytics' && <RiTimeLine />}
                {tab === 'applications' && <RiApps2Line />}
                {tab === 'users' && <RiUserLine />}
                <span className="capitalize">{tab}</span>
              </div>
            </button>
          ))}
        </div>
      </div>


      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 gap-5 mb-8 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(stat => (
          <div key={stat.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 transition duration-300 hover:shadow-md overflow-hidden relative group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <div className="flex items-baseline gap-2 mt-1 mb-2">
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                  <div className={`flex items-center ${stat.isUp ? 'text-green-500' : 'text-red-500'} text-xs font-medium`}>
                    {stat.isUp ? <RiArrowUpLine className="mr-0.5" /> : <RiArrowDownLine className="mr-0.5" />}
                    <span>{stat.change}</span>
                  </div>
                </div>
                <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${stat.color} rounded-full`} style={{ width: `${Math.floor(Math.random() * 40) + 30}%` }}></div>
                </div>
              </div>
              <div className={`${stat.color} bg-opacity-10 p-3 rounded-full group-hover:scale-110 transition-transform`}>
                <stat.icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
              </div>
            </div>
            <div className={`absolute bottom-0 left-0 right-0 h-1 ${stat.color}`}></div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-3">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">User Activity</h2>
              <p className="text-sm text-gray-500">User engagement across platforms</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 transition-colors">
                <RiBarChart2Line className="w-5 h-5" />
              </button>
              <button className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 transition-colors">
                <RiPieChart2Line className="w-5 h-5" />
              </button>
              <select className="text-xs border border-gray-200 rounded-md py-1 px-2 text-gray-500">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last quarter</option>
              </select>
            </div>
          </div>
          <div className="relative h-72">
            <div className="absolute inset-x-0 bottom-0 h-64">
              <div className="h-full w-full flex items-end justify-around">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="relative h-full flex flex-col items-center" style={{ width: '12%' }}>
                    <div
                      className="w-full bg-[#67c6ff]/20 hover:bg-[#67c6ff]/30 rounded-t-md transition-all cursor-pointer relative group"
                      style={{ height: `${Math.floor(Math.random() * 50) + 20}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {Math.floor(Math.random() * 400) + 100} users
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}</p>
                  </div>
                ))}
              </div>
              <div className="absolute left-0 top-0 bottom-0 border-l border-dashed border-gray-200"></div>
              <div className="absolute right-0 top-0 bottom-0 border-r border-dashed border-gray-200"></div>
              <div className="absolute left-0 right-0 top-0 border-t border-dashed border-gray-200"></div>
              <div className="absolute left-0 right-0 bottom-0 border-b border-gray-200"></div>
            </div>
          </div>
          <div className="flex justify-between mt-6 border-t border-gray-100 pt-4">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500">New Users</p>
              <div className="flex items-center justify-center mt-1">
                <p className="text-lg font-semibold text-[#67c6ff]">+24%</p>
                <GoArrowUpRight className="text-green-500 ml-1" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500">Active Users</p>
              <div className="flex items-center justify-center mt-1">
                <p className="text-lg font-semibold text-[#67c6ff]">+12%</p>
                <GoArrowUpRight className="text-green-500 ml-1" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500">Retention</p>
              <div className="flex items-center justify-center mt-1">
                <p className="text-lg font-semibold text-[#67c6ff]">87%</p>
                <span className="text-xs font-medium text-gray-500 ml-1">+2%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
            <span className="text-xs text-[#67c6ff] font-medium cursor-pointer hover:underline">View all</span>
          </div>
          <div className="space-y-3">
            {recentActivity.map(activity => (
              <div key={activity.id} className="flex items-start p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <div className={`${activity.color} rounded-full h-8 w-8 flex items-center justify-center text-white text-xs font-medium mr-3 flex-shrink-0`}>
                  {activity.avatar}
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-medium text-gray-800">{activity.user}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5">{activity.action}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm font-medium flex items-center justify-center gap-2">
            <span>View All Activity</span>
          </button>
        </div>
      </div>

      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* User Activity Timeline */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-gray-700">User Activity Timeline</h3>
              <span className="text-xs text-[#67c6ff] cursor-pointer hover:underline">View all</span>
            </div>
            <div className="relative pl-8 space-y-6">
              {/* Timeline line */}
              <div className="absolute top-0 left-3 bottom-0 border-l-2 border-gray-200"></div>

              <div className="relative">
                <div className="absolute top-1 -left-8 w-4 h-4 rounded-full bg-[#67c6ff] border-2 border-white"></div>
                <p className="text-sm font-medium text-gray-800">New user registration spike</p>
                <p className="text-xs text-gray-500 mt-1">Over 150 new users registered in the last hour</p>
                <p className="text-xs text-gray-400 mt-1">Today, 10:30 AM</p>
              </div>

              <div className="relative">
                <div className="absolute top-1 -left-8 w-4 h-4 rounded-full bg-amber-500 border-2 border-white"></div>
                <p className="text-sm font-medium text-gray-800">API usage threshold reached</p>
                <p className="text-xs text-gray-500 mt-1">The authentication API has reached 80% of its quota</p>
                <p className="text-xs text-gray-400 mt-1">Yesterday, 5:15 PM</p>
              </div>

              <div className="relative">
                <div className="absolute top-1 -left-8 w-4 h-4 rounded-full bg-green-500 border-2 border-white"></div>
                <p className="text-sm font-medium text-gray-800">New OAuth provider added</p>
                <p className="text-xs text-gray-500 mt-1">GitHub authentication integration deployed successfully</p>
                <p className="text-xs text-gray-400 mt-1">Aug 12, 2023</p>
              </div>
            </div>
          </div>

          {/* User Geographical Distribution with Google Maps */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-gray-700">User Geography</h3>
              <div className="flex items-center text-xs text-gray-500">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-[#67c6ff] to-blue-500 mr-1"></div>
                <span>User density</span>
              </div>
            </div>
            
            {/* Google Maps Container using iframe */}
            <div className="h-48 brightness-90 rounded-lg overflow-hidden relative" id="google-map">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d60513047.93491754!2d-31.9!3d27!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1699385179777!5m2!1sen!2sus" 
                className="absolute inset-0 w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="User Geography Map"
                allowFullScreen
              ></iframe>
              
              {/* Legend overlay - will be shown over the map */}
              <div className="absolute bottom-2 right-2 bg-white rounded px-2 py-1 text-xs text-gray-600 shadow-sm z-10">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-[#67c6ff] mr-1"></div>
                  <span>User locations</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="p-2 rounded bg-gray-50">
                <p className="text-xs text-gray-500">Top Region</p>
                <p className="text-sm font-medium text-gray-800">North America (42%)</p>
              </div>
              <div className="p-2 rounded bg-gray-50">
                <p className="text-xs text-gray-500">Growth Region</p>
                <p className="text-sm font-medium text-gray-800">South Asia (+18%)</p>
              </div>
            </div>
          </div>

          {/* Login Success vs Failure Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-gray-700">Login Success Rate</h3>
              <span className="text-sm font-medium text-green-500">98.2%</span>
            </div>
            <div className="h-12 w-full bg-gray-100 rounded-lg overflow-hidden flex">
              <div className="h-full bg-green-500" style={{ width: '98.2%' }}></div>
              <div className="h-full bg-red-500" style={{ width: '1.8%' }}></div>
            </div>
            <div className="mt-3 flex justify-between text-xs text-gray-500">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                <span>Success: 15,843 attempts</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                <span>Failed: 287 attempts</span>
              </div>
            </div>
          </div>

          {/* Popular Authentication Methods */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-gray-700">Popular Auth Methods</h3>
              <select className="text-xs border border-gray-200 rounded py-1 px-2">
                <option>Last 30 days</option>
                <option>Last 90 days</option>
              </select>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-3">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-700">Username/Password</span>
                </div>
                <span className="text-sm font-medium">68%</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 mr-3">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-700">OAuth/Social</span>
                </div>
                <span className="text-sm font-medium">24%</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-500 mr-3">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-700">2FA/MFA</span>
                </div>
                <span className="text-sm font-medium">8%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Dashboard Summary</h2>
            <p className="text-sm text-gray-500">Quick overview of your authentication system</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <select className="text-sm border border-gray-200 rounded-md py-1.5 px-3 text-gray-700">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last quarter</option>
            </select>
            <button className="flex items-center text-[#67c6ff] text-sm font-medium">
              <span>View detailed report</span>
              <RiArrowRightSLine className="ml-1" />
            </button>
          </div>
        </div>

        {/* Summary Grid Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Authentication Status */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">System Status</p>
                <div className="mt-2 flex items-center">
                  <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                  <p className="font-semibold text-gray-800">All Services Online</p>
                </div>
              </div>
              <div className="bg-white p-2 rounded-md">
                <RiShieldCheckLine className="h-5 w-5 text-green-500" />
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Last incident:</span>
                <span className="font-medium text-gray-700">14 days ago</span>
              </div>
            </div>
          </div>

          {/* Security Score */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Security Score</p>
                <p className="mt-1 text-2xl font-bold text-gray-800">86<span className="text-sm text-gray-500">/100</span></p>
              </div>
              <div className="flex items-center px-2 py-1 bg-yellow-100 rounded text-xs font-medium text-yellow-800">
                Good
              </div>
            </div>
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '86%' }}></div>
              </div>
              <div className="mt-2 text-xs text-gray-500">3 suggestions available to improve security</div>
            </div>
          </div>

          {/* API Usage */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">API Usage</p>
                <p className="mt-1 text-2xl font-bold text-gray-800">67%</p>
              </div>
              <div className="bg-white p-2 rounded-md">
                <RiBarChart2Line className="h-5 w-5 text-[#67c6ff]" />
              </div>
            </div>
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-[#67c6ff] h-2 rounded-full" style={{ width: '67%' }}></div>
              </div>
              <div className="mt-2 flex justify-between text-xs">
                <span className="text-gray-500">Monthly quota: 10,000 requests</span>
                <span className="font-medium text-gray-700">6,723 used</span>
              </div>
            </div>
          </div>

          {/* Active Integrations */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Active Integrations</p>
                <p className="mt-1 text-2xl font-bold text-gray-800">5</p>
              </div>
              <div className="bg-white p-2 rounded-md">
                <RiApps2Line className="h-5 w-5 text-purple-500" />
              </div>
            </div>
            <div className="mt-3 flex -space-x-2">
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold border-2 border-white">FB</div>
              <div className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold border-2 border-white">G+</div>
              <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center text-white text-xs font-bold border-2 border-white">GH</div>
              <div className="h-8 w-8 rounded-full bg-blue-400 flex items-center justify-center text-white text-xs font-bold border-2 border-white">TW</div>
              <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold border-2 border-white">+1</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;