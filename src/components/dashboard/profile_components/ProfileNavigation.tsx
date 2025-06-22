import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  RiUser3Line, RiShieldLine, RiComputerLine, RiHistoryLine, RiApps2Line
} from 'react-icons/ri';

const ProfileNavigation: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const navigationLinks = [
    {
      title: 'Personal Information',
      path: '/profile/personal-info',
      icon: <RiUser3Line className="mr-2" />
    },
    {
      title: 'Security',
      path: '/profile/security',
      icon: <RiShieldLine className="mr-2" />
    },
    {
      title: 'Active Sessions',
      path: '/profile/active-sessions',
      icon: <RiComputerLine className="mr-2" />
    },
    {
      title: 'Login History',
      path: '/profile/login-history',
      icon: <RiHistoryLine className="mr-2" />
    },
    {
      title: 'Connected Applications',
      path: '/profile/connected-apps',
      icon: <RiApps2Line className="mr-2" />
    }
  ];
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
      <h2 className="text-lg font-semibold text-gray-800 px-2 mb-3">Profile Settings</h2>
      <div className="flex flex-wrap gap-2">
        {navigationLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium
              ${currentPath === link.path 
                ? 'bg-[#67c6ff] text-white' 
                : 'text-gray-700 hover:bg-gray-100'
              }`}
          >
            {link.icon}
            {link.title}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProfileNavigation;
