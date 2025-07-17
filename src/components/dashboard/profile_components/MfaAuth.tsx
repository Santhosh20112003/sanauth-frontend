import React, { use, useEffect, useState } from 'react'
import { RiCheckLine, RiShieldCheckLine, RiArrowLeftLine } from 'react-icons/ri'
import request from '../../../components/config/axios_config';
import toast from 'react-hot-toast';
import { useUserAuth } from '../../context/UserAuthContext';

interface MFAResponse {
    otpAuthUrl: string;
    qrUrl: string;
    secret: string;
    message: string;
}

function MfaAuth() {
    const { settings, setSettings } = useUserAuth();
    const [setupStep, setSetupStep] = useState<'initial' | 'qr' | 'verify'>('initial');
    const [isLoading, setIsLoading] = useState(false);
    const [mfaData, setMfaData] = useState<MFAResponse | null>(null);
    const [verificationCode, setVerificationCode] = useState('');

    const handleConfigureMFA = async () => {
        try {
            setIsLoading(true);
            const response = await request.post('/api/users/register-mfa');
            setMfaData(response.data);
            setSetupStep('qr');
        } catch (error) {
            toast.error('Failed to configure MFA. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyMFA = async () => {
        try {
            setIsLoading(true);

            if (!verificationCode || verificationCode.length !== 6) {
                toast.error('Please enter a valid 6-digit code');
                return;
            }

            const response = await request.post('/api/users/verify-mfa-setup', {
                code: verificationCode
            });

            if (response.status === 200) {
                toast.success(response.data.message || 'MFA setup verified successfully');
                setSetupStep('initial');
                window.location.reload(); // Refresh to update MFA status
            }
        } catch (error: any) {
            console.error('MFA Setup Error:', error);
            if (error.response?.status === 401) {
                toast.error('Invalid MFA code. Please try again.');
            } else if (error.response?.status === 400) {
                toast.error(error.response.data.error || 'Invalid input. Please try again.');
            } else {
                toast.error('Failed to verify MFA setup. Please try again.');
            }
        } finally {
            setIsLoading(false);
            setVerificationCode(''); // Clear the code after attempt
        }
    };

    const handleRemoveMFA = async () => {
        try {
            setIsLoading(true);
            const response = await request.get('/api/users/remove/mfa');
            
            if (response.status === 200) {
                toast.success('MFA has been disabled successfully');
                // Update settings directly instead of reloading
                setSettings(prev => ({
                    ...prev,
                    mfaEnabled: false
                }));
            }
        } catch (error: any) {
            console.error('MFA Removal Error:', error);
            toast.error('Failed to disable MFA. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const renderInitialState = () => (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            {/* Header Section */}
            <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-cyan-50 rounded-lg">
                            <RiShieldCheckLine className="w-6 h-6 text-[#00b5df]" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Two-Factor Authentication</h2>
                            <p className="text-sm text-gray-500 mt-1">Additional security for your account</p>
                        </div>
                    </div>
                    <div className={`px-3 py-1.5 rounded-full text-sm font-medium 
                        ${settings?.mfaEnabled 
                            ? 'bg-green-50 text-green-700 border border-green-200' 
                            : 'bg-yellow-50 text-yellow-700 border border-yellow-200'}`}>
                        <span className="flex items-center">
                            {settings?.mfaEnabled ? (
                                <><RiCheckLine className="w-4 h-4 mr-1.5" />Enabled</>
                            ) : (
                                'Not Configured'
                            )}
                        </span>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-6 space-y-6">
                {/* Info Box */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <p className="text-sm text-gray-600 leading-relaxed">
                        Two-factor authentication adds an additional layer of security to your account. 
                        Once configured, you'll be required to enter both your password and an authentication 
                        code from your phone whenever you sign in.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3">
                    {settings?.mfaEnabled ? (
                        <button
                            onClick={handleRemoveMFA}
                            disabled={isLoading}
                            className="inline-flex items-center justify-center px-4 py-2 border 
                                border-red-200 text-sm font-medium rounded-lg text-red-700 
                                bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 
                                focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 
                                disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                    </svg>
                                    Disabling...
                                </span>
                            ) : (
                                'Disable 2FA'
                            )}
                        </button>
                    ) : (
                        <button
                            onClick={handleConfigureMFA}
                            disabled={isLoading}
                            className="inline-flex items-center justify-center px-4 py-2 
                                text-sm font-medium rounded-lg text-white bg-[#00b5df] 
                                hover:bg-[#0099c9] focus:outline-none focus:ring-2 
                                focus:ring-offset-2 focus:ring-[#00b5df] disabled:opacity-50 
                                disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                    </svg>
                                    Setting up...
                                </span>
                            ) : (
                                'Enable 2FA'
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );

    const renderQRCodeStep = () => (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="max-w-xl mx-auto">
                <div className="flex items-center mb-6">
                    <button onClick={() => setSetupStep('initial')} 
                        className="p-2 -ml-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <RiArrowLeftLine className="w-5 h-5" />
                    </button>
                    <h2 className="text-xl font-semibold text-gray-900 ml-2">Set up authenticator app</h2>
                </div>
                <div className="space-y-6">
                    <ol className="space-y-4 text-sm text-gray-600">
                        <li className="flex items-start">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full border border-gray-200 mr-3 text-xs font-medium">1</span>
                            <p>Download and install an authenticator app</p>
                        </li>
                        <li className="flex items-start">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full border border-gray-200 mr-3 text-xs font-medium">2</span>
                            <p>Scan the QR code below with your authenticator app</p>
                        </li>
                    </ol>

                    {mfaData?.qrUrl && (
                        <div className="flex flex-col items-center p-6 border border-gray-100 rounded-xl bg-gray-50">
                            <img src={mfaData.qrUrl} alt="QR Code" className="w-48 h-48" />
                            <p className="mt-4 text-xs text-gray-500">Scan with your authenticator app</p>
                        </div>
                    )}

                    <button
                        onClick={() => setSetupStep('verify')}
                        className="w-full py-2.5 px-4 bg-[#00b5df] text-white text-sm font-medium rounded-lg 
                            hover:bg-[#0099c9] focus:outline-none focus:ring-2 focus:ring-offset-2 
                            focus:ring-[#00b5df] transition-colors"
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );

    const renderVerificationStep = () => (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="max-w-xl mx-auto">
                <div className="flex items-center mb-6">
                    <button onClick={() => setSetupStep('qr')} 
                        className="p-2 -ml-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <RiArrowLeftLine className="w-5 h-5" />
                    </button>
                    <h2 className="text-xl font-semibold text-gray-900 ml-2">Verify setup</h2>
                </div>
                <div className="space-y-8">
                    <div className="text-center space-y-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Enter verification code
                        </h3>
                        <p className="text-sm text-gray-500">
                            Open your authenticator app to view your verification code
                        </p>
                    </div>
                    
                    <div className="flex flex-col items-center space-y-6">
                        <input
                            type="text"
                            maxLength={6}
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                            className="w-full max-w-[336px] h-14 text-center text-3xl font-mono tracking-wider 
                                bg-gray-50 border-2 border-gray-200 rounded-lg 
                                focus:ring-2 focus:ring-[#00b5df] focus:border-[#00b5df] 
                                placeholder:text-gray-300 outline-none transition-all
                                disabled:opacity-50 disabled:cursor-not-allowed"
                            placeholder="000000"
                            autoComplete="off"
                            disabled={isLoading}
                        />

                        <button
                            onClick={handleVerifyMFA}
                            disabled={verificationCode.length !== 6 || isLoading}
                            className="w-full max-w-[336px] py-3 px-4 flex items-center justify-center gap-2
                                text-sm font-medium rounded-lg text-white bg-[#00b5df] 
                                hover:bg-[#0099c9] focus:outline-none focus:ring-2 
                                focus:ring-offset-2 focus:ring-[#00b5df] disabled:opacity-50 
                                disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                    </svg>
                                    <span>Verifying...</span>
                                </>
                            ) : (
                                'Complete verification'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderContent = () => {
        switch (setupStep) {
            case 'qr':
                return renderQRCodeStep();
            case 'verify':
                return renderVerificationStep();
            default:
                return renderInitialState();
        }
    };


    return renderContent();
}

export default MfaAuth;