import React from 'react';
import {
    RiArrowRightSLine, RiCheckLine, RiCodeSSlashLine, RiSettings4Line, RiUserAddLine, RiShieldCheckLine, RiApps2Line,
    RiFileList3Line, RiLightbulbFlashLine,
    RiBookmarkLine
} from 'react-icons/ri';

const GettingStarted: React.FC = () => {
    // Quick start steps
    const quickStartSteps = [
        {
            title: "Create an Application",
            icon: RiApps2Line,
            description: "Register your application in the dashboard to get your client ID and secret.",
            cta: "Create App",
            link: "/dashboard/apps/create",
            status: "completed"
        },
        {
            title: "Configure Authentication",
            icon: RiSettings4Line,
            description: "Set up OAuth providers, redirect URLs, and security settings.",
            cta: "Configure",
            link: "/dashboard/settings",
            status: "active"
        },
        {
            title: "Integrate SDK",
            icon: RiCodeSSlashLine,
            description: "Add the SanAuth SDK to your application and configure the authentication flow.",
            cta: "View Docs",
            link: "/documentation",
            status: "pending"
        },
        {
            title: "Manage Users",
            icon: RiUserAddLine,
            description: "Invite users, set up roles, and define access permissions.",
            cta: "Manage Users",
            link: "/dashboard/users",
            status: "pending"
        }
    ];

    // Quick reference links
    const quickReferenceLinks = [
        { title: "API Documentation", icon: RiFileList3Line, link: "/documentation/api" },
        { title: "SDK References", icon: RiCodeSSlashLine, link: "/documentation/sdk" },
        { title: "Implementation Guides", icon: RiBookmarkLine, link: "/documentation/guides" },
        { title: "Security Best Practices", icon: RiShieldCheckLine, link: "/documentation/security" }
    ];

    // Recent updates
    const recentUpdates = [
        {
            title: "New OAuth Provider Support",
            description: "Added support for LinkedIn and Apple authentication",
            date: "Oct 28, 2023",
            badge: "New"
        },
        {
            title: "Enhanced Security Features",
            description: "Improved MFA options with biometric authentication",
            date: "Oct 15, 2023",
            badge: "Security"
        },
        {
            title: "Performance Improvements",
            description: "30% faster authentication processing",
            date: "Oct 5, 2023",
            badge: "Improvement"
        }
    ];

    

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Getting Started</h1>
                <p className="text-gray-600">Complete these steps to set up authentication for your application</p>
            </div>

            {/* Quick Reference Section - NEW COMPONENT */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold text-gray-800">Quick Reference</h2>
                    <a href="/documentation" className="text-sm text-[#67c6ff] hover:underline flex items-center">
                        View all docs <RiArrowRightSLine className="ml-1" />
                    </a>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {quickReferenceLinks.map((item, index) => (
                        <a
                            key={index}
                            href={item.link}
                            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-[#67c6ff] hover:shadow-sm hover:bg-[#67c6ff]/5 transition-all"
                        >
                            <div className="p-2.5 rounded-md bg-[#67c6ff]/10 mr-4">
                                <item.icon className="h-5 w-5 text-[#67c6ff]" />
                            </div>
                            <p className="font-medium text-sm text-gray-700">{item.title}</p>
                        </a>
                    ))}
                </div>
            </div>

            {/* Progress Overview */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">Setup Progress</h2>
                        <p className="text-sm text-gray-500">25% Complete</p>
                    </div>
                    <div className="w-40 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-[#67c6ff]" style={{ width: "25%" }}></div>
                    </div>
                </div>

                {/* Quick start steps */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {quickStartSteps.map((step, index) => (
                        <div
                            key={index}
                            className={`border rounded-lg p-4 ${step.status === 'completed'
                                ? 'bg-green-50 border-green-200'
                                : step.status === 'active'
                                    ? 'bg-blue-50 border-blue-200'
                                    : 'bg-gray-50 border-gray-200'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-2 rounded-lg ${step.status === 'completed'
                                    ? 'bg-green-100'
                                    : step.status === 'active'
                                        ? 'bg-blue-100'
                                        : 'bg-gray-200'
                                    }`}>
                                    <step.icon className={`h-5 w-5 ${step.status === 'completed'
                                        ? 'text-green-600'
                                        : step.status === 'active'
                                            ? 'text-blue-600'
                                            : 'text-gray-600'
                                        }`} />
                                </div>
                                {step.status === 'completed' && (
                                    <span className="bg-green-500 text-white p-1 rounded-full">
                                        <RiCheckLine className="h-3 w-3" />
                                    </span>
                                )}
                            </div>
                            <h3 className="font-medium mb-1">{step.title}</h3>
                            <p className="text-sm text-gray-600 mb-4">{step.description}</p>
                            <a
                                href={step.link}
                                className={`flex items-center text-sm font-medium ${step.status === 'completed'
                                    ? 'text-green-600'
                                    : step.status === 'active'
                                        ? 'text-blue-600'
                                        : 'text-gray-600'
                                    }`}
                            >
                                {step.cta} <RiArrowRightSLine className="ml-1" />
                            </a>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Updates Section - NEW COMPONENT */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold text-gray-800">Recent Updates</h2>
                    <a href="/changelog" className="text-sm text-[#67c6ff] hover:underline flex items-center">
                        View all <RiArrowRightSLine className="ml-1" />
                    </a>
                </div>
                <div className="space-y-4">
                    {recentUpdates.map((update, index) => (
                        <div key={index} className="flex items-start p-4 border border-gray-100 rounded-lg bg-gray-50/50">
                            <div className="bg-[#67c6ff]/10 p-2 rounded-full mr-4">
                                <RiLightbulbFlashLine className="h-6 w-6 text-[#67c6ff]" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                    <div className="flex items-center">
                                        <h3 className="font-medium text-gray-800">{update.title}</h3>
                                        <span className={`ml-2 text-xs font-medium px-2 py-0.5 rounded-full ${update.badge === 'New' ? 'bg-green-100 text-green-700' :
                                                update.badge === 'Security' ? 'bg-red-100 text-red-700' :
                                                    'bg-blue-100 text-blue-700'
                                            }`}>{update.badge}</span>
                                    </div>
                                    <span className="text-xs text-gray-500">{update.date}</span>
                                </div>
                                <p className="text-sm text-gray-600">{update.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Help & Support */}
            <div className="bg-gradient-to-r from-[#67c6ff] to-blue-500 rounded-xl p-6 shadow-sm text-white">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <h3 className="text-lg font-semibold mb-2">Need help getting started?</h3>
                        <p className="text-blue-100">Our support team is ready to assist you with any questions.</p>
                    </div>
                    <div>
                        <button className="bg-white text-blue-600 px-4 py-2 rounded-lg shadow-sm hover:bg-blue-50 transition-colors text-sm font-medium">
                            Contact Support
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GettingStarted;
