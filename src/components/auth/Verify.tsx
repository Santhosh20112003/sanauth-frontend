import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import request from "../config/axios_config";

function Verify() {
    const { email } = useParams<{ email: string }>();
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [verificationSuccess, setVerificationSuccess] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const [otp, setOtp] = useState<string[]>(Array(4).fill(""));
    const otpInputs = useRef<(HTMLInputElement | null)[]>([]);
     const navigate = useNavigate();

    const decodedEmail = useMemo(() => {
        if (!email) return null;
        try {
            const decoded = window.atob(email);
            // Basic sanity check for an email pattern
            if (!decoded.includes("@") || !decoded.includes(".")) {
                return null;
            }
            return decoded;
        } catch (e) {
            return null;
        }
    }, [email]);


    const handleOtpChange = (index: number, value: string) => {
        // Only allow numbers
        if (value && !/^\d+$/.test(value)) return;

        const newOtp = [...otp];
        // Take only the last character if multiple are pasted
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        // Auto advance to next field if current field is filled
        if (value && index < 3) {
            otpInputs.current[index + 1]?.focus();
        }
    };

    // Handle backspace key
    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            otpInputs.current[index - 1]?.focus();
        }
    };

    // Handle OTP verification
    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!decodedEmail) {
            toast.error("Invalid email address");
            return;
        }

        const otpValue = otp.join("");
        if (otpValue.length !== 4) {
            toast.error("Please enter all 4 digits of the verification code");
            return;
        }

        setIsVerifying(true);

        try {
            const response = await request.post('/api/auth/verify', {
                email: decodedEmail,
                otp: Number(otpValue)
            });

            if (response.status === 200) {
                setVerificationSuccess(true);
                toast.success("Email verified successfully!");
                navigate("/login");
            }
        } catch (error:any) {
            if(error.response && error.response.status === 401) {
                toast.error(error.response.data.error || "Invalid OTP. Please try again.");
                setOtp(Array(4).fill(""));
            }else {
                toast.error("Failed to verify email. Please try again.");
            }
        } finally {
            setIsVerifying(false);
        }
    };

    // Handle resend OTP
    const handleResendOtp = async () => {
        if (resendCooldown > 0 || !decodedEmail) return;

        setIsResending(true);

        try {
            const response = await request.post('/api/auth/resend-otp', {
                email: decodedEmail
            });

            if (response.status === 200) {
                toast.success(" Verification code sent to your email!");
            }

            if(response.status === 201){
                toast.error("Email already verified");
                setVerificationSuccess(true);
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            }
        } catch (error) {
            toast.error("Failed to send verification code");
        } finally {
            setIsResending(false);
        }
    };

    // Cooldown timer
    useEffect(() => {
        if (resendCooldown <= 0) return;

        const interval = setInterval(() => {
            setResendCooldown(current => current - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [resendCooldown]);

    // Paste OTP functionality
    const handlePaste = (e: React.ClipboardEvent, startIndex: number) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').trim();

        // Check if pasted content contains only digits
        if (!/^\d+$/.test(pastedData)) return;

        // Fill OTP fields with pasted digits
        const newOtp = [...otp];
        for (let i = 0; i < Math.min(pastedData.length, 4 - startIndex); i++) {
            newOtp[startIndex + i] = pastedData[i];
        }
        setOtp(newOtp);

        // Focus the next empty field or the last field if all are filled
        const nextEmptyIndex = newOtp.findIndex((val, idx) => idx >= startIndex && !val);
        if (nextEmptyIndex >= 0) {
            otpInputs.current[nextEmptyIndex]?.focus();
        } else {
            otpInputs.current[3]?.focus();
        }
    };

    return (
        <div className="min-h-screen flex relative overflow-hidden bg-gradient-to-br from-slate-50 via-sky-50/30 to-cyan-50">
            {/* Left Side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative items-center justify-start bg-gradient-to-br from-[#00b5df] to-cyan-600 p-8 flex-col">
                <div className="absolute inset-0 bg-black/10"></div>
                
                {/* Branding Content */}
                <div className="relative z-10 w-full">
                    {/* Logo - Keep existing */}
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
                    
                    {/* New Content - Matching SignUp.tsx */}
                    <div className="mt-12 max-w-md">
                        <h2 className="text-5xl font-extrabold text-white leading-tight">
                            Almost there! <br /> Verify your email
                        </h2>
                        <p className="mt-4 text-lg text-white/80">
                            Check your inbox for the verification code <br />
                            to complete your account setup.
                        </p>
                        
                        {/* Why Verification Matters */}
                        <div className="mt-12 bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                            <h3 className="text-xl font-bold text-white mb-4">Why verification matters</h3>
                            <div className="space-y-3">
                                <div className="flex items-start">
                                    <div className="bg-white/20 rounded-full p-1.5 mt-0.5 mr-3">
                                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-white/90 text-sm">Protects your account from unauthorized access</span>
                                </div>
                                <div className="flex items-start">
                                    <div className="bg-white/20 rounded-full p-1.5 mt-0.5 mr-3">
                                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-white/90 text-sm">Ensures we can communicate with you securely</span>
                                </div>
                            
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className={`w-full max-w-md transition-all duration-700 `}>
                    
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <h3 className="text-3xl font-bold text-gray-900 mb-2">
                                {verificationSuccess ? 'Email Verified!' : 'Verify your email'}
                            </h3>
                            <p className="text-gray-600">
                                {verificationSuccess
                                    ? 'Your account has been successfully verified.'
                                    : 'Enter the 4-digit code sent to your email.'}
                            </p>
                        </div>

                        {/* Content Area */}
                        {!decodedEmail ? (
                            <div className="text-center">
                                <div className="bg-red-50 p-4 rounded-xl mb-6">
                                    <svg className="h-12 w-12 text-red-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <p className="text-red-800 font-medium mb-1">Invalid Verification Link</p>
                                    <p className="text-red-700 text-sm">The verification link appears to be corrupted or invalid.</p>
                                </div>
                                <Link to="/login" className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-[#00b5df] to-cyan-500 hover:from-[#00a5cf] hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00b5df] transform transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
                                    Return to Login
                                </Link>
                            </div>
                        ) : verificationSuccess ? (
                            <div className="text-center">
                                <div className="bg-green-50 p-6 rounded-xl mb-6">
                                    <svg className="h-16 w-16 text-green-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-green-800 font-medium text-lg mb-1">Email Verified Successfully</p>
                                    <p className="text-green-700">{decodedEmail}</p>
                                </div>
                                <div className="space-y-3">
                                    <Link to="/login" className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-[#00b5df] to-cyan-500 hover:from-[#00a5cf] hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00b5df] transform transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
                                        Proceed to Login
                                    </Link>
                                    <Link to="/" className="w-full flex justify-center py-3 px-4 border border-gray-200 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00b5df]">
                                        Return to Homepage
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div>
                                {decodedEmail && (
                                    <div className="mb-6 bg-[#0090b3]/10 p-4 rounded-xl">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <svg className="h-5 w-5 text-[#0090b3]/60" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div className="ml-3 flex-1">
                                                <p className="text-sm text-[#0090b3]/80">
                                                    Code sent to <span className="font-medium">{decodedEmail}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <form onSubmit={handleVerify} className="space-y-6">
                                    <div>
                                        <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-3">
                                            Verification Code
                                        </label>
                                        <div className="flex justify-between space-x-5 mb-3">
                                            {Array(4).fill(0).map((_, index) => (
                                                <div key={index} className="flex-1">
                                                    <input
                                                        ref={(el:any) => otpInputs.current[index] = el}
                                                        type="text"
                                                        maxLength={1}
                                                        value={otp[index]}
                                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                                        onPaste={(e) => handlePaste(e, index)}
                                                        className="w-full h-14 border border-gray-300 rounded-xl text-center text-xl font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#00b5df] focus:border-[#00b5df] transition-colors shadow-sm"
                                                        aria-label={`Digit ${index + 1} of verification code`}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs text-gray-500">
                                                Didn't receive the code?{' '}
                                                <button
                                                    type="button"
                                                    onClick={handleResendOtp}
                                                    disabled={resendCooldown > 0 || isResending}
                                                    className={`font-medium ${
                                                        resendCooldown > 0 || isResending 
                                                            ? 'text-gray-400 cursor-not-allowed' 
                                                            : 'text-[#00b5df] hover:text-cyan-600 transition-colors'
                                                    }`}
                                                >
                                                    {isResending 
                                                        ? 'Sending...' 
                                                        : resendCooldown > 0 
                                                            ? `Resend in ${resendCooldown}s` 
                                                            : 'Resend code'}
                                                </button>
                                            </p>
                                        </div>
                                    </div>

                                    {/* Submit Button - Match styling from Login.tsx */}
                                    <button
                                        type="submit"
                                        disabled={isVerifying || otp.some(digit => digit === '')}
                                        className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-[#00b5df] to-cyan-500 hover:from-[#00a5cf] hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00b5df] transform transition-all duration-200 ${isVerifying || otp.some(digit => digit === '') ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5 hover:shadow-lg'}`}
                                    >
                                        {isVerifying && (
                                            <div className="absolute left-0 inset-y-0 flex items-center pl-3">
                                                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            </div>
                                        )}
                                        {isVerifying ? 'Verifying...' : 'Verify Email'}
                                    </button>
                                </form>

                                {/* Sign Up Link - Match styling from Login.tsx */}
                                <div className="mt-6 text-center">
                                    <p className="text-sm text-gray-600">
                                        Return to{' '}
                                        <Link to="/login" className="font-medium text-[#00b5df] hover:text-cyan-600 transition-colors">
                                            Sign in
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Verify;
