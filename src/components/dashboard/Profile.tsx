import {
  RiUser3Line, RiLockPasswordLine, RiHistoryLine,
  RiCalendarLine, RiApps2Line
} from 'react-icons/ri';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useUserAuth } from '../context/UserAuthContext';

function Profile() {
  const location = useLocation();
  const { user } = useUserAuth();

  // Format date with error handling
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid date";
    }
  };

  // Get user initials from full name
  const getUserInitials = (name: string): string => {
    const nameParts = name.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`;
    }
    return name.charAt(0);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Profile Settings</h1>
          <p className="text-gray-600">Manage your account information and security settings</p>
        </div>

        {/* Profile Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Profile Summary */}
              <div className="p-6 text-center border-b border-gray-100">
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-sm mx-auto">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback if image fails to load
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.classList.add('bg-[#67c6ff]/10');
                          const initials = document.createElement('div');
                          initials.className = "w-full h-full flex items-center justify-center text-[#67c6ff] text-2xl font-bold";
                          initials.textContent = getUserInitials(user.name);
                          e.currentTarget.parentElement!.appendChild(initials);
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#67c6ff]/10 text-[#67c6ff] text-2xl font-bold">
                        {getUserInitials(user.name)}
                      </div>
                    )}
                  </div>
                </div>
                <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
                <p className="text-gray-500 text-sm">{user.email}</p>
                {/* <p className="text-gray-400 text-xs mt-1">{user.role}</p> */}

                <div className="mt-4 flex justify-center">
                  <div className="text-xs text-gray-500 flex items-center">
                    <RiCalendarLine className="mr-1" />
                    Member since {formatDate(user.createdAt).split(',')[0]}
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="p-2">
                <Link
                  to="info"
                  className={`flex items-center w-full px-4 py-2 text-sm rounded-lg transition-colors ${location.pathname.includes('info')
                    ? 'bg-[#67c6ff]/10 text-[#67c6ff]'
                    : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  <RiUser3Line className="mr-2" /> Personal Information
                </Link>
                <Link
                  to="security"
                  className={`flex items-center w-full px-4 py-2 text-sm rounded-lg transition-colors ${location.pathname.includes('security')
                    ? 'bg-[#67c6ff]/10 text-[#67c6ff]'
                    : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  <RiLockPasswordLine className="mr-2" /> Security
                </Link>
                <Link
                  to="active-sessions"
                  className={`flex items-center w-full px-4 py-2 text-sm rounded-lg transition-colors ${location.pathname.includes('active-sessions')
                    ? 'bg-[#67c6ff]/10 text-[#67c6ff]'
                    : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  <RiHistoryLine className="mr-2" /> Active Sessions
                </Link>
                <Link
                  to="login-history"
                  className={`flex items-center w-full px-4 py-2 text-sm rounded-lg transition-colors ${location.pathname.includes('login-history')
                    ? 'bg-[#67c6ff]/10 text-[#67c6ff]'
                    : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  <RiCalendarLine className="mr-2" /> Login History
                </Link>
                <Link
                  to="connected-apps"
                  className={`flex items-center w-full px-4 py-2 text-sm rounded-lg transition-colors ${location.pathname.includes('connected-apps')
                    ? 'bg-[#67c6ff]/10 text-[#67c6ff]'
                    : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  <RiApps2Line className="mr-2" /> Connected Apps
                </Link>
              </nav>

              {/* Account Status */}
              <div className="p-6 border-t border-gray-100">
                <h3 className="text-sm font-medium text-gray-800 mb-3">Account Status</h3>
                <div className="flex items-center">
                  <div className={`w-2 h-2 ${user.active ? 'bg-green-500' : 'bg-red-500'} rounded-full mr-2`}></div>
                  <span className="text-sm text-gray-600">{user.active ? 'Active' : 'Inactive'}</span>
                </div>
                <div className="mt-3 text-xs text-gray-500">
                  Last login: {formatDate(user.lastLogin)}
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6">
              <h3 className="text-sm font-medium text-gray-800 mb-3">Danger Zone</h3>
              <p className="text-xs text-gray-500 mb-4">
                Actions here can't be undone. Please be certain.
              </p>
              <button className="w-full py-2 px-4 border border-red-300 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors">
                Delete Account
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
