import Sidebar from './Sidebar'
import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'
import { useEffect } from 'react';
import { useUserAuth } from '../context/UserAuthContext';
import { useNotification } from '../context/NotificationContext';

function Structure() {
    const { getUserDetails, user, getSettings } = useUserAuth();
    const { connect, publish, revokeaccess } = useNotification();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                await getUserDetails();
            } catch (err) {
                console.error('Error fetching user details:', err);
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        if (user?.email) {
            try {
                console.log('Attempting to connect websocket...');
                connect();
            } catch (error) {
                console.error('WebSocket connection failed:', error);
            }
        }
        const timer = setInterval(() => {
            console.log('Fetching new data...');
            publish("shanmugamsanthosh22@gmail.com", "Hello There");
        }, 6000);
        return () => clearInterval(timer);

    }, []);


    useEffect(() => {
        if (user?.email) {
            try {
                console.log('Attempting to connect websocket...');
                revokeaccess();
            } catch (error) {
                console.error('WebSocket connection failed:', error);
            }
        }

    }, []);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                await getSettings();
            } catch (err) {
                console.error('Error fetching settings:', err);
            }
        };
        fetchSettings();
    }, []);

    return (
        <div className="w-full h-screen ">
            <Navbar />
            <div className="w-full h-[90vh] flex bg-slate-100">
                <Sidebar />
                <div className="w-full h-[calc(100vh-64px)] overflow-y-auto ">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default Structure