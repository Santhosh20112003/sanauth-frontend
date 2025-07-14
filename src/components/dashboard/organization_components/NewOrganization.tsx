import React, { useState } from 'react';
import {
    RiBuilding4Line, RiLoader4Line, RiUploadCloud2Line,
    RiInformationLine, RiCheckLine
} from 'react-icons/ri';
import { useUserAuth } from '../../context/UserAuthContext';
import request from '../../config/axios_config';
import toast from 'react-hot-toast';
import { CLOUD_NAME, UPLOAD_PRESET } from '../../../common/Cloudinary';
import { useNavigate } from 'react-router-dom';

// Simple Organization Form interface
interface OrganizationForm {
    name: string;
    description: string;
    photoURL: string;
}

const NewOrganization: React.FC = () => {
    const { user } = useUserAuth();
    const [formData, setFormData] = useState<OrganizationForm>({
        name: '',
        description: '',
        photoURL: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const navigate = useNavigate();

    // Handle form input change
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Handle logo upload
    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Basic validation
        if (!['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'].includes(file.type)) {
            setError('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            setError('Image size should be less than 5MB');
            return;
        }

        setIsUploadingImage(true);
        setUploadProgress(0);
        setError(null);

        try {
            // Upload data preparation
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', CLOUD_NAME); // Make sure this preset is configured in Cloudinary dashboard
            formData.append('cloud_name', UPLOAD_PRESET);

            // Simple progress simulation
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => Math.min(prev + 10, 90));
            }, 300);

            // Upload to Cloudinary
            const response = await fetch(`https://api.cloudinary.com/v1_1/dwrujwvkg/image/upload`, {
                method: 'POST',
                body: formData
            });

            clearInterval(progressInterval);

            if (!response.ok) {
                throw new Error('Failed to upload image');
            }

            const data = await response.json();
            setUploadProgress(100);

            // Update form with the image URL
            setFormData(prev => ({
                ...prev,
                photoURL: data.secure_url
            }));

            toast.success('Logo uploaded successfully');
        } catch (error) {
            console.error('Error uploading logo:', error);
            setError('Failed to upload logo. Please try again.');

            // Reset file input
            const fileInput = document.getElementById('logo-upload') as HTMLInputElement;
            if (fileInput) fileInput.value = '';
        } finally {
            setTimeout(() => {
                setIsUploadingImage(false);
                setUploadProgress(0);
            }, 1000);
        }
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name) {
            setError('Organization name is required');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            await request.post('/api/org/create', {
                ...formData,
                adminUser: user.email
            });

            toast.success('Organization created successfully!');
            setSuccess('Organization created successfully!');

            setFormData({ name: '', description: '', photoURL: '' });

            setTimeout(() => setSuccess(null), 3000);
            
            navigate('/dashboard/organization');
            
        } catch (error) {
            console.error('Error creating organization:', error);
            setError('Failed to create organization. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#20bfef]/10 to-[#5994ff]/10 p-3 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                    <RiBuilding4Line className="mr-2 text-[#20bfef]" />
                    Create New Organization
                </h2>
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

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-8">
                    {/* Logo Upload */}
                    <div className="flex justify-center">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-lg overflow-hidden border-4 border-white shadow-md bg-gray-50 flex items-center justify-center">
                                {formData.photoURL ? (
                                    <img src={formData.photoURL} alt="Organization Logo" className="w-full h-full object-contain" />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-r from-[#20bfef]/10 to-[#5994ff]/10 text-gray-400">
                                        <RiBuilding4Line className="text-4xl mb-2" />
                                        <span className="text-xs text-center px-2">Upload Logo</span>
                                    </div>
                                )}

                                {isUploadingImage && (
                                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
                                        <RiUploadCloud2Line className="text-white text-2xl mb-2" />
                                        <div className="w-16 h-1 bg-gray-300 rounded-full">
                                            <div
                                                className="h-full bg-white rounded-full transition-all duration-300"
                                                style={{ width: `${uploadProgress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <label htmlFor="logo-upload" className={`absolute bottom-1 right-1 bg-white p-2.5 rounded-full border border-gray-200 shadow-sm ${isUploadingImage ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50 transition-colors duration-200'}`}>
                                <RiUploadCloud2Line className="text-gray-600 text-lg" />
                                <input
                                    id="logo-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleLogoUpload}
                                    disabled={isUploadingImage}
                                />
                            </label>
                        </div>
                    </div>

                    {/* Organization Information */}
                    <div className="space-y-5">
                        <h3 className="text-md font-semibold text-gray-700 border-b border-gray-100 pb-2">
                            Organization Information
                        </h3>

                        <div className="grid grid-cols-1 gap-5">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Organization Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20bfef]/30 focus:border-[#20bfef]"
                                    placeholder="Enter your organization's name"
                                />
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={4}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20bfef]/30 focus:border-[#20bfef] resize-none"
                                    placeholder="Tell us about your organization"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-5 border-t border-gray-100">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full sm:w-auto px-6 py-2.5 bg-[#20bfef] rounded-lg text-white font-medium text-sm hover:bg-[#5bbcff] transition-colors duration-200 flex items-center justify-center"
                        >
                            {isSubmitting ? (
                                <>
                                    <RiLoader4Line className="animate-spin mr-2" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <RiBuilding4Line className="mr-2" />
                                    Create Organization
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default NewOrganization;