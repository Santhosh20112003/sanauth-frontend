import React, { useEffect, useState } from 'react';
import {
  RiEdit2Line, RiCheckLine, RiCloseLine, RiCamera2Line,
  RiMailLine, RiShieldUserLine, RiMapPinLine, RiPhoneLine,
  RiGlobalLine, RiBriefcaseLine, RiCalendarLine, RiUser3Line,
  RiInformationLine, RiLoader4Line, RiMapPin2Line
} from 'react-icons/ri';
import { useUserAuth } from '../../context/UserAuthContext';
import request from '../../config/axios_config';
import toast from 'react-hot-toast';

// User interface
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

// Main component
const PersonalInfo: React.FC = () => {
  const { user, setUser } = useUserAuth();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<User>({ ...user });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // Update formData whenever user changes
  useEffect(() => {
    if (user) {
      setFormData({ ...user });
    }
  }, [user]);

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
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Get user's location using Geolocation API
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setIsLoadingLocation(true);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // Use reverse geocoding to get a human-readable address
          const { latitude, longitude } = position.coords;
          
          // Using a free reverse geocoding API
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            { headers: { 'Accept-Language': 'en' } }
          );
          
          if (!response.ok) {
            throw new Error('Failed to fetch location data');
          }
          
          const data = await response.json();
          
          // Format the location string based on available data
          let locationString = '';
          
          if (data.address) {
            const addr = data.address;
            
            // Create a location string with city/town and country
            if (addr.city || addr.town || addr.village) {
              locationString += addr.city || addr.town || addr.village;
            }
            
            if (addr.state || addr.state_district) {
              if (locationString) locationString += ', ';
              locationString += addr.state || addr.state_district;
            }
            
            if (addr.country) {
              if (locationString) locationString += ', ';
              locationString += addr.country;
            }
          } else {
            // Fallback to just coordinates if no address found
            locationString = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          }
          
          // Update the location in formData
          setFormData({
            ...formData,
            location: locationString
          });
          
          setSuccess('Location updated successfully!');
          setTimeout(() => setSuccess(null), 1000);
        } catch (error) {
          console.error('Error fetching location:', error);
          setError('Failed to get location. Please try again or enter manually.');
        } finally {
          setIsLoadingLocation(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        let errorMessage = 'Failed to get your location.';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please allow location access and try again.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
        }
        
        setError(errorMessage);
        setIsLoadingLocation(false);
      },
      { 
        enableHighAccuracy: true, 
        timeout: 10000, 
        maximumAge: 0 
      }
    );
  };

  // Save profile changes
  const saveProfileChanges = async () => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    
    try {
      await request.post('/api/users/update', {
        name: formData.name,
        email: formData.email,
        photoURL: formData.photoURL || null, 
        dob: formData.dob || null,
        gender: formData.gender || null,
        phone: formData.phone || null,
        location: formData.location || null,
        bio: formData.bio || null,
        websiteUrl: formData.websiteUrl || null,
        jobTitle: formData.jobTitle || null
      });
      
      setUser({
        ...user,
        ...formData
      });
      
      setSuccess('Profile updated successfully!');
      
      toast.success('Profile updated successfully!');

      setTimeout(() => {
        setSuccess(null);
        setEditMode(false);
      }, 2000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cancel profile changes
  const cancelProfileChanges = () => {
    setFormData({ ...user });
    setEditMode(false);
    setError(null);
  };

  // Get user initials
  const getUserInitials = (name: string): string => {
    const nameParts = name.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`.toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header with background */}
      <div className="bg-gradient-to-r from-[#20bfef]/10 to-[#5994ff]/10 p-3 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <RiUser3Line className="mr-2 text-[#20bfef]" />
            Personal Information
          </h2>
          
          {!editMode && (
            <button
              onClick={() => setEditMode(true)}
              className="text-[#20bfef] hover:bg-[#20bfef]/10 px-3 py-1.5 rounded-lg transition-colors duration-200 cursor-pointer font-medium text-sm flex items-center"
            >
              <RiEdit2Line className="mr-1.5" /> Edit Profile
            </button>
          )}
        </div>
      </div>
      
      {/* Alert messages */}
      {error && (
        <div className="mx-6 mt-4 bg-red-50 border border-red-100 text-red-600 p-3 rounded-lg text-sm flex items-start">
          <RiInformationLine className="mr-2 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      {success && (
        <div className="mx-6 mt-4 bg-green-50 border border-green-100 text-green-600 p-3 rounded-lg text-sm flex items-start">
          <RiCheckLine className="mr-2 mt-0.5 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {editMode ? (
          /* Edit Mode */
          <div className="space-y-8">
            {/* Profile photo edit */}
            <div className="flex justify-center">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md bg-gray-50">
                  {formData.photoURL ? (
                    <img src={formData.photoURL} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-[#20bfef]/30 to-[#5994ff]/30 text-3xl font-bold text-white">
                      {getUserInitials(formData.name)}
                    </div>
                  )}
                </div>
                <label htmlFor="profile-upload" className="absolute bottom-1 right-1 bg-white p-2.5 rounded-full border border-gray-200 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors duration-200">
                  <RiCamera2Line className="text-gray-600 text-lg" />
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
            
            {/* Form layout with sections */}
            <div className="grid grid-cols-1 gap-8">
              {/* Basic information */}
              <div className="space-y-5">
                <h3 className="text-md font-semibold text-gray-700 border-b border-gray-100 pb-2">Basic Information</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20bfef]/30 focus:border-[#20bfef]"
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
                      readOnly
                      className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">Email address cannot be changed</p>
                  </div>
                </div>
              </div>
              
              {/* Personal Details */}
              <div className="space-y-5">
                <h3 className="text-md font-semibold text-gray-700 border-b border-gray-100 pb-2">Personal Details</h3>
                
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio || ""}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Tell us about yourself"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20bfef]/30 focus:border-[#20bfef] resize-none"
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20bfef]/30 focus:border-[#20bfef]"
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
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20bfef]/30 focus:border-[#20bfef] appearance-none bg-no-repeat"
                      style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundPosition: "right 0.5rem center", backgroundSize: "1.5em 1.5em" }}
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer_not_to_say">Prefer not to say</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Contact and Professional Information */}
              <div className="space-y-5">
                <h3 className="text-md font-semibold text-gray-700 border-b border-gray-100 pb-2">Contact & Professional Information</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">
                      Job Title
                    </label>
                    <input
                      type="text"
                      id="jobTitle"
                      name="jobTitle"
                      value={formData.jobTitle || ""}
                      placeholder="e.g. Software Engineer"
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20bfef]/30 focus:border-[#20bfef]"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone || ""}
                      placeholder="e.g. +1234567890"
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20bfef]/30 focus:border-[#20bfef]"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1 flex items-center justify-between">
                      <span>Location</span>
                      <button 
                        type="button" 
                        onClick={getUserLocation} 
                        disabled={isLoadingLocation}
                        className="text-xs text-[#20bfef] hover:text-[#1ba9d5] flex items-center"
                      >
                        {isLoadingLocation ? (
                          <>
                            <RiLoader4Line className="animate-spin mr-1" />
                            Getting location...
                          </>
                        ) : (
                          <>
                            <RiMapPin2Line className="mr-1" />
                            Use my location
                          </>
                        )}
                      </button>
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location || ""}
                      placeholder={isLoadingLocation ? "Detecting your location..." : "e.g. New York, USA"}
                      onChange={handleInputChange}
                      disabled={isLoadingLocation}
                      className={`w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20bfef]/30 focus:border-[#20bfef] ${isLoadingLocation ? 'text-gray-400' : ''}`}
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
                      placeholder="e.g. https://example.com"
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20bfef]/30 focus:border-[#20bfef]"
                    />
                  </div>
                </div>
              </div>
              
              {/* Account Information - Read Only */}
              <div className="p-5 bg-gray-50 rounded-xl space-y-4">
                <h3 className="text-md font-semibold text-gray-700 flex items-center">
                  <RiShieldUserLine className="text-gray-500 mr-2" />
                  Account Information
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
                  <div>
                    <p className="text-gray-500">Account Role</p>
                    <p className="font-medium text-gray-700">{formData.role}</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-500">Account Status</p>
                    <div className="flex items-center">
                      <div className={`w-2 h-2 ${formData.active ? 'bg-green-500' : 'bg-red-500'} rounded-full mr-2`}></div>
                      <p className="font-medium text-gray-700">{formData.active ? 'Active' : 'Inactive'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-gray-500">Account Created</p>
                    <p className="font-medium text-gray-700">{new Date(formData.createdAt).toLocaleDateString()}</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-500">Last Login</p>
                    <p className="font-medium text-gray-700">{new Date(formData.lastLogin).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <p className="text-xs text-gray-500 mt-2">
                  Your account role and permissions can only be changed by an administrator.
                </p>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex justify-end space-x-3 pt-2 border-t border-gray-100">
              <button
                onClick={cancelProfileChanges}
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={saveProfileChanges}
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-[#20bfef] rounded-lg text-white font-medium text-sm hover:bg-[#5bbcff] transition-colors duration-200 flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <RiLoader4Line className="animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <RiCheckLine className="mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* View Mode */
          <div className="space-y-8">
            {/* Profile photo */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-[#20bfef]/30 to-[#5994ff]/30 text-3xl font-bold text-white">
                      {getUserInitials(user.name)}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* User information sections */}
            <div className="grid grid-cols-1 gap-6">
              {/* Basic info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Full Name</p>
                  <p className="font-semibold line-clamp-1 break-all text-gray-800 text-lg">{user.name}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Email Address</p>
                  <div className="flex items-center">
                    <RiMailLine className="text-[#20bfef] mr-2" />
                    <p className="font-medium line-clamp-1 break-all text-gray-800">{user.email}</p>
                  </div>
                </div>
              </div>
              
              {/* Personal and contact info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {user.jobTitle && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Job Title</p>
                    <div className="flex items-center">
                      <RiBriefcaseLine className="text-[#20bfef] mr-2" />
                      <p className="font-medium text-gray-800">{user.jobTitle}</p>
                    </div>
                  </div>
                )}

                {user.phone && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Phone Number</p>
                    <div className="flex items-center">
                      <RiPhoneLine className="text-[#20bfef] mr-2" />
                      <p className="font-medium text-gray-800">{user.phone}</p>
                    </div>
                  </div>
                )}

                {user.location && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Location</p>
                    <div className="flex items-center">
                      <RiMapPinLine className="text-[#20bfef] mr-2" />
                      <p className="font-medium text-gray-800">{user.location}</p>
                    </div>
                  </div>
                )}

                {user.websiteUrl && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Website</p>
                    <div className="flex items-center">
                      <RiGlobalLine className="text-[#20bfef] mr-2" />
                      <a href={user.websiteUrl} target="_blank" rel="noopener noreferrer"
                        className="font-medium text-[#20bfef] hover:underline line-clamp-1 break-all">
                        {user.websiteUrl}
                      </a>
                    </div>
                  </div>
                )}

                {user.dob && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Date of Birth</p>
                    <div className="flex items-center">
                      <RiCalendarLine className="text-[#20bfef] mr-2" />
                      <p className="font-medium text-gray-800">{user.dob}</p>
                    </div>
                  </div>
                )}

                {user.gender && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Gender</p>
                    <div className="flex items-center">
                      <RiUser3Line className="text-[#20bfef] mr-2" />
                      <p className="font-medium text-gray-800">
                        {user.gender === "prefer_not_to_say" ? "Prefer not to say" :
                          user.gender.charAt(0).toUpperCase() + user.gender.slice(1)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Bio section */}
              {user.bio && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 mb-2">Bio</p>
                  <p className="text-gray-800 line-clamp-3 break-all whitespace-pre-line">{user.bio}</p>
                </div>
              )}
              
              {/* Account information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-5 border border-gray-100 rounded-lg">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Account Role</p>
                  <div className="flex items-center">
                    <RiShieldUserLine className="text-[#20bfef] mr-2" />
                    <p className="font-medium text-gray-800">{user.role}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-xs text-gray-500 mb-1">Account Status</p>
                  <div className="flex items-center">
                    <div className={`w-2.5 h-2.5 ${user.active ? 'bg-green-500' : 'bg-red-500'} rounded-full mr-2`}></div>
                    <p className="font-medium text-gray-800">{user.active ? 'Active' : 'Inactive'}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-xs text-gray-500 mb-1">Account Created</p>
                  <p className="text-sm text-gray-800">{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
                
                <div>
                  <p className="text-xs text-gray-500 mb-1">Last Login</p>
                  <p className="text-sm text-gray-800">{new Date(user.lastLogin).toLocaleDateString()}</p>
                </div>
              </div>
              
              {/* Edit button (mobile) */}
              <div className="md:hidden flex justify-center mt-4">
                <button
                  onClick={() => setEditMode(true)}
                  className="w-full px-5 py-2.5 bg-[#20bfef]/10 rounded-lg text-[#20bfef] font-medium text-sm hover:bg-[#20bfef]/20 transition-colors duration-200 flex items-center justify-center"
                >
                  <RiEdit2Line className="mr-2" /> 
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalInfo;
