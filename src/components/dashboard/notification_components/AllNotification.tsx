import React, { useState } from 'react';

interface Notification {
  id: number;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

function AllNotification() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: 'Welcome!',
      message: 'Welcome to your new dashboard. Get started by exploring the features.',
      timestamp: '2023-05-15 09:30 AM',
      read: false,
    },
    {
      id: 2,
      title: 'Profile Updated',
      message: 'Your profile information has been successfully updated.',
      timestamp: '2023-05-14 02:15 PM',
      read: false,
    },
    {
      id: 3,
      title: 'New Message',
      message: 'You have received a new message from the admin.',
      timestamp: '2023-05-13 11:45 AM',
      read: true,
    },
    {
      id: 4,
      title: 'System Maintenance',
      message: 'The system will undergo maintenance on May 20th from 2-4 AM.',
      timestamp: '2023-05-12 04:20 PM',
      read: true,
    },
  ]);

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-5 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800">Notifications</h2>
        <div>
          <button 
            onClick={markAllAsRead} 
            className="border border-blue-500 text-blue-500 px-3 py-1 rounded-md hover:bg-blue-500 hover:text-white transition-colors"
          >
            Mark all as read
          </button>
        </div>
      </div>

      <div>
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`p-4 mb-3 flex justify-between items-start border-b border-gray-100 last:border-b-0 transition-colors
                ${notification.read ? 'opacity-70' : 'bg-blue-50 border-l-4 border-l-blue-500'}`}
            >
              <div className="flex-grow pr-4">
                <h3 className="font-medium text-gray-800 mb-1">{notification.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{notification.message}</p>
                <span className="text-xs text-gray-400">{notification.timestamp}</span>
              </div>
              <div className="flex gap-2">
                {!notification.read && (
                  <button 
                    onClick={() => markAsRead(notification.id)}
                    className="text-xs border border-blue-500 text-blue-500 px-2 py-1 rounded hover:bg-blue-500 hover:text-white transition-colors"
                  >
                    Mark as read
                  </button>
                )}
                <button 
                  onClick={() => deleteNotification(notification.id)}
                  className="text-xs border border-red-500 text-red-500 px-2 py-1 rounded hover:bg-red-500 hover:text-white transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-gray-500">
            <p>No notifications to display</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AllNotification;