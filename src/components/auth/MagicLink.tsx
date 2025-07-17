import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUserAuth } from '../context/UserAuthContext';

interface MagicLinkState {
    isLoading: boolean;
    error: string | null;
    redirectTo: string | null;
}

const MagicLink: React.FC = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const { user } = useUserAuth();
    const [state, setState] = useState<MagicLinkState>({
        isLoading: true,
        error: null,
        redirectTo: null
    });

    // Handle navigation in separate effect
    useEffect(() => {
        if (state.redirectTo) {
            navigate(state.redirectTo);
        }
    }, [state.redirectTo, navigate]);

    useEffect(() => {
        let mounted = true;
        console.log(user)
        if (user.email) {
            setState({
                isLoading: false,
                error: null,
                redirectTo: '/dashboard/home'
            });
            return;
        }

        const validateAndStoreToken = async () => {
            console.log('Received token:', token); // Debug log

            if (!token) {
                if (mounted) {
                    setState({
                        isLoading: false,
                        error: 'Invalid magic link',
                        redirectTo: '/login'
                    });
                }
                return;
            }

            try {
                // Remove strict token length validation
                // Just check if token exists and is not empty
                if (!token.trim()) {
                    throw new Error('Empty token');
                }

                localStorage.setItem('token', token);
                console.log('Token stored successfully'); // Debug log

                if (mounted) {
                    setState({
                        isLoading: false,
                        error: null,
                        redirectTo: '/dashboard/home'
                    });
                }
            } catch (error) {
                console.error('Token validation error:', error); // Debug log
                if (mounted) {
                    setState({
                        isLoading: false,
                        error: error instanceof Error ? error.message : 'Authentication failed',
                        redirectTo: '/login'
                    });
                }
            }
        };

        validateAndStoreToken();

        return () => {
            mounted = false;
        };
    }, [token]);

    if (state.isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                <p className="mt-4 text-gray-600">Authenticating...</p>
            </div>
        );
    }

    if (state.error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="text-red-500 mb-2">⚠️ {state.error}</div>
                <p className="text-gray-600">Redirecting to login...</p>
            </div>
        );
    }

    return null;
};

export default MagicLink;