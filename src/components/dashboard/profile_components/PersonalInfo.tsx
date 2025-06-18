import React, { useEffect, useMemo, useState } from 'react';
import {
  RiEdit2Line, RiCheckLine, RiCloseLine, RiCamera2Line,
  RiMailLine, RiShieldUserLine, RiMapPinLine, RiPhoneLine,
  RiGlobalLine, RiBriefcaseLine, RiCalendarLine, RiUser3Line
} from 'react-icons/ri';
import { useUserAuth } from '../../context/UserAuthContext';

// Base user interface
interface User {
  uid: string;
  email: string;
  name: string;
  photoURL: string;
  role: string;
  createdAt: string;
  lastLogin: string;
  active: boolean;
  bio?: string;
  dob?: string;
  gender?: string;
  jobTitle?: string;
  location?: string;
  phone?: string;
  websiteUrl?: string;
}

const PersonalInfo: React.FC = () => {
  // Mock user data based on the structure
  const { user } = useUserAuth();

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<User>({ ...user });

  // Update formData whenever user changes
  useEffect(() => {
    if (user) {
      setFormData({ ...user });
    }
  }, [user]);

  // Get user initials from full name
  const getUserInitials = (name: string): string => {
    const nameParts = name.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`;
    }
    return name.charAt(0);
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData({
          ...formData,
          photoURL: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Save profile changes
  const saveProfileChanges = () => {
    setEditMode(false);
    // Here you would typically send the updated data to your backend
    console.log('Profile updated:', formData);
  };

  // Cancel profile changes
  const cancelProfileChanges = () => {
    setFormData({ ...user });
    setEditMode(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Personal Information</h2>
        {!editMode ? (
          <button
            onClick={() => setEditMode(true)}
            className="text-[#67c6ff] hover:text-[#57b6ff] font-medium text-sm flex items-center"
          >
            <RiEdit2Line className="mr-1" /> Edit Profile
          </button>
        ) : (
          <div className="flex space-x-3">
            <button
              onClick={cancelProfileChanges}
              className="text-gray-600 hover:text-gray-800 font-medium text-sm flex items-center"
            >
              <RiCloseLine className="mr-1" /> Cancel
            </button>
            <button
              onClick={saveProfileChanges}
              className="text-[#67c6ff] hover:text-[#57b6ff] font-medium text-sm flex items-center"
            >
              <RiCheckLine className="mr-1" /> Save Changes
            </button>
          </div>
        )}
      </div>

      {editMode ? (
        <div className="space-y-6">
          {/* Profile Image Edit */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100">
                {formData.photoURL ? (
                  <img src={formData.photoURL} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#67c6ff]/10 text-[#67c6ff] text-2xl font-bold">
                    {getUserInitials(formData.name)}
                  </div>
                )}
              </div>
              <label htmlFor="profile-upload" className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full border border-gray-200 shadow-sm cursor-pointer">
                <RiCamera2Line className="text-gray-600" />
                <input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
          </div>

          {/* Basic Info */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#67c6ff]/30 focus:border-[#67c6ff]"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#67c6ff]/30 focus:border-[#67c6ff]"
              readOnly
            />
            <p className="text-xs text-gray-500 mt-1">Email address cannot be changed</p>
          </div>

          {/* New fields added here */}
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio || ""}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#67c6ff]/30 focus:border-[#67c6ff]"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={formData.dob || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#67c6ff]/30 focus:border-[#67c6ff]"
              />
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender || ""}
                onChange={handleInputChange as React.ChangeEventHandler<HTMLSelectElement>}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#67c6ff]/30 focus:border-[#67c6ff]"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">
              Job Title
            </label>
            <input
              type="text"
              id="jobTitle"
              name="jobTitle"
              value={formData.jobTitle || ""}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#67c6ff]/30 focus:border-[#67c6ff]"
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location || ""}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#67c6ff]/30 focus:border-[#67c6ff]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#67c6ff]/30 focus:border-[#67c6ff]"
              />
            </div>

            <div>
              <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-700 mb-1">
                Website URL
              </label>
              <input
                type="url"
                id="websiteUrl"
                name="websiteUrl"
                value={formData.websiteUrl || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#67c6ff]/30 focus:border-[#67c6ff]"
              />
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center mb-2">
              <RiShieldUserLine className="text-gray-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">Account Role: {formData.role}</span>
            </div>
            <p className="text-xs text-gray-500">
              Your account role and permissions can only be changed by an administrator.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6">
            <div>
              <p className="text-xs text-gray-500 mb-1">Full Name</p>
              <p className="font-medium text-gray-800">{user.name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Email Address</p>
              <div className="flex items-center">
                <RiMailLine className="text-gray-400 mr-1.5" />
                <p className="font-medium line-clamp-1 break-all text-gray-800">{user.email}</p>
              </div>
            </div>

            {user.jobTitle && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Job Title</p>
                <div className="flex items-center">
                  <RiBriefcaseLine className="text-gray-400 mr-1.5" />
                  <p className="font-medium text-gray-800">{user.jobTitle}</p>
                </div>
              </div>
            )}

            {user.phone && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Phone Number</p>
                <div className="flex items-center">
                  <RiPhoneLine className="text-gray-400 mr-1.5" />
                  <p className="font-medium text-gray-800">{user.phone}</p>
                </div>
              </div>
            )}

            {user.location && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Location</p>
                <div className="flex items-center">
                  <RiMapPinLine className="text-gray-400 mr-1.5" />
                  <p className="font-medium text-gray-800">{user.location}</p>
                </div>
              </div>
            )}

            {user.websiteUrl && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Website</p>
                <div className="flex items-center">
                  <RiGlobalLine className="text-gray-400 mr-1.5" />
                  <a href={user.websiteUrl} target="_blank" rel="noopener noreferrer" 
                    className="font-medium text-[#67c6ff] hover:underline line-clamp-1 break-all">
                    {user.websiteUrl}
                  </a>
                </div>
              </div>
            )}

            {user.dob && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Date of Birth</p>
                <div className="flex items-center">
                  <RiCalendarLine className="text-gray-400 mr-1.5" />
                  <p className="font-medium text-gray-800">{user.dob}</p>
                </div>
              </div>
            )}

            {user.gender && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Gender</p>
                <div className="flex items-center">
                  <RiUser3Line className="text-gray-400 mr-1.5" />
                  <p className="font-medium text-gray-800">
                    {user.gender === "prefer_not_to_say" ? "Prefer not to say" : 
                      user.gender.charAt(0).toUpperCase() + user.gender.slice(1)}
                  </p>
                </div>
              </div>
            )}
            
            <div>
              <p className="text-xs text-gray-500 mb-1">Account Role</p>
              <div className="flex items-center">
                <RiShieldUserLine className="text-gray-400 mr-1.5" />
                <p className="font-medium text-gray-800">{user.role}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Account Status</p>
              <div className="flex items-center">
                <div className={`w-2 h-2 ${user.active ? 'bg-green-500' : 'bg-red-500'} rounded-full mr-2`}></div>
                <p className="font-medium text-gray-800">{user.active ? 'Active' : 'Inactive'}</p>
              </div>
            </div>
          </div>

          {user.bio && (
            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs text-gray-500 mb-1">Bio</p>
              <p className="text-sm text-gray-800 whitespace-pre-line">{user.bio}</p>
            </div>
          )}

          <div className="border-t border-gray-100 pt-6">
            <div className="flex justify-between text-sm">
              <div>
                <p className="text-xs text-gray-500 mb-1">Account Created</p>
                <p className="text-sm text-gray-800">{new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Last Login</p>
                <p className="text-sm text-gray-800">{new Date(user.lastLogin).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalInfo;
