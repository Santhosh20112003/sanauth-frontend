import Sidebar from './Sidebar'
import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'
import { useEffect } from 'react';
import { useUserAuth } from '../context/UserAuthContext';

function Structure() {
    const { getUserDetails } = useUserAuth();

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