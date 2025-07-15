import { createContext, useContext, useRef, useState, useCallback, useEffect } from "react";
import type { ReactNode } from 'react';
// import SockJS from 'sockjs-client'; ❌ Removed SockJS
import { Stomp } from '@stomp/stompjs';
import { useUserAuth } from "./UserAuthContext";
import toast from "react-hot-toast";

interface NotificationContextType {
    notifications: Notification[];
    connectionStatus: string;
    connect: () => void;
    publish: (destination: string, message: string) => boolean;
    revokeaccess: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationContextProviderProps {
    children: ReactNode;
}

interface Notification {
    message: string;
}

export function NotificationContextProvider({ children }: NotificationContextProviderProps) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [connectionStatus, setConnectionStatus] = useState<string>('Disconnected');
    const stompClient = useRef<any>(null);
    const { user } = useUserAuth();

    const connect = () => {
        if (stompClient.current?.connected || !user?.email) return;

        try {
            const socketUrl = 'ws://localhost:9001/ws'; // ✅ Native WebSocket
            stompClient.current = Stomp.over(() => new WebSocket(socketUrl));

            const connectCallback = () => {
                setConnectionStatus('Connected');
                stompClient.current.subscribe(`/topic/notification/${user.email}`, handleMessage);
            };

            stompClient.current.connect({}, connectCallback, handleError);
        } catch (error) {
            console.error('Connection error:', error);
            setConnectionStatus('Error');
        }
    };

    const revokeaccess = () => {
        if (stompClient.current?.connected || !user?.email) return;

        try {
            const socketUrl = 'ws://localhost:9001/ws'; // ✅ Native WebSocket
            stompClient.current = Stomp.over(() => new WebSocket(socketUrl));

            const connectCallback = () => {
                setConnectionStatus('Connected');
                stompClient.current.subscribe(`/revoke/${user.email}`, handleLogout);
            };

            stompClient.current.connect({}, connectCallback, handleError);
        } catch (error) {
            console.error('Connection error:', error);
            setConnectionStatus('Error');
        }
    };

    const handleLogout = (message: any) => {
        try {
            console.log('Received logout message:', message);
            const tokenid = message.body;
            if (tokenid) {
                if (tokenid === localStorage.getItem('token') || tokenid === sessionStorage.getItem('token')) {
                    localStorage.removeItem('token');
                    sessionStorage.removeItem('token');
                    toast.dismiss();
                    toast.error('Session expired. Please log in again.');
                    window.location.href = '/login';
                    setConnectionStatus('Disconnected');
                    stompClient.current.disconnect();
                }
            }

        } catch (error) {
            console.error('Failed to process logout message:', error);
        }
    }

    const handleMessage = (message: any) => {
        try {
            console.log('Received message:', message);
            const notification = { message: message.body };
            setNotifications(prev => [notification, ...prev]);
        } catch (error) {
            console.error('Failed to parse notification:', error);
        }
    };

    const handleError = (error: any) => {
        console.error('WebSocket error:', error);
        setConnectionStatus('Error');
        setTimeout(connect, 5000);
    };

    const publish = (destination: string, message: string) => {
        if (!stompClient.current?.connected || !user?.email) return false;

        try {
            stompClient.current.publish({
                destination: `/app/publish/${destination}`,
                body: JSON.stringify({
                    email: user.email,
                    type: 'text/plain',
                    message,
                    token: localStorage.getItem('token') || sessionStorage.getItem('token') || ''
                })
            });
            return true;
        } catch (error) {
            console.error('Publish error:', error);
            return false;
        }
    };

    useEffect(() => {
        return () => {
            if (stompClient.current?.connected) {
                stompClient.current.disconnect();
                setConnectionStatus('Disconnected');
            }
        };
    }, []);

    return (
        <NotificationContext.Provider value={{ notifications, connectionStatus, connect, publish, revokeaccess }}>
            {children}
        </NotificationContext.Provider>
    );
}

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within NotificationContextProvider');
    }
    return context;
};
