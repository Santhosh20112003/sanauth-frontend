import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
    return (
        <footer className="bg-gray-800 text-white">
            {/* Main Footer Content */}
            <div className="pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-6 gap-8">
                        {/* Company Info */}
                        <div className="lg:col-span-2">
                            <div className="flex items-center space-x-2 mb-6">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                                    <img
                                        src="https://ik.imagekit.io/vituepzjm/SanAuth/SanAuth.svg?updatedAt=1749400779754"
                                        alt="SANAUTH"
                                        className="size-8"
                                    />
                                </div>
                                <span className="text-3xl font-bold">SanAuth</span>
                            </div>
                            <p className="text-gray-400 mb-6 text-lg leading-relaxed">
                                Enterprise authentication infrastructure that developers love and security teams trust.
                                Secure millions of users with confidence.
                            </p>

                            {/* Social Links */}
                            <div className="flex space-x-4 mb-6">
                                {[{
                                    name: 'twitter',
                                    icon: '𝕏',
                                    href: '#'
                                }, {
                                    name: 'github',
                                    icon: '✉️',
                                    href: '#'
                                }, {
                                    name: 'discord',
                                    icon: '💬',
                                    href: '#'
                                }].map(social => (
                                    <a
                                        key={social.name}
                                        href={social.href}
                                        className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-gray-700 hover:scale-110 transition-all duration-200 group"
                                        aria-label={social.name}
                                    >
                                        <span className="text-lg group-hover:text-[#00b5df] transition-colors">{social.icon}</span>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Products */}
                        <div>
                            <h3 className="font-bold text-lg mb-6 text-white">Products</h3>
                            <ul className="space-y-4 text-gray-400">
                                {[
                                    'Authentication APIs',
                                    'User Management',
                                    'Multi-Factor Auth',
                                   
                                ].map(link => (
                                    <li key={link}>
                                        <Link to="#" className="hover:text-[#00b5df] transition-colors hover:translate-x-1 transform duration-200 inline-block">
                                            {link}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Solutions */}
                        <div>
                            <h3 className="font-bold text-lg mb-6 text-white">Solutions</h3>
                            <ul className="space-y-4 text-gray-400">
                                {[
                                    'For Developers',
                                    'For Startups',
                                    'For Enterprise'
                                ].map(link => (
                                    <li key={link}>
                                        <Link to="#" className="hover:text-[#00b5df] transition-colors hover:translate-x-1 transform duration-200 inline-block">
                                            {link}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Resources */}
                        <div>
                            <h3 className="font-bold text-lg mb-6 text-white">Resources</h3>
                            <ul className="space-y-4 text-gray-400">
                                {[
                                    'Documentation',
                                    'API Reference',
                                    'Migration Guide'
                                ].map(link => (
                                    <li key={link}>
                                        <Link to="#" className="hover:text-[#00b5df] transition-colors hover:translate-x-1 transform duration-200 inline-block">
                                            {link}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Company */}
                        <div>
                            <h3 className="font-bold text-lg mb-6 text-white">Company</h3>
                            <ul className="space-y-4 text-gray-400">
                                {[
                                    'About Us',
                                    'Careers',
                                    'Press Kit'
                                ].map(link => (
                                    <li key={link}>
                                        <Link to="#" className="hover:text-[#00b5df] transition-colors hover:translate-x-1 transform duration-200 inline-block">
                                            {link}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Section */}
                    <div className="border-t border-gray-800 pt-8 flex flex-col lg:flex-row justify-between items-center">
                        <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-8">
                            <p className="text-gray-400">© 2024 SanAuth. All rights reserved.</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-400">
                                <span className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-[#00b5df] rounded-full animate-pulse"></div>
                                    <span>All systems operational</span>
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-wrap justify-center lg:justify-end items-center gap-6 mt-4 lg:mt-0 text-sm text-gray-400">
                            {[
                                'Privacy Policy',
                                'Terms of Service',
                                'Security'
                            ].map(link => (
                                <Link key={link} to="#" className="hover:text-[#00b5df] transition-colors">
                                    {link}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer