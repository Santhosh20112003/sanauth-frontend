import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import request from '../config/axios_config'
import toast from 'react-hot-toast';
import * as UAParser from 'ua-parser-js';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const navigate = useNavigate();

    const getLoginMetaData = async () => {
        const ipRes = await fetch('https://ipapi.co/json');
        const ipData = await ipRes.json();

        const parser = new UAParser.UAParser();
        const deviceInfo = `${parser.getBrowser().name} on ${parser.getOS().name}`;

        const payload = {
            loginTime: new Date().toISOString(),
            deviceInfo: deviceInfo,
            ipAddress: ipData.ip,
            location: `${ipData.city}, ${ipData.region}`
        };
        console.log('Login Metadata:', payload);
        return payload;
    }

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            setIsLoading(true)
            const loginmetadata = await getLoginMetaData();
            const response = await request.post('/api/auth/login', {
                email,
                password,
                metadata: loginmetadata
            });

            if (response.status === 200) {
                if (rememberMe) {
                    localStorage.setItem('token', response.data.token);
                }
                else {
                    sessionStorage.setItem('token', response.data.token);
                }
                toast.success('Welcome back! Login successful.');
                navigate("/dashboard/home");
            }

        } catch (error: any) {
            console.error('Login failed:', error)

            if (error.response && error.response.status === 400) {
                toast.error('Please fill in all fields correctly.');

            } else if (error.response && error.response.status === 401) {
                toast.error('Invalid credentials. Please try again.');

            } else if (error.response && error.response.status === 402) {
                toast('Your account is not verified. Please check your email for verification instructions.');

                setTimeout(() => {
                    window.open(`https://mail.google.com/mail/u/0/#search/SanAuth Email Verification`, '_blank');
                    navigate(`/verify/${btoa(email)}`);
                }, 2000);

            }
            else if (error.response && error.response.status === 403) {
                toast.error(error.response.data.error || 'Your Account has been blocked. Please contact support.');
            }
            else if (error.response && error.response.status === 500) {
                toast.error('Server error. Please try again later.');
            } else {
                toast.error('An unexpected error occurred. Please try again.');
            }
        }
        finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex relative overflow-hidden bg-gradient-to-br from-slate-50 via-sky-50/30 to-cyan-50">
            {/* Left Side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative justify-center items-center bg-gradient-to-br from-[#00b5df] to-cyan-600 p-8 flex-col">
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
                    <div className="mt-16 max-w-md">
                        <h2 className="text-5xl font-extrabold text-white leading-tight">
                            Welcome back <br /> to your account
                        </h2>
                        <p className="mt-4 text-lg text-white/80">
                            Securely access your dashboard and <br />
                            continue your journey with us.
                        </p>

                        {/* Security Feature Highlights */}
                        <div className="mt-12">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="bg-white/20 rounded-full p-2">
                                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <span className="text-white/90">Secure authentication</span>
                            </div>
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="bg-white/20 rounded-full p-2">
                                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <span className="text-white/90">Advanced protection</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="bg-white/20 rounded-full p-2">
                                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <span className="text-white/90">Activity monitoring</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form - Keep existing */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className={`w-full max-w-md transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <h3 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h3>
                            <p className="text-gray-600">Sign in to your account to continue</p>
                        </div>

                        {/* Login Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Email Field */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
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
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00b5df] focus:border-[#00b5df] transition-colors"
                                        placeholder="Enter your email"
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00b5df] focus:border-[#00b5df] transition-colors"
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#00b5df] transition-colors"
                                    >
                                        {showPassword ? (
                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                            </svg>
                                        ) : (
                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="h-4 w-4 text-[#00b5df] focus:ring-[#00b5df] border-gray-300 rounded"
                                    />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                        Remember me
                                    </label>
                                </div>
                                <Link to="/forget-password" className="text-sm font-medium text-[#00b5df] hover:text-cyan-600 transition-colors">
                                    Forgot password?
                                </Link>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-[#00b5df] to-cyan-500 hover:from-[#00a5cf] hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00b5df] transform transition-all duration-200 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5 hover:shadow-lg'}`}
                            >
                                {isLoading && (
                                    <div className="absolute left-0 inset-y-0 flex items-center pl-3">
                                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    </div>
                                )}
                                {isLoading ? 'Signing in...' : 'Sign In'}
                            </button>
                        </form>

                        {/* Sign Up Link */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Don't have an account?{' '}
                                <Link to="/signup" className="font-medium text-[#00b5df] hover:text-cyan-600 transition-colors">
                                    Create one here
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login