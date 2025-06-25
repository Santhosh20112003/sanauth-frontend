import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { navItems } from "../../common/NavItems";

function Sidebar() {
    const location = useLocation();
    const [isExpanded, setIsExpanded] = useState(true);
    const isActive = (path: string) => location.pathname === path;

    return (
        <div className={`transition-all duration-300 ${isExpanded ? 'w-64' : 'w-20'} bg-white h-[calc(100vh-64px)] flex flex-col shadow-lg`}>

            {/* Navigation */}
            <div className="flex-grow py-4 px-3 overflow-y-auto">
                <nav>
                    <ul className="space-y-1.5">
                        {navItems.map((item) => (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${isActive(item.path)
                                        ? 'bg-[#38b6ff]/10 text-[#38b6ff] font-medium'
                                        : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    <div className={`flex items-center justify-center w-8 h-8 ${isActive(item.path) ? '' : 'opacity-80'}`}>
                                        {React.createElement(item.icon, { className: "size-5" })}
                                    </div>
                                    {isExpanded && (
                                        <span className="ml-2 truncate text-sm">
                                            {item.name}
                                        </span>
                                    )}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

            {/* Expand/Collapse Button */}
            <div className="p-3 border-t border-gray-100">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center justify-center w-full p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all"
                >
                    {isExpanded ? (
                        <>
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                            </svg>
                        </>
                    ) : (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                        </svg>
                    )}
                </button>
            </div>
        </div>
    );
}

export default Sidebar;