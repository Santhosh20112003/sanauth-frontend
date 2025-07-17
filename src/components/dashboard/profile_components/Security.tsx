import React, { useState, useEffect } from 'react';
import {
  RiEyeLine, RiEyeOffLine, RiArrowLeftLine,
  RiShieldCheckLine, RiLockLine, RiCheckLine, RiCloseLine
} from 'react-icons/ri';
import { Link } from 'react-router-dom';
import request from '../../config/axios_config';
import toast from 'react-hot-toast';
import { useUserAuth } from '../../context/UserAuthContext';
import MfaAuth from './MfaAuth';

interface SecurityProps {
  standalone?: boolean;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface PasswordValidation {
  hasMinLength: boolean;
  hasSpecialChar: boolean;
  hasNumber: boolean;
  hasMixedCase: boolean;
}

const Security: React.FC<SecurityProps> = ({ standalone = false }) => {
  // State management
  const [showPassword, setShowPassword] = useState(false);
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [validation, setValidation] = useState<PasswordValidation>({
    hasMinLength: false,
    hasSpecialChar: false,
    hasNumber: false,
    hasMixedCase: false
  });
  const { SignOut } = useUserAuth();

  // Password validation effect
  useEffect(() => {
    if (passwordData.newPassword) {
      setValidation({
        hasMinLength: passwordData.newPassword.length >= 8,
        hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(passwordData.newPassword),
        hasNumber: /\d/.test(passwordData.newPassword),
        hasMixedCase: /[a-z]/.test(passwordData.newPassword) && /[A-Z]/.test(passwordData.newPassword)
      });
    }
  }, [passwordData.newPassword]);

  // Handle password input change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear message when user starts typing again
    if (message.text) {
      setMessage({ text: '', type: '' });
    }
  };

  // Password strength calculation
  const getPasswordStrength = (): { strength: number, label: string, color: string } => {
    if (!passwordData.newPassword) {
      return { strength: 0, label: 'None', color: 'bg-gray-200' };
    }

    const { hasMinLength, hasSpecialChar, hasNumber, hasMixedCase } = validation;
    const criteriaCount = [hasMinLength, hasSpecialChar, hasNumber, hasMixedCase].filter(Boolean).length;

    if (criteriaCount === 4) return { strength: 100, label: 'Strong', color: 'bg-green-500' };
    if (criteriaCount === 3) return { strength: 75, label: 'Good', color: 'bg-blue-500' };
    if (criteriaCount === 2) return { strength: 50, label: 'Fair', color: 'bg-yellow-500' };
    return { strength: 25, label: 'Weak', color: 'bg-red-500' };
  };

  // Form validation
  const isFormValid = (): boolean => {
    return (
      !!passwordData.currentPassword &&
      !!passwordData.newPassword &&
      !!passwordData.confirmPassword &&
      passwordData.newPassword === passwordData.confirmPassword &&
      getPasswordStrength().strength >= 50 // At least "Fair" password
    );
  };

  // Change password
  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid()) return;

    setIsSubmitting(true);
    try {
      await request.post("/api/users/change/password", {
        old_password: passwordData.currentPassword,
        new_password: passwordData.newPassword
      });

      setMessage({ text: "Password changed successfully!", type: "success" });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      toast.success("Password updated successfully!");

      setTimeout(() => {
        SignOut();
      }, 2000);

    } catch (error: any) {
      console.log(error);
      const errorMessage = error?.response.data || "An error occurred while changing the password.";
      setMessage({ text: errorMessage, type: "error" });
      toast.error(errorMessage);
      console.error('Error changing password:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className={`${standalone ? 'p-6 max-w-6xl mx-auto' : ''}`}>
      {standalone && (
        <div className="flex items-center mb-6">
          <Link to="/profile" className="flex items-center text-gray-600 hover:text-gray-900 mr-4">
            <RiArrowLeftLine className="mr-1" /> Back to Profile
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Security Settings</h1>
        </div>
      )}

      <div className="space-y-6">
        {/* Change Password Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center mb-6">
            <RiLockLine className="w-5 h-5 text-gray-700 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800">
              {standalone ? 'Password Management' : 'Change Password'}
            </h2>
          </div>

          {message.text && (
            <div className={`p-3 rounded-lg mb-4 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={changePassword} className="space-y-4">
            {/* Current Password */}
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#67c6ff]/30 focus:border-[#67c6ff]"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <RiEyeOffLine className="text-gray-400 hover:text-gray-600" />
                  ) : (
                    <RiEyeLine className="text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="newPassword"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#67c6ff]/30 focus:border-[#67c6ff]"
                required
              />

              {/* Password strength indicator */}
              {passwordData.newPassword && (
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-gray-700">Password strength: </span>
                    <span className="text-xs font-medium">{passwordStrength.label}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all ${passwordStrength.color}`}
                      style={{ width: `${passwordStrength.strength}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Password requirement checklist */}
              {passwordData.newPassword && (
                <div className="mt-2 grid grid-cols-2 gap-1">
                  <div className={`flex items-center text-xs ${validation.hasMinLength ? 'text-green-600' : 'text-gray-500'}`}>
                    {validation.hasMinLength ? <RiCheckLine className="mr-1" /> : <RiCloseLine className="mr-1" />}
                    8+ characters
                  </div>
                  <div className={`flex items-center text-xs ${validation.hasSpecialChar ? 'text-green-600' : 'text-gray-500'}`}>
                    {validation.hasSpecialChar ? <RiCheckLine className="mr-1" /> : <RiCloseLine className="mr-1" />}
                    Special character
                  </div>
                  <div className={`flex items-center text-xs ${validation.hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
                    {validation.hasNumber ? <RiCheckLine className="mr-1" /> : <RiCloseLine className="mr-1" />}
                    Number
                  </div>
                  <div className={`flex items-center text-xs ${validation.hasMixedCase ? 'text-green-600' : 'text-gray-500'}`}>
                    {validation.hasMixedCase ? <RiCheckLine className="mr-1" /> : <RiCloseLine className="mr-1" />}
                    Mixed case
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#67c6ff]/30 ${passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword
                  ? 'border-red-300 focus:border-red-300'
                  : 'border-gray-300 focus:border-[#67c6ff]'
                  }`}
                required
              />

              {passwordData.newPassword && passwordData.confirmPassword &&
                passwordData.newPassword !== passwordData.confirmPassword && (
                  <p className="text-sm text-red-600 mt-1">Passwords do not match</p>
                )
              }
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className={`px-4 py-2 rounded-lg transition-colors flex items-center ${isFormValid()
                  ? 'bg-[#20bfef]/90 text-white hover:bg-[#20bfef]'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                disabled={isSubmitting || !isFormValid()}
              >
                {isSubmitting && (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {isSubmitting ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>

        <MfaAuth />
      </div>
    </div>
  );
};

export default Security;
