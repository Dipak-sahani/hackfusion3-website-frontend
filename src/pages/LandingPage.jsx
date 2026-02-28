import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Activity,
    Calendar,
    ShieldCheck,
    Video,
    Stethoscope,
    ArrowRight,
    Users,
    Clipboard
} from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: <Calendar className="w-8 h-8 text-blue-500" />,
            title: "Easy Booking",
            description: "Schedule appointments with top specialists in just a few clicks. Choose your preferred time and mode."
        },
        {
            icon: <Video className="w-8 h-8 text-indigo-500" />,
            title: "Virtual Consultation",
            description: "Join high-quality video calls with doctors from the comfort of your home using our integrated Jitsi platform."
        },
        {
            icon: <ShieldCheck className="w-8 h-8 text-green-500" />,
            title: "Secured Data",
            description: "Your health records and consultations are protected with enterprise-grade encryption and privacy controls."
        },
        {
            icon: <Activity className="w-8 h-8 text-rose-500" />,
            title: "Medicine Tracking",
            description: "Stay on top of your prescriptions with automated reminders and real-time stock updates."
        }
    ];

    const stats = [
        { label: "Patients Served", value: "10,000+", icon: <Users className="w-5 h-5" /> },
        { label: "Expert Doctors", value: "500+", icon: <Stethoscope className="w-5 h-5" /> },
        { label: "Consultations", value: "50k+", icon: <Clipboard className="w-5 h-5" /> },
    ];

    return (
        <div className="min-h-screen bg-white font-primary">
            {/* Navigation */}
            <nav className="flex items-center justify-between px-8 py-6 bg-white border-b border-gray-100 sticky top-0 z-50">
                <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Stethoscope className="text-white w-6 h-6" />
                    </div>
                    <span className="text-2xl font-bold text-gray-800 tracking-tight">MedFlow AI</span>
                </div>
                <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-600">
                    <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
                    <a href="#about" className="hover:text-blue-600 transition-colors">About</a>
                    <a href="#contact" className="hover:text-blue-600 transition-colors">Contact</a>
                </div>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigate('/login')}
                        className="px-5 py-2 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors"
                    >
                        Login
                    </button>
                    <button
                        onClick={() => navigate('/register')}
                        className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-0.5"
                    >
                        Get Started
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative px-8 pt-20 pb-32 overflow-hidden">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center">
                    <div className="lg:w-1/2 lg:pr-12 z-10">
                        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold mb-6 border border-blue-100">
                            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
                            <span>SMART HEALTHCARE ECOSYSTEM</span>
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-tight mb-6">
                            Modern Care for <br />
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">Your Modern Life.</span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-xl">
                            Connect with top healthcare professionals, manage your prescriptions, and experience seamless consultations through our next-gen digital health platform.
                        </p>
                        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
                            <button
                                onClick={() => navigate('/register')}
                                className="flex items-center justify-center px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all transform hover:-translate-y-1 group"
                            >
                                Start Your Journey
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button className="flex items-center justify-center px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-all">
                                How it Works
                            </button>
                        </div>
                        <div className="flex space-x-8">
                            {stats.map((stat, i) => (
                                <div key={i}>
                                    <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                                    <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="lg:w-1/2 mt-16 lg:mt-0 relative">
                        <div className="relative z-10 transform lg:rotate-3 hover:rotate-0 transition-transform duration-700">
                            <div className="bg-linear-to-tr from-blue-600 to-indigo-700 rounded-3xl p-1 shadow-2xl">
                                <div className="bg-white rounded-[1.4rem] overflow-hidden p-4">
                                    <div className="bg-gray-50 rounded-xl aspect-4/3 flex items-center justify-center">
                                        <Activity className="w-24 h-24 text-blue-200 animate-pulse" />
                                    </div>
                                    <div className="mt-6 space-y-4">
                                        <div className="h-4 w-3/4 bg-gray-100 rounded"></div>
                                        <div className="h-4 w-1/2 bg-gray-100 rounded"></div>
                                        <div className="flex space-x-4">
                                            <div className="h-10 w-10 bg-blue-50 rounded-lg"></div>
                                            <div className="h-10 w-10 bg-indigo-50 rounded-lg"></div>
                                            <div className="h-10 w-10 bg-rose-50 rounded-lg"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Decorative blobs */}
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="px-8 py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-blue-600 font-bold text-sm tracking-widest uppercase mb-4">OUR SERVICES</h2>
                        <h3 className="text-4xl font-extrabold text-gray-900 mb-4">Everything You Need to Stay Healthy</h3>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            We've built an all-in-one ecosystem to support your healthcare journey, from scheduling to specialist consultations.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, i) => (
                            <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-blue-50 transition-all group">
                                <div className="mb-6 transform group-hover:-translate-y-1 transition-transform">
                                    {feature.icon}
                                </div>
                                <h4 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h4>
                                <p className="text-gray-500 leading-relaxed text-sm">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="px-8 py-24">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-linear-to-br from-blue-700 to-indigo-800 rounded-[3rem] p-12 lg:p-20 text-center relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-6">
                                Join the Future of Healthcare.
                            </h2>
                            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                                Whether you're a patient seeking care or a doctor looking to expand your practice, we have the tools you need.
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                                <button
                                    onClick={() => navigate('/register')}
                                    className="px-10 py-4 bg-white text-blue-700 rounded-2xl font-bold hover:bg-blue-50 transition-all shadow-xl"
                                >
                                    Join as a Patient
                                </button>
                                <button
                                    onClick={() => navigate('/register')}
                                    className="px-10 py-4 bg-blue-900/30 text-white border border-blue-400/30 backdrop-blur-md rounded-2xl font-bold hover:bg-blue-900/40 transition-all"
                                >
                                    Register as Doctor
                                </button>
                            </div>
                        </div>
                        {/* More blobs */}
                        <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 filter blur-3xl -ml-20 -mt-20"></div>
                        <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-400 opacity-20 filter blur-3xl -mr-20 -mb-20"></div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="px-8 py-16 bg-white border-t border-gray-100">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center space-x-2 mb-8 md:mb-0">
                        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                            <Stethoscope className="text-white w-5 h-5" />
                        </div>
                        <span className="text-xl font-bold text-gray-800 tracking-tight">HealthNexus</span>
                    </div>
                    <div className="flex space-x-8 text-sm font-medium text-gray-500 mb-8 md:mb-0">
                        <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-blue-600 transition-colors">Cookie Policy</a>
                    </div>
                    <div className="text-sm text-gray-400">
                        © 2026 HealthNexus. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
