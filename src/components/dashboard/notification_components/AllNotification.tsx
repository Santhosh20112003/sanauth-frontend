import { useNotification } from '../../context/NotificationContext';
import WebSocketDemo from '../test/Sample';

export const AllNotification = () => {
    const { notifications, connectionStatus } = useNotification();

    return (
        <div className="notifications-container p-4">
            <div className="connection-status mb-4">
                Status: <span className={`status-${connectionStatus.toLowerCase()}`}>
                    {connectionStatus}
                </span>
            </div>

            <div className="notifications-list space-y-2">
                {notifications.length === 0 ? (
                    <div className="no-notifications text-gray-500">No notifications yet</div>
                ) : (
                    notifications.map((notification, index) => (
                        <div key={index} className="notification-item p-3 bg-white rounded shadow">
                            <span className="notification-message">
                                {notification.message}
                            </span>
                        </div>
                    ))
                )}
            </div>

            {/* <WebSocketDemo /> */}
        </div>
    );
};