import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import request from '../config/axios_config'
import toast from 'react-hot-toast';

function ForgetPassword() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState<string[]>(Array(4).fill(''));
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const otpInputs = useRef<(HTMLInputElement | null)[]>([]);
    const navigate = useNavigate();

    // Animation effect on component mount
    useEffect(() => {
        setIsVisible(true);
    }, []);

    // Calculate password strength
    const getPasswordStrength = () => {
        if (!password) return 0;

        let strength = 0;
        // Length check
        if (password.length >= 8) strength += 25;
        // Contains uppercase
        if (/[A-Z]/.test(password)) strength += 25;
        // Contains lowercase
        if (/[a-z]/.test(password)) strength += 25;
        // Contains number or special char
        if (/[0-9!@#$%^&*()]/.test(password)) strength += 25;

        return strength;
    };

    const passwordStrength = getPasswordStrength();

    // Handle OTP input
    const handleOtpChange = (index: number, value: string) => {
        if (value && !/^\d+$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        // Auto-advance to next field
        if (value && index < 3) {
            otpInputs.current[index + 1]?.focus();
        }
    };

    // Handle backspace in OTP fields
    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpInputs.current[index - 1]?.focus();
        }
    };

    // Handle OTP paste
    const handlePaste = (e: React.ClipboardEvent, startIndex: number) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').trim();

        if (!/^\d+$/.test(pastedData)) return;

        const newOtp = [...otp];
        for (let i = 0; i < Math.min(pastedData.length, 4 - startIndex); i++) {
            newOtp[startIndex + i] = pastedData[i];
        }
        setOtp(newOtp);

        // Focus appropriate field
        const nextEmptyIndex = newOtp.findIndex((val, idx) => idx >= startIndex && !val);
        if (nextEmptyIndex >= 0) {
            otpInputs.current[nextEmptyIndex]?.focus();
        } else {
            otpInputs.current[3]?.focus();
        }
    };

    // Request password reset
    const handleRequestReset = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            toast.error('Please enter a valid email address');
            return;
        }

        setIsLoading(true);
        try {
            // Replace with your actual API endpoint
            const response = await request.post('/api/auth/forgot-password', { email });

            if (response.status === 200) {
                toast.success('Reset code sent to your email');
                setStep(2); // Move to OTP verification
            }
        } catch (error: any) {
            if (error.response?.status === 404) {
                toast.error('No account found with this email');
            } else {
                toast.error('Failed to send reset code. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Verify OTP
    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();

        if (otp.some(digit => digit === '')) {
            toast.error('Please enter the complete verification code');
            return;
        }

        setIsLoading(true);
        try {
            // Convert OTP array to a number
            const otpNumber = parseInt(otp.join(''), 10);

            console.log('Verifying OTP:', otpNumber, 'for email:', email);

            // Include password in the verification request
            const response = await request.post('/api/auth/reset-password', {
                email,
                otp: otpNumber,
                password
            });

            if (response.status === 200) {
                toast.success('Code verified and password reset successfully');

                // Since password is now set during verify, we can skip step 3
                // Show success animation then redirect
                setTimeout(() => {
                    navigate('/login');
                }, 1500);
            }
        } catch (error: any) {
            if (error.response?.status === 401) {
                toast.error(error.response.data.error || 'Invalid verification code');
                setOtp(Array(4).fill(''));
            } else {
                toast.error('Verification failed. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Render appropriate step content
    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="fade-in">
                        <h2 className="text-xl font-bold text-center mb-4">Reset Your Password</h2>
                        <p className="text-gray-600 text-center text-sm mb-5">
                            Enter your email address to receive a verification code
                        </p>

                        <form onSubmit={handleRequestReset} className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                        </svg>
                                    </div>
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00b5df] focus:border-[#00b5df] transition-colors"
                                        placeholder="Enter your email address"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-[#00b5df] to-cyan-500 hover:from-[#00a5cf] hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00b5df] disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <div className="flex items-center">
                                        <svg className="animate-spin h-5 w-5 mr-2 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Sending...
                                    </div>
                                ) : 'Send Reset Code'}
                            </button>
                        </form>
                    </div>
                );

            case 2:
                return (
                    <div className="fade-in">
                        <h2 className="text-xl font-bold text-center mb-3">Verify Code & Reset</h2>
                        <p className="text-gray-600 text-center text-sm mb-4">
                            Enter the code sent to your email and create a new password
                        </p>

                        <div className="mb-4 bg-[#0090b3]/10 p-2.5 rounded-lg">
                            <div className="flex items-center">
                                <svg className="h-4 w-4 text-[#0090b3]/60 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                <p className="ml-2 text-xs text-[#0090b3]/80 line-clamp-1 break-all">
                                    Code sent to <span className="font-medium">{email}</span>
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleVerifyOtp} className="space-y-4">
                            {/* OTP Input */}
                            <div>
                                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Verification Code
                                </label>
                                <div className="grid grid-cols-4 gap-2 mb-2">
                                    {Array(4).fill(0).map((_, index) => (
                                        <input
                                            key={index}
                                            ref={(el: any) => otpInputs.current[index] = el}
                                            type="text"
                                            maxLength={1}
                                            value={otp[index]}
                                            onChange={(e) => handleOtpChange(index, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(index, e)}
                                            onPaste={(e) => handlePaste(e, index)}
                                            className="w-full h-12 border border-gray-300 rounded-lg text-center text-lg font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#00b5df] focus:border-[#00b5df] shadow-sm"
                                            aria-label={`Digit ${index + 1}`}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Password Fields */}
                            <div className="space-y-3">
                                {/* Password field */}
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="block w-full pl-9 pr-9 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00b5df] focus:border-[#00b5df]"
                                            placeholder="Create password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-gray-400 hover:text-[#00b5df]"
                                        >
                                            {showPassword ? (
                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            ) : (
                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>

                                    {/* Password strength indicator */}
                                    {password && (
                                        <div className="mt-1.5 flex items-center gap-2">
                                            <div className="h-1 flex-grow bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-300 ${passwordStrength < 50 ? 'bg-red-500' :
                                                        passwordStrength < 75 ? 'bg-yellow-500' :
                                                            'bg-green-500'
                                                        }`}
                                                    style={{ width: `${passwordStrength}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs whitespace-nowrap">
                                                {passwordStrength < 50 ? 'Weak' :
                                                    passwordStrength < 75 ? 'Medium' : 'Strong'}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Confirm Password field */}
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                        <input
                                            id="confirmPassword"
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="block w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00b5df] focus:border-[#00b5df]"
                                            placeholder="Confirm password"
                                        />
                                    </div>

                                    {/* Password match indicator */}
                                    {confirmPassword && (
                                        <div className="mt-1 flex items-center">
                                            {password === confirmPassword ? (
                                                <>
                                                    <svg className="h-3 w-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                                    </svg>
                                                    <span className="ml-1 text-xs text-green-600">Passwords match</span>
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="h-3 w-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                                                    </svg>
                                                    <span className="ml-1 text-xs text-red-600">Passwords don't match</span>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2 pt-1">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="flex-1 py-2.5 px-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    disabled={
                                        isLoading ||
                                        otp.some(digit => digit === '') ||
                                        !password ||
                                        password !== confirmPassword ||
                                        password.length < 8
                                    }
                                    className="flex-1 relative py-2.5 px-3 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-[#00b5df] to-cyan-500 hover:from-[#00a5cf] hover:to-cyan-600 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center">
                                            <svg className="animate-spin h-4 w-4 mr-1 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Resetting...
                                        </div>
                                    ) : 'Reset Password'}
                                </button>
                            </div>
                        </form>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-sky-50/30 to-cyan-50">
            {/* Left Side - Branding (Desktop only) */}
            <div className="hidden lg:flex justify-center items-center lg:w-1/2 relative bg-gradient-to-br from-[#00b5df] to-cyan-600 p-8 flex-col">
                <div className="absolute inset-0 bg-black/10"></div>

                {/* Branding Content */}
                <div className="relative z-10 w-full">
                    {/* Logo */}
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-white/90 rounded-xl flex items-center justify-center">
                            <img
                                src="https://ik.imagekit.io/vituepzjm/SanAuth/SanAuth.svg?updatedAt=1749400779754"
                                alt="SANAUTH"
                                className="w-8 h-8"
                            />
                        </div>
                        <h1 className="text-2xl font-bold text-white">SanAuth</h1>
                    </div>

                    {/* Content for left panel */}
                    <div className="mt-16 max-w-md">
                        <h2 className="text-5xl font-extrabold text-white leading-tight">
                            Reset your password
                        </h2>
                        <p className="mt-4 text-lg text-white/80">
                            We'll help you get back into
                            your account safely.
                        </p>

                        {/* Step indicator */}
                        <div className="mt-16">
                            <div className="flex items-center mb-5">
                                {[1, 2].map((num) => (
                                    <div key={num} className="flex items-center">
                                        <div className={`rounded-full h-8 w-8 flex items-center justify-center border-2 transition-colors ${step >= num
                                            ? 'bg-white text-[#00b5df] border-white'
                                            : 'bg-transparent text-white/60 border-white/60'
                                            }`}>
                                            {num}
                                        </div>
                                        {num < 2 && (
                                            <div className={`h-0.5 w-12 mx-2 transition-colors ${step > num ? 'bg-white' : 'bg-white/30'
                                                }`}></div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="text-white/80 font-medium text-sm">
                                {step === 1 && 'Step 1: Request Reset Code'}
                                {step === 2 && 'Step 2: Verify & Reset Password'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex flex-col">

                {/* Form Container */}
                <div className="flex-1 flex items-center justify-center p-4">
                    <div className={`w-full max-w-md transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        <div className="bg-white shadow-md rounded-xl border border-gray-100 p-5">
                            {renderStep()}
                        </div>

                        {/* Login Link */}
                        <div className="mt-3 text-center">
                            <p className="text-sm text-gray-600">
                                Remember your password?{' '}
                                <Link to="/login" className="font-medium text-[#00b5df] hover:text-cyan-600">
                                    Sign in here
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ForgetPassword