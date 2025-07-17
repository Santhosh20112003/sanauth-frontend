import { useState } from 'react';
import request from '../config/axios_config';
import toast from 'react-hot-toast';
import { useUserAuth } from '../context/UserAuthContext';

interface MFAVerificationProps {
    email: string;
    password: string;
    rememberMe: boolean;
    onSuccess: (token: string) => void;
    onCancel: () => void;
}

const MFAVerification = ({ email, password, rememberMe, onSuccess, onCancel }: MFAVerificationProps) => {
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { getLoginMetaData } = useUserAuth();

    const handleOTPVerification = async () => {
        try {
            setIsLoading(true);
            const loginmetadata = await getLoginMetaData();

            console.log(otp)

            const response = await request.post('/api/auth/admin/verify-mfa', {
                email,
                otp,
                password,
                metadata: loginmetadata
            });

            console.log('MFA Response:', response); 

            if (response.status === 200 && response.data.token) {
                toast.success('MFA verification successful!');
                onSuccess(response.data.token);
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (error: any) {
            console.error('MFA Verification Error:', error);
            if (error.response?.status === 401) {
                toast.error('Invalid or expired code. Please try again.');
            } else if (error.response?.status === 404) {
                toast.error('MFA verification failed. Session expired.');
                onCancel();
            } else {
                toast.error('Something went wrong. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md p-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8">
                <div className="mb-5 text-center">
                    <svg className="size-20 mb-2 mx-auto text-[#00b5df]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-gray-900">Verify Your Identity</h2>
                        <p className="text-sm text-gray-600">
                            To finish signing in, enter the code from your MFA device below.
                        </p>
                    </div>
                </div>
                <div className="space-y-4">
                    <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="MFA Code"
                        className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00b5df] focus:border-[#00b5df]"
                        maxLength={6}
                    />
                    <button
                        onClick={handleOTPVerification}
                        disabled={isLoading || otp.length !== 6}
                        className={`w-full py-3 px-4 mt-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-[#00b5df] to-cyan-500 hover:from-[#00a5cf] hover:to-cyan-600 focus:outline-none ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isLoading ? 'Verifying...' : 'Verify OTP'}
                    </button>
                    <button
                        onClick={onCancel}
                        className="w-full py-3 px-4 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 hover:bg-gray-50"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        </div>
    );
};


export default MFAVerification;
