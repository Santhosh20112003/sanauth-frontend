import React, { useState } from 'react';
import {
  RiEyeLine, RiEyeOffLine, RiShieldLine, RiArrowLeftLine
} from 'react-icons/ri';
import { Link } from 'react-router-dom';

interface SecurityProps {
  onChangePassword?: (currentPassword: string, newPassword: string) => Promise<void>;
  standalone?: boolean;
}

const Security: React.FC<SecurityProps> = () => {

  const standalone = false;
  const onChangePassword = async () => {
    console.log('Password change function not provided');
    return new Promise<void>(resolve => setTimeout(resolve, 1000));
  }
  const [showPassword, setShowPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Handle password input change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };

  // Change password
  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onChangePassword();
      setMessage({ text: "Password changed successfully!", type: "success" });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      setMessage({ text: "Failed to update password. Please try again.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

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
        {/* Change Password */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          {!standalone && <h2 className="text-lg font-semibold text-gray-800 mb-6">Change Password</h2>}
          {standalone && <h2 className="text-lg font-semibold text-gray-800 mb-6">Password Management</h2>}

          {message.text && (
            <div className={`p-3 rounded-lg mb-4 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={changePassword} className="space-y-4">
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
            </div>

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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#67c6ff]/30 focus:border-[#67c6ff]"
                required
              />
            </div>

            {passwordData.newPassword && passwordData.confirmPassword &&
              passwordData.newPassword !== passwordData.confirmPassword && (
                <p className="text-sm text-red-600">Passwords do not match</p>
              )
            }

            <div className="pt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-[#67c6ff] text-white rounded-lg hover:bg-[#57b6ff] transition-colors"
                disabled={isSubmitting || !passwordData.currentPassword ||
                  !passwordData.newPassword ||
                  !passwordData.confirmPassword ||
                  passwordData.newPassword !== passwordData.confirmPassword}
              >
                {isSubmitting ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>

          <div className="mt-6 bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800 mb-1">Password Tips</h3>
            <ul className="text-xs text-blue-700 list-disc list-inside space-y-1">
              <li>Use at least 8 characters</li>
              <li>Include at least one special character</li>
              <li>Include at least one number</li>
              <li>Include uppercase and lowercase letters</li>
            </ul>
          </div>
        </div>

        {/* Two-Factor Authentication */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Two-Factor Authentication</h2>

          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">
                Add an extra layer of security to your account.
              </p>
              <p className="text-xs text-gray-400">
                You'll need to enter a code from your phone in addition to your password.
              </p>
            </div>
            <div>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                Reconfigure 2FA
              </button>
            </div>
          </div>

          <div className="flex items-center">
            <span className="text-xs bg-green-100 text-green-800 rounded-full px-3 py-1 mr-3">
              Enabled
            </span>
            <p className="text-sm text-gray-800">
              Your account is protected by two-factor authentication.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Security;
