import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast';
import { useUserAuth } from '../context/UserAuthContext';

function SignUp() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        profileImage: ''
    });

    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState(''); 
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const navigate = useNavigate();
    const { createNewUser } = useUserAuth(); // Assuming createNewUser is defined in UserAuthContext

    // Animation on load
    useEffect(() => {
        setIsVisible(true);
    }, []);

    // Simple validation for each step - Removed profileImage requirement
    const canProceed = () => {
        switch (step) {
            case 1:
                return formData.name.trim().length >= 2;
            case 2:
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
            case 3:
                return formData.password.length >= 8 && formData.password === confirmPassword;
            default:
                return false;
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const nextStep = () => {
        if (canProceed()) {
            setStep(prev => prev + 1);
        }
    };

    const prevStep = () => {
        setStep(prev => Math.max(prev - 1, 1));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!agreeToTerms) {
            toast.error('Please agree to the terms and conditions');
            return;
        }

        setIsLoading(true);

        try {
            const response = await createNewUser(formData);

            if (response.status === 201) {
                toast.success('Account created successfully!');
                navigate("/login");
            }

        } catch (error: any) {
            console.error("Error during registration:", error);
            if( error.response && error.response.status === 409) {
                toast.error('Email already exists. Please try a different email.');
            }
            else{
                toast.error('Registration failed. Please try again.');
            }
            
        } finally {
            setIsLoading(false);
        }
    };

    const renderForm = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-center mb-6">Tell us about yourself</h2>

                        {/* Full name input - removed profile image section */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#00b5df] focus:border-[#00b5df]"
                                placeholder="Your Name"
                            />
                            {formData.name && formData.name.trim().length < 2 && (
                                <p className="mt-2 text-sm text-red-600">Name must be at least 2 characters</p>
                            )}
                        </div>

                        {/* Next button */}
                        <button
                            type="button"
                            onClick={nextStep}
                            disabled={!canProceed()}
                            className={`mt-4 w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-gradient-to-r from-[#00b5df] to-cyan-500 hover:from-[#00a5cf] hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00b5df] ${!canProceed() ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            Next
                        </button>

                    </div>
                );

            case 2:
                return (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-center mb-6">Your email address</h2>

                        {/* Email input */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#00b5df] focus:border-[#00b5df]"
                                placeholder="Your Email Address"
                            />
                            {formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (
                                <p className="mt-2 text-sm text-red-600">Please enter a valid email address</p>
                            )}
                        </div>

                        {/* Navigation buttons */}
                        <div className="flex space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={prevStep}
                                className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00b5df]"
                            >
                                Back
                            </button>
                            <button
                                type="button"
                                onClick={nextStep}
                                disabled={!canProceed()}
                                className={`flex-1 py-3 px-4 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-gradient-to-r from-[#00b5df] to-cyan-500 hover:from-[#00a5cf] hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00b5df] ${!canProceed() ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-center mb-6">Create a password</h2>

                        {/* Password input */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    required
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#00b5df] focus:border-[#00b5df]"
                                    placeholder="Create a secure password"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                    onClick={() => setShowPassword(!showPassword)}
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
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#00b5df] focus:border-[#00b5df]"
                                    placeholder="Confirm your password"
                                />
                            </div>

                            {/* Password match indicator */}
                            {confirmPassword && (
                                <div className="mt-2">
                                    {formData.password === confirmPassword ? (
                                        <p className="text-xs text-green-600 flex items-center">
                                            <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                            </svg>
                                            Passwords match
                                        </p>
                                    ) : (
                                        <p className="text-xs text-red-600 flex items-center">
                                            <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                                            </svg>
                                            Passwords don't match
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                        {/* Password strength indicator */}
                        <div className="mt-3">
                            <div className="text-xs text-gray-600 mb-1">Password strength:</div>
                            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${formData.password.length === 0 ? 'w-0' :
                                        formData.password.length < 6 ? 'w-1/4 bg-red-500' :
                                            formData.password.length < 8 ? 'w-2/4 bg-yellow-500' :
                                                formData.password.length < 10 ? 'w-3/4 bg-blue-500' :
                                                    'w-full bg-green-500'
                                        } transition-all duration-300`}
                                ></div>
                            </div>

                            {/* Password requirements */}
                            <div className="mt-3 space-y-1 text-xs text-gray-500">
                                <div className="flex items-center">
                                    <svg className={`h-3 w-3 mr-1 ${formData.password.length >= 8 ? 'text-green-500' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <span>At least 8 characters</span>
                                </div>
                            </div>
                        </div>

                        {/* Terms and Conditions */}
                        <div className="mt-3">
                            <div className="flex items-center">
                                <input
                                    id="agreeToTerms"
                                    name="agreeToTerms"
                                    type="checkbox"
                                    checked={agreeToTerms}
                                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                                    className="h-4 w-4 text-[#00b5df] focus:ring-[#00b5df] border-gray-300 rounded"
                                />
                                <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-600">
                                    I agree to the{' '}
                                    <Link to="/terms" className="text-[#00b5df] hover:text-cyan-700">
                                        Terms of Service
                                    </Link>{' '}
                                    and{' '}
                                    <Link to="/privacy" className="text-[#00b5df] hover:text-cyan-700">
                                        Privacy Policy
                                    </Link>
                                </label>
                            </div>
                        </div>

                        {/* Navigation buttons */}
                        <div className="flex space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={prevStep}
                                className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00b5df]"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading || !canProceed() || !agreeToTerms}
                                className={`flex-1 relative py-3 px-4 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-gradient-to-r from-[#00b5df] to-cyan-500 hover:from-[#00a5cf] hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00b5df] ${(isLoading || !canProceed() || !agreeToTerms) ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {isLoading && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    </div>
                                )}
                                {isLoading ? '' : 'Create Account'}
                            </button>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/30 to-cyan-50 flex flex-col lg:flex-row">
            {/* Left Panel - Only on large screens */}
            <div className="hidden lg:flex lg:w-1/2 lg:min-h-screen bg-gradient-to-br from-[#00b5df] to-cyan-600 p-8 flex-col justify-center relative">
                <div className="absolute inset-0 bg-black/10"></div>

                {/* Branding */}
                <div className="relative z-10">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                            <img
                                src="https://ik.imagekit.io/vituepzjm/SanAuth/SanAuth.svg?updatedAt=1749400779754"
                                alt="SANAUTH"
                                className="w-8 h-8"
                            />
                        </div>
                        <h1 className="text-2xl font-bold text-white">SanAuth</h1>
                    </div>

                    <div className="mt-16">
                        <h2 className="text-5xl font-extrabold text-white leading-tight">
                            Create your account <br /> in seconds
                        </h2>
                        <p className="mt-4 text-lg text-white/80">
                            Join thousands of users who trust our <br />
                            secure authentication service.
                        </p>
                    </div>

                    <div className="mt-12 ">
                        <div className="flex items-center mb-6">
                            {[1, 2, 3].map((item) => (
                                <div key={item} className="flex items-center">
                                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-medium transition-colors ${step >= item
                                        ? 'bg-white text-[#00b5df] border-white'
                                        : 'bg-transparent text-white/60 border-white/60'
                                        }`}>
                                        {item}
                                    </div>
                                    {item < 3 && (
                                        <div className={`h-0.5 w-16 mx-2 transition-colors ${step > item ? 'bg-white' : 'bg-white/30'
                                            }`}></div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center text-white/80 text-sm">
                            {step === 1 && <span>Step 1: Profile</span>}
                            {step === 2 && <span>Step 2: Email Address</span>}
                            {step === 3 && <span>Step 3: Security</span>}
                        </div>
                    </div>
                </div>


            </div>

            {/* Right Panel - Form */}
            <div className="flex-1 flex flex-col py-4 lg:py-0">
                {/* Mobile Header with Logo and Progress */}
                <div className="lg:hidden px-6 mb-4">
                    <div className="flex items-center  justify-between mb-6">
                        <div className="flex items-center">
                            <div className="w-10 h-10 flex items-center justify-center">
                                <img
                                    src="https://ik.imagekit.io/vituepzjm/SanAuth/SanAuth.svg?updatedAt=1749400779754"
                                    alt="SANAUTH"
                                    className="size-8"
                                />
                            </div>
                            <span className="ml-2 text-xl font-bold text-gray-500">
                                Create Account
                            </span>
                        </div>
                        <Link to="/login" className="text-sm text-[#00b5df] font-medium">
                            Sign in
                        </Link>
                    </div>
                </div>

                {/* Form Content */}
                <div className="flex-1 flex items-center justify-center px-6">
                    <div className={`w-full max-w-md transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-white/50 p-6 sm:p-8">
                            {renderForm()}
                        </form>

                        {/* Sign In Link - Only show on desktop */}
                        <div className="mt-4 text-center hidden lg:block">
                            <p className="text-sm text-gray-600">
                                Already have an account?{' '}
                                <Link to="/login" className="font-medium text-[#00b5df] hover:text-cyan-700">
                                    Sign in here
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignUp;