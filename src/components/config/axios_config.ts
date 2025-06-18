import Axios from 'axios';
import toast from 'react-hot-toast';

const request = Axios.create({
    baseURL: 'http://localhost:9090/'
});

request.interceptors.request.use(
    (config) => {
        const adminRoutecheck = config.url?.startsWith('/api/auth/admin');
        const shouldnotSkip = config.url?.startsWith('/api/users') ||
            config.url?.startsWith('/api/auth/me');

        if (shouldnotSkip) {
            const token = localStorage.getItem('token') || sessionStorage.getItem("token"); 
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
        }

        if (adminRoutecheck) {
            const adminToken = btoa(`admin@santech.online:admin123`);
            if (adminToken) {
                config.headers['Authorization'] = `Basic ${adminToken}`;
                config.headers['Content-Type'] = 'application/json';
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle 406 status
request.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 406) {
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');
            toast.dismiss();
            toast.error('Session expired. Please log in again.');
            window.location.href = '/login';
            return Promise.reject({
                ...error,
                isNotAcceptable: true,
                userMessage: 'The server cannot produce content in the format requested by your browser.'
            });
        }
        return Promise.reject(error);
    }
);

export default request