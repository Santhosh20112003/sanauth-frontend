import React, { useEffect, useRef, useState } from 'react'
import { RiNotification3Line } from 'react-icons/ri';
import { Link } from 'react-router-dom'

function Notification() {
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

    // Sample notifications data - in a real app this would come from props or a context
    const notifications = [
        { id: 1, message: "New user registered", time: "2 min ago", read: false },
        { id: 2, message: "Authentication service updated", time: "1 hour ago", read: false },
        { id: 3, message: "Weekly report is ready", time: "Yesterday", read: true },
        { id: 4, message: "Security alert detected", time: "2 days ago", read: true }
    ];

    const unreadCount = notifications.filter(n => !n.read).length;

    // Refs for click-outside detection
    const notificationsDropdownRef = useRef<HTMLDivElement>(null);
    const notificationsButtonRef = useRef<HTMLButtonElement>(null);

    // Handle marking notifications as read
    const markAllAsRead = () => {
        // In a real app, this would call an API or update a context
        console.log("Marking all notifications as read");
    };

    // Handle clicks outside of dropdown
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                isNotificationsOpen &&
                notificationsDropdownRef.current &&
                !notificationsDropdownRef.current.contains(event.target as Node) &&
                notificationsButtonRef.current &&
                !notificationsButtonRef.current.contains(event.target as Node)
            ) {
                setIsNotificationsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isNotificationsOpen]);

    return (
        <div className="relative">
            <button
                ref={notificationsButtonRef}
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="flex items-center justify-center group p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors border border-white/30 text-white"
                aria-label={`${unreadCount} unread notifications`}
            >
                <RiNotification3Line className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 size-3.5 bg-red-400 rounded-full border-2 border-white text-white text-xs flex items-center justify-center">
                    </span>
                )}
            </button>

            {isNotificationsOpen && (
                <div
                    ref={notificationsDropdownRef}
                    className="origin-top-right z-30 absolute right-0 mt-2 w-80 rounded-lg shadow-xl bg-white border border-gray-200 overflow-hidden animate-fadeIn"
                >
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                        <h3 className="font-medium text-gray-800">Notifications</h3>
                        {unreadCount > 0 && (
                            <button 
                                onClick={markAllAsRead}
                                className="text-xs text-[#67c6ff] hover:text-[#4dabea] transition-colors font-medium"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>

                    <div className="max-h-[320px] overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="py-8 text-center text-gray-500">
                                <div className="flex justify-center mb-3">
                                    <RiNotification3Line className="w-10 h-10 text-gray-300" />
                                </div>
                                <p>No new notifications</p>
                            </div>
                        ) : (
                            notifications.map(notification => (
                                <div
                                    key={notification.id}
                                    className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${!notification.read ? 'bg-blue-50/50' : ''}`}
                                >
                                    <div className="flex items-start">
                                        <div className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${!notification.read ? 'bg-[#67c6ff]' : 'bg-gray-300'}`}></div>
                                        <div className="ml-3 flex-grow">
                                            <p className={`text-sm ${!notification.read ? 'font-medium text-gray-800' : 'text-gray-600'}`}>
                                                {notification.message}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-0.5">{notification.time}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="p-3 border-t border-gray-100 bg-gray-50 text-center">
                        <Link
                            to="/dashboard/notifications"
                            onClick={() => setIsNotificationsOpen(false)}
                            className="text-sm text-[#67c6ff] hover:text-[#4dabea] transition-colors font-medium"
                        >
                            View all notifications
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Notification;