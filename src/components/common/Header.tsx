import { Link } from "react-router-dom"
import { useState, useEffect } from "react"

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navigationItems = [
        { name: 'Features', href: '#features', icon: '⚡' },
        { name: 'Pricing', href: '#pricing', icon: '💰' },
        { name: 'Documentation', href: '#docs', icon: '📚' }
    ];

    return (
        <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-sky-100'
            : 'bg-white/80 backdrop-blur-sm shadow-sm'
            }`}>
            {/* Quick Access Banner */}
            <div className={`bg-gradient-to-r from-sky-500 to-cyan-500 text-white transition-all duration-300 ${isScrolled ? 'h-0 overflow-hidden' : 'h-auto'
                }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
                    <div className="flex items-center justify-center space-x-4 text-sm">
                        <span className="flex items-center space-x-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>🎉 NEW: Advanced threat detection now available</span>
                        </span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    {/* Logo */}
                    <div className="flex items-center space-x-2">
                        <div className="size-10 bg-white rounded-xl flex items-center justify-center">
                            <img
                                src="https://ik.imagekit.io/vituepzjm/SanAuth/SanAuth.svg?updatedAt=1749400779754"
                                alt="SANAUTH"
                                className="size-9"
                            />
                        </div>
                        <Link to="/" className="group">
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent group-hover:from-sky-700 group-hover:to-cyan-700 transition-all duration-200">
                                SanAuth
                            </h1>
                        </Link>
                        <div className="hidden sm:block">
                            <span className="px-2 py-1 bg-gradient-to-r from-sky-100 to-cyan-100 text-sky-700 text-xs font-medium rounded-full">
                                v2.0
                            </span>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:block">
                        <ul className="flex items-center space-x-1">
                            {navigationItems.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        to={item.href}
                                        className="group flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-600 hover:text-sky-600 hover:bg-sky-50/80 transition-all duration-200 font-medium"
                                    >
                                        <span>{item.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Desktop CTA Buttons */}
                    <div className="hidden md:flex items-center space-x-3">
                        <Link
                            to="/login"
                            className="px-4 py-2 text-sky-600 hover:text-sky-700 font-medium rounded-xl hover:bg-sky-50/80 transition-all duration-200"
                        >
                            Sign In
                        </Link>
                        <Link
                            to="/signup"
                            className="group relative px-5 py-2 bg-gradient-to-r from-sky-500 to-cyan-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
                        >
                            <span className="relative z-10">Get Started</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-sky-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="lg:hidden p-2 rounded-xl text-gray-600 hover:text-sky-600 hover:bg-sky-50/80 transition-all duration-200"
                        aria-label="Toggle menu"
                    >
                        <svg
                            className={`w-6 h-6 transform transition-transform duration-200 ${isMenuOpen ? 'rotate-90' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {isMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                <div className={`lg:hidden transition-all duration-300 ease-in-out ${isMenuOpen
                    ? 'max-h-96 opacity-100 pb-6'
                    : 'max-h-0 opacity-0 overflow-hidden'
                    }`}>
                    <div className="border-t border-sky-100 pt-4">
                        <nav className="space-y-2">
                            {navigationItems.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 hover:text-sky-600 hover:bg-sky-50/80 transition-all duration-200 font-medium"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <span className="text-lg">{item.icon}</span>
                                    <span>{item.name}</span>
                                </a>
                            ))}
                        </nav>

                        {/* Mobile CTA Buttons */}
                        <div className="flex flex-col space-y-3 mt-6 pt-4 border-t border-sky-100">
                            <Link
                                to="/login"
                                className="flex items-center justify-center px-4 py-3 text-sky-600 font-medium rounded-xl border-2 border-sky-200 hover:bg-sky-50/80 transition-all duration-200"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/signup"
                                className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-semibold rounded-xl shadow-lg transition-all duration-200"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Get Started Free
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header