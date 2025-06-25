import React, { useState } from 'react';
import {
    RiBuilding4Line, RiTeamLine, RiSettings3Line,
    RiAddLine, RiEdit2Line, RiDeleteBin6Line, RiCloseLine,
    RiMailLine, RiPhoneLine, RiGlobalLine, RiMapPinLine, RiUpload2Line,
    RiCornerDownRightFill
} from 'react-icons/ri';

// Define TypeScript interfaces for better type safety
interface Subscription {
    plan: string;
    status: string;
    nextBilling: string;
    amount: string;
}

interface ApiUsage {
    used: number;
    limit: number;
    percentage: number;
}

interface OrganizationData {
    id: string;
    name: string;
    logo: string | null;
    industry: string;
    size: string;
    description: string;
    website: string;
    email: string;
    phone: string;
    address: string;
    subscription: Subscription;
    apiUsage: ApiUsage;
}

interface TeamMember {
    id: number;
    name: string;
    email: string;
    role: string;
    avatar: string | null;
}

interface InvitationData {
    email: string;
    role: string;
}

interface Invoice {
    id: string;
    date: string;
    amount: string;
    status: string;
}

function Organization() {
    // Organization data state
    const [organization, setOrganization] = useState<OrganizationData>({
        id: "org-123456",
        name: "Acme Corporation",
        logo: null,
        industry: "Technology",
        size: "50-200 employees",
        description: "Leading provider of authentication and security solutions for enterprises.",
        website: "https://acmecorp.example.com",
        email: "info@acmecorp.example.com",
        phone: "+1 (555) 123-4567",
        address: "123 Tech Street, San Francisco, CA 94107, USA",
        subscription: {
            plan: "Enterprise",
            status: "Active",
            nextBilling: "2023-12-01",
            amount: "$499.00"
        },
        apiUsage: {
            used: 785420,
            limit: 1000000,
            percentage: 78
        }
    });

    // Team members state
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>(
        [
            { id: 1, name: "John Doe", email: "john@acmecorp.example.com", role: "Owner", avatar: null },
            { id: 2, name: "Jane Smith", email: "jane@acmecorp.example.com", role: "Admin", avatar: null },
            { id: 3, name: "Robert Johnson", email: "robert@acmecorp.example.com", role: "Member", avatar: null }
        ]
    );

    // Billing history data
    const billingHistory: Invoice[] = [
        { id: 'INV-001', date: '2023-11-01', amount: '$499.00', status: 'Paid' },
        { id: 'INV-002', date: '2023-10-01', amount: '$499.00', status: 'Paid' },
        { id: 'INV-003', date: '2023-09-01', amount: '$499.00', status: 'Paid' }
    ];

    // UI state
    const [activeSection, setActiveSection] = useState<string>('overview');
    const [showInvitation, setShowInvitation] = useState<boolean>(false);
    const [invitation, setInvitation] = useState<InvitationData>({ email: '', role: 'Member' });

    // Event handlers
    const handleInviteSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Inviting user:", invitation);
        setShowInvitation(false);
        setInvitation({ email: '', role: 'Member' });
    };

    const handleOrganizationUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Updating organization:", organization);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Organization Settings</h1>
                <p className="text-gray-600">Manage your organization's profile, team members, and subscription</p>
            </div>

            {/* Main Content */}
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar Navigation */}
                <div className="lg:w-64 flex-shrink-0">
                    <div className="bg-white rounded-xl shadow-sm p-4 sticky top-6 border border-gray-100">
                        <div className="flex flex-col space-y-1">
                            <button
                                onClick={() => setActiveSection('overview')}
                                className={`flex items-center p-3 rounded-lg ${activeSection === 'overview' ? 'bg-[#67c6ff]/10 text-[#67c6ff]' : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                <RiBuilding4Line className="mr-3 text-lg" />
                                <span className="font-medium">Overview</span>
                            </button>

                            <button
                                onClick={() => setActiveSection('team')}
                                className={`flex items-center p-3 rounded-lg ${activeSection === 'team' ? 'bg-[#67c6ff]/10 text-[#67c6ff]' : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                <RiTeamLine className="mr-3 text-lg" />
                                <span className="font-medium">Team Members</span>
                            </button>

                            <button
                                onClick={() => setActiveSection('settings')}
                                className={`flex items-center p-3 rounded-lg ${activeSection === 'settings' ? 'bg-[#67c6ff]/10 text-[#67c6ff]' : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                <RiSettings3Line className="mr-3 text-lg" />
                                <span className="font-medium">Settings</span>
                            </button>

                            <button
                                onClick={() => setActiveSection('billing')}
                                className={`flex items-center p-3 rounded-lg ${activeSection === 'billing' ? 'bg-[#67c6ff]/10 text-[#67c6ff]' : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                <RiCornerDownRightFill className="mr-3 text-lg" />
                                <span className="font-medium">Billing</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1">
                    {/* Overview Section */}
                    {activeSection === 'overview' && (
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                                <h2 className="text-lg font-semibold text-gray-800">Organization Overview</h2>
                                <button
                                    onClick={() => setActiveSection('settings')}
                                    className="mt-2 md:mt-0 text-sm text-[#67c6ff] hover:text-[#57b6ff] flex items-center"
                                >
                                    <RiEdit2Line className="mr-1" />
                                    Edit Organization
                                </button>
                            </div>

                            <div className="flex flex-col md:flex-row gap-6">
                                {/* Organization Logo and Basic Info */}
                                <div className="md:w-1/3">
                                    <div className="bg-gray-50 p-6 rounded-lg flex flex-col items-center">
                                        <div className="w-32 h-32 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 overflow-hidden border border-gray-200">
                                            {organization.logo ? (
                                                <img src={organization.logo} alt="Organization logo" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-4xl font-bold text-[#67c6ff]">{organization.name.charAt(0)}</span>
                                            )}
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-800">{organization.name}</h3>
                                        <p className="text-sm text-gray-500">{organization.industry}</p>
                                        <span className="mt-2 px-3 py-1 bg-[#67c6ff]/10 text-[#67c6ff] text-xs rounded-full">
                                            {organization.subscription.plan} Plan
                                        </span>
                                    </div>
                                </div>

                                {/* Organization Details */}
                                <div className="md:w-2/3">
                                    <div className="bg-gray-50 p-6 rounded-lg">
                                        <h4 className="font-medium text-gray-800 mb-4">Organization Details</h4>
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-sm text-gray-500">Description</p>
                                                <p className="text-sm font-medium">{organization.description}</p>
                                            </div>

                                            <div className="flex flex-col sm:flex-row gap-4">
                                                <div className="sm:w-1/2">
                                                    <p className="text-sm text-gray-500">Organization ID</p>
                                                    <p className="text-sm font-medium">{organization.id}</p>
                                                </div>
                                                <div className="sm:w-1/2">
                                                    <p className="text-sm text-gray-500">Size</p>
                                                    <p className="text-sm font-medium">{organization.size}</p>
                                                </div>
                                            </div>

                                            <div className="pt-4 border-t border-gray-200">
                                                <h4 className="font-medium text-gray-800 mb-4">Contact Information</h4>
                                                <div className="space-y-3">
                                                    <div className="flex items-start">
                                                        <RiMailLine className="text-gray-400 mt-0.5 mr-2" />
                                                        <div>
                                                            <p className="text-sm text-gray-500">Email</p>
                                                            <p className="text-sm font-medium">{organization.email}</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-start">
                                                        <RiPhoneLine className="text-gray-400 mt-0.5 mr-2" />
                                                        <div>
                                                            <p className="text-sm text-gray-500">Phone</p>
                                                            <p className="text-sm font-medium">{organization.phone}</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-start">
                                                        <RiGlobalLine className="text-gray-400 mt-0.5 mr-2" />
                                                        <div>
                                                            <p className="text-sm text-gray-500">Website</p>
                                                            <a href={organization.website} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-[#67c6ff] hover:underline">
                                                                {organization.website}
                                                            </a>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-start">
                                                        <RiMapPinLine className="text-gray-400 mt-0.5 mr-2" />
                                                        <div>
                                                            <p className="text-sm text-gray-500">Address</p>
                                                            <p className="text-sm font-medium">{organization.address}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* API Usage */}
                            <div className="mt-6 bg-gray-50 p-6 rounded-lg">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-medium text-gray-800">API Usage</h4>
                                    <span className="text-sm text-gray-500">
                                        {organization.apiUsage.used.toLocaleString()} of {organization.apiUsage.limit.toLocaleString()} calls
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div
                                        className="bg-[#67c6ff] h-2.5 rounded-full"
                                        style={{ width: `${organization.apiUsage.percentage}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between mt-2">
                                    <span className="text-xs text-gray-500">0</span>
                                    <span className="text-xs text-gray-500">{organization.apiUsage.limit.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Team Members Section */}
                    {activeSection === 'team' && (
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                                <h2 className="text-lg font-semibold text-gray-800">Team Members</h2>
                                <button
                                    onClick={() => setShowInvitation(true)}
                                    className="mt-3 md:mt-0 px-4 py-2 bg-[#67c6ff] text-white rounded-lg flex items-center gap-2 hover:bg-[#57b6ff] text-sm"
                                >
                                    <RiAddLine /> Invite Team Member
                                </button>
                            </div>

                            {/* Team Members List */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Member
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Role
                                            </th>
                                            <th scope="col" className="relative px-6 py-3">
                                                <span className="sr-only">Actions</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {teamMembers.map((member) => (
                                            <tr key={member.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            {member.avatar ? (
                                                                <img className="h-10 w-10 rounded-full" src={member.avatar} alt="" />
                                                            ) : (
                                                                <div className="h-10 w-10 rounded-full bg-[#67c6ff]/10 flex items-center justify-center">
                                                                    <span className="text-sm font-medium text-[#67c6ff]">{member.name.charAt(0)}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">{member.name}</div>
                                                            <div className="text-sm text-gray-500">{member.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                                                    ${member.role === 'Owner' ? 'bg-purple-100 text-purple-800' :
                                                            member.role === 'Admin' ? 'bg-blue-100 text-blue-800' :
                                                            'bg-gray-100 text-gray-800'}`}>
                                                        {member.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-end gap-2">
                                                        {member.role !== 'Owner' && (
                                                            <>
                                                                <button className="text-[#67c6ff] hover:text-[#57b6ff]">
                                                                    <RiEdit2Line className="h-5 w-5" />
                                                                </button>
                                                                <button className="text-red-500 hover:text-red-600">
                                                                    <RiDeleteBin6Line className="h-5 w-5" />
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Invitation Form Modal */}
                            {showInvitation && (
                                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-lg font-semibold text-gray-800">Invite Team Member</h3>
                                            <button onClick={() => setShowInvitation(false)} className="text-gray-500 hover:text-gray-700">
                                                <RiCloseLine className="h-6 w-6" />
                                            </button>
                                        </div>

                                        <form onSubmit={handleInviteSubmit} className="space-y-4">
                                            <div>
                                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Email Address
                                                </label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#67c6ff]/30 focus:border-[#67c6ff]"
                                                    placeholder="Enter email address"
                                                    value={invitation.email}
                                                    onChange={(e) => setInvitation({ ...invitation, email: e.target.value })}
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Role
                                                </label>
                                                <select
                                                    id="role"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#67c6ff]/30 focus:border-[#67c6ff]"
                                                    value={invitation.role}
                                                    onChange={(e) => setInvitation({ ...invitation, role: e.target.value })}
                                                >
                                                    <option value="Admin">Admin</option>
                                                    <option value="Member">Member</option>
                                                </select>
                                            </div>

                                            <div className="flex justify-end gap-3 pt-4">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowInvitation(false)}
                                                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="px-4 py-2 bg-[#67c6ff] text-white rounded-md shadow-sm text-sm font-medium hover:bg-[#57b6ff]"
                                                >
                                                    Send Invitation
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Settings Section */}
                    {activeSection === 'settings' && (
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div className="mb-6">
                                <h2 className="text-lg font-semibold text-gray-800">Organization Settings</h2>
                                <p className="text-sm text-gray-500">Update your organization's profile information</p>
                            </div>

                            <form onSubmit={handleOrganizationUpdate}>
                                {/* Form content structure kept but condensed */}
                                <div className="space-y-6">
                                    {/* Organization Logo */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Organization Logo</label>
                                        <div className="flex items-center">
                                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mr-4 overflow-hidden border border-gray-200">
                                                {organization.logo ? (
                                                    <img src={organization.logo} alt="Organization logo" className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-xl font-bold text-[#67c6ff]">{organization.name.charAt(0)}</span>
                                                )}
                                            </div>
                                            <div>
                                                <button
                                                    type="button"
                                                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 flex items-center"
                                                >
                                                    <RiUpload2Line className="mr-2" /> Upload New Logo
                                                </button>
                                                <p className="mt-1 text-xs text-gray-500">PNG or JPG, 1MB max</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Basic Information */}
                                    <div className="pt-6 border-t border-gray-200">
                                        <h3 className="text-base font-medium text-gray-800 mb-4">Basic Information</h3>
                                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                                            <div>
                                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Organization Name
                                                </label>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#67c6ff]/30 focus:border-[#67c6ff]"
                                                    value={organization.name}
                                                    onChange={(e) => setOrganization({ ...organization, name: e.target.value })}
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Industry
                                                </label>
                                                <select
                                                    id="industry"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#67c6ff]/30 focus:border-[#67c6ff]"
                                                    value={organization.industry}
                                                    onChange={(e) => setOrganization({ ...organization, industry: e.target.value })}
                                                >
                                                    <option>Technology</option>
                                                    <option>Healthcare</option>
                                                    <option>Finance</option>
                                                    <option>Education</option>
                                                    <option>Other</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Company Size
                                                </label>
                                                <select
                                                    id="size"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#67c6ff]/30 focus:border-[#67c6ff]"
                                                    value={organization.size}
                                                    onChange={(e) => setOrganization({ ...organization, size: e.target.value })}
                                                >
                                                    <option>1-10 employees</option>
                                                    <option>11-50 employees</option>
                                                    <option>50-200 employees</option>
                                                    <option>201-500 employees</option>
                                                    <option>501+ employees</option>
                                                </select>
                                            </div>

                                            <div className="sm:col-span-2">
                                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Description
                                                </label>
                                                <textarea
                                                    id="description"
                                                    rows={3}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#67c6ff]/30 focus:border-[#67c6ff]"
                                                    value={organization.description}
                                                    onChange={(e) => setOrganization({ ...organization, description: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Contact Information */}
                                    <div className="pt-6 border-t border-gray-200">
                                        <h3 className="text-base font-medium text-gray-800 mb-4">Contact Information</h3>
                                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                                            <div>
                                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Email
                                                </label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#67c6ff]/30 focus:border-[#67c6ff]"
                                                    value={organization.email}
                                                    onChange={(e) => setOrganization({ ...organization, email: e.target.value })}
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Phone Number
                                                </label>
                                                <input
                                                    type="tel"
                                                    id="phone"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#67c6ff]/30 focus:border-[#67c6ff]"
                                                    value={organization.phone}
                                                    onChange={(e) => setOrganization({ ...organization, phone: e.target.value })}
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Website
                                                </label>
                                                <input
                                                    type="url"
                                                    id="website"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#67c6ff]/30 focus:border-[#67c6ff]"
                                                    value={organization.website}
                                                    onChange={(e) => setOrganization({ ...organization, website: e.target.value })}
                                                />
                                            </div>

                                            <div className="sm:col-span-2">
                                                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Address
                                                </label>
                                                <input
                                                    type="text"
                                                    id="address"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#67c6ff]/30 focus:border-[#67c6ff]"
                                                    value={organization.address}
                                                    onChange={(e) => setOrganization({ ...organization, address: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Save Button */}
                                <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
                                    <button
                                        type="submit"
                                        className="px-6 py-2.5 bg-[#67c6ff] text-white rounded-md shadow-sm text-sm font-medium hover:bg-[#57b6ff]"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Billing Section */}
                    {activeSection === 'billing' && (
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div className="mb-6">
                                <h2 className="text-lg font-semibold text-gray-800">Billing & Subscription</h2>
                                <p className="text-sm text-gray-500">Manage your subscription plan and billing details</p>
                            </div>

                            {/* Current Plan */}
                            <div className="bg-gray-50 p-6 rounded-lg mb-6">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                    <div>
                                        <h3 className="text-base font-medium text-gray-800">Current Plan</h3>
                                        <div className="flex items-center mt-2">
                                            <span className="text-2xl font-bold text-gray-800">{organization.subscription.plan}</span>
                                            <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                {organization.subscription.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Your next billing date is {new Date(organization.subscription.nextBilling).toLocaleDateString()}.
                                        </p>
                                    </div>

                                    <div className="mt-4 md:mt-0">
                                        <span className="text-2xl font-bold text-gray-800">{organization.subscription.amount}</span>
                                        <span className="text-sm text-gray-500">/month</span>
                                        <div className="mt-2">
                                            <button className="text-sm text-[#67c6ff] hover:text-[#57b6ff] font-medium">
                                                Change Plan
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Billing History simplified */}
                            <div>
                                <h3 className="text-base font-medium text-gray-800 mb-4">Billing History</h3>
                                <div className="border border-gray-200 rounded-lg overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Date
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Invoice
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Amount
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Status
                                                    </th>
                                                    <th scope="col" className="relative px-6 py-3">
                                                        <span className="sr-only">Download</span>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {billingHistory.map((invoice, index) => (
                                                    <tr key={index}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {new Date(invoice.date).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                                            {invoice.id}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                                            {invoice.amount}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                                {invoice.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <button className="text-[#67c6ff] hover:text-[#57b6ff]">Download</button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Organization;