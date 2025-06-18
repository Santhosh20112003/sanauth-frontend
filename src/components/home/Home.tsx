import { Link } from 'react-router-dom'
import Header from '../common/Header'
import { useState, useEffect } from 'react'
import Footer from '../common/Footer';

function Home() {
    const [isVisible, setIsVisible] = useState(false);
    const [activeFeature, setActiveFeature] = useState(0);

    useEffect(() => {
        setIsVisible(true);
        const interval = setInterval(() => {
            setActiveFeature(prev => (prev + 1) % 3);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const animatedElements = document.querySelectorAll('.scroll-animate');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in-up');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        animatedElements.forEach(element => {
            observer.observe(element);
        });

        return () => {
            animatedElements.forEach(element => {
                observer.unobserve(element);
            });
        };
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/30 to-cyan-50">
            <Header />

            {/* Hero Section */}
            <section className="relative pt-20 pb-32 overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0 bg-gradient-to-r from-sky-400/5 via-cyan-400/5 to-blue-400/5"></div>
                <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-sky-400 to-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center space-y-8">


                        {/* Main Heading */}
                        <div className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-sky-700 to-cyan-700 bg-clip-text text-transparent leading-tight">
                                Enterprise Authentication
                                <span className="block text-4xl md:text-5xl mt-2">Without the Complexity</span>
                            </h1>
                            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                                Complete authentication infrastructure with passwordless login, MFA, and SSO integration.
                            </p>
                        </div>

                        {/* CTA Buttons */}
                        <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                            <Link
                                to="/signup"
                                className="group relative px-5 py-3 bg-gradient-to-r from-sky-500 to-cyan-500 text-white rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                            >
                                <span className="relative z-10">Start Free Trial</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-sky-600 to-cyan-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </Link>
                            <Link
                                to="/demo"
                                className="group px-5 py-3 bg-white/80 backdrop-blur-sm border-2 border-gray-200 hover:border-sky-300 text-gray-700 hover:text-sky-600 rounded-2xl font-semibold text-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
                            >
                                <span className="flex items-center space-x-2">
                                    <span>Get Started</span>
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </span>
                            </Link>
                        </div>


                    </div>
                </div>
            </section>

            {/* Logo Strip */}
            <section className="py-12 bg-white/70 backdrop-blur-sm border-y border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8">
                        <p className="text-gray-600 font-medium">Trusted by teams at leading companies</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-8 items-center justify-items-center opacity-60">
                        {['Stripe', 'Shopify', 'Netflix', 'Airbnb', 'Uber', 'Spotify'].map((company, i) => (
                            <div key={i} className="h-12 w-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                                <span className="text-xs font-medium text-gray-500">{company}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Demo */}
            <section className="py-20 bg-gradient-to-br from-sky-50/50 to-cyan-50/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">


                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Feature List */}
                        <div className="space-y-6">
                            {[{
                                title: 'Passwordless Authentication',
                                desc: 'Magic links, biometric login, and WebAuthn support for frictionless user experience',
                                icon: '🔐'
                            }, {
                                title: 'Zero-Trust Security',
                                desc: 'Device fingerprinting, risk analysis, and adaptive authentication prevent account takeovers',
                                icon: '🛡️'
                            }, {
                                title: 'Enterprise SSO',
                                desc: 'SAML, OIDC, and Active Directory integration with automatic user provisioning',
                                icon: '🏢'
                            }].map((feature, idx) => (
                                <div
                                    key={idx}
                                    className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 ${activeFeature === idx
                                        ? 'bg-gradient-to-r from-sky-50 to-cyan-50 border-2 border-sky-200 shadow-lg'
                                        : 'bg-white/80 border border-gray-200 hover:shadow-md'
                                        }`}
                                    onClick={() => setActiveFeature(idx)}
                                >
                                    <div className="flex items-start space-x-4">
                                        <div className="text-3xl">{feature.icon}</div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                                            <p className="text-gray-600">{feature.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Demo Preview */}
                        <div className="relative">
                            <div className="bg-gradient-to-br from-sky-500 to-cyan-600 rounded-3xl p-8 shadow-2xl">
                                <div className="bg-white rounded-2xl p-8 min-h-[400px] flex flex-col justify-center">
                                    <div className="text-center">
                                        <div className="w-16 h-16 mb-2 bg-white rounded-2xl mx-auto flex items-center justify-center">
                                            <img
                                                src="https://ik.imagekit.io/vituepzjm/SanAuth/SanAuth.svg?updatedAt=1749400779754"
                                                alt="SANAUTH"
                                                className="size-16"
                                            />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-800 mb-2">SanAuth</h3>
                                            <p className="text-gray-600 mb-6">Enterprise-grade security in seconds</p>
                                        </div>
                                        <div className="space-y-3 w-full max-w-sm mx-auto">
                                            <div className="h-12 bg-gray-100 text-gray-500 flex items-center ps-4 rounded-xl animate-pulse">Your Email</div>
                                            <div className="h-12 bg-gray-100 text-gray-500 flex items-center ps-4 rounded-xl animate-pulse">Enter Password</div>
                                            <div className="h-12 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-xl flex items-center justify-center">
                                                <span className="text-white font-semibold">Authenticate</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Statistics */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Trusted by Industry Leaders</h2>
                        <p className="text-xl text-gray-600">Join thousands of companies securing their applications</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
                        {[{
                            value: '50M+',
                            label: 'Authentications Monthly'
                        }, {
                            value: '99.99%',
                            label: 'Uptime SLA'
                        }, {
                            value: '150+',
                            label: 'Countries Supported'
                        }, {
                            value: '<50ms',
                            label: 'Average Response'
                        }].map((stat, idx) => (
                            <div key={idx} className="text-center">
                                <div className="text-4xl font-bold bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-gray-600 font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Testimonials */}
                    <div className="grid md:grid-cols-3 gap-8">
                        {[{
                            quote: "SanAuth helped us achieve SOC 2 compliance 6 months faster than expected. The security features are enterprise-grade yet easy to implement.",
                            author: "Sarah Chen",
                            role: "CISO at FinTech Corp",
                            avatar: "👩‍💼"
                        }, {
                            quote: "We migrated 2M users from Auth0 to SanAuth in one weekend. The migration tools and support team made it seamless.",
                            author: "Marcus Rodriguez",
                            role: "VP Engineering at ScaleUp",
                            avatar: "👨‍💻"
                        }, {
                            quote: "Passwordless authentication increased our conversion rate by 40%. Users love the magic link and biometric options.",
                            author: "Emily Johnson",
                            role: "Head of Growth at ConsumerApp",
                            avatar: "👩‍🚀"
                        }].map((testimonial, idx) => (
                            <div key={idx} className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg border border-gray-100">
                                <div className="mb-6">
                                    <div className="flex text-yellow-400 mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <p className="text-gray-700 italic">"{testimonial.quote}"</p>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-gradient-to-r from-sky-400 to-cyan-400 rounded-full flex items-center justify-center text-2xl">
                                        {testimonial.avatar}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900">{testimonial.author}</div>
                                        <div className="text-sm text-gray-600">{testimonial.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-20 bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-500 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        Ready to Secure Your Application?
                    </h2>
                    <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
                        Join thousands of developers who trust SanAuth for enterprise-grade authentication.
                        Start your free trial today.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/signup"
                            className="px-8 py-4 bg-white text-gray-900 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                        >
                            Start Free Trial
                        </Link>
                        <Link
                            to="/contact"
                            className="px-8 py-4 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-2xl font-semibold text-lg hover:bg-white/30 transition-all duration-300"
                        >
                            Contact Sales
                        </Link>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    )
}

export default Home