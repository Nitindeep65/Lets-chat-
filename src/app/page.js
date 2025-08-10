'use client';
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Page() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const savedMode = localStorage.getItem('darkMode');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedMode !== null) {
            setIsDarkMode(JSON.parse(savedMode));
        } else {
            setIsDarkMode(systemPrefersDark);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    const handleGetStarted = () => {
        router.push('/Signup');
    };

    const handleLogin = () => {
        router.push('/Login');
    };

    return (
        <div className={`min-h-screen flex flex-col ${isDarkMode ? 'dark' : ''}`}>
            <Navbar />
            
            {/* Main Content */}
            <main className="flex-1 pt-16">
                {/* Hero Section */}
                <section className={`relative min-h-screen flex items-center justify-center overflow-hidden ${
                    isDarkMode 
                        ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900' 
                        : 'bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50'
                }`}>
                    {/* Background Animation */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className={`absolute -top-40 -right-80 w-96 h-96 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob ${
                            isDarkMode ? 'bg-purple-500' : 'bg-purple-300'
                        }`}></div>
                        <div className={`absolute -bottom-40 -left-80 w-96 h-96 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000 ${
                            isDarkMode ? 'bg-pink-500' : 'bg-pink-300'
                        }`}></div>
                        <div className={`absolute top-40 left-40 w-96 h-96 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000 ${
                            isDarkMode ? 'bg-indigo-500' : 'bg-indigo-300'
                        }`}></div>
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="max-w-4xl mx-auto">
                            {/* Main Heading */}
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
                                <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                    Connect
                                </span>
                                <br />
                                <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                                    Like Never Before
                                </span>
                            </h1>
                            
                            {/* Subtitle */}
                            <p className={`text-lg md:text-xl lg:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed ${
                                isDarkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                                Experience the future of messaging with our beautiful, fast, and secure chat platform. 
                                Connect with friends, family, and colleagues in real-time.
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                                <button
                                    onClick={handleGetStarted}
                                    className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl text-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                >
                                    Get Started Free
                                </button>
                                <button
                                    onClick={handleLogin}
                                    className={`w-full sm:w-auto px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 border-2 ${
                                        isDarkMode
                                            ? 'border-gray-600 text-gray-300 hover:border-gray-500 hover:text-white hover:bg-gray-800'
                                            : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                                >
                                    Sign In
                                </button>
                            </div>

                            {/* Feature Pills */}
                            <div className="flex flex-wrap justify-center gap-4 mb-16">
                                <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                                    isDarkMode 
                                        ? 'bg-gray-800/50 text-gray-300 border border-gray-700' 
                                        : 'bg-white/50 text-gray-700 border border-gray-200'
                                } backdrop-blur-sm`}>
                                    🚀 Real-time Messaging
                                </span>
                                <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                                    isDarkMode 
                                        ? 'bg-gray-800/50 text-gray-300 border border-gray-700' 
                                        : 'bg-white/50 text-gray-700 border border-gray-200'
                                } backdrop-blur-sm`}>
                                    🔒 End-to-End Secure
                                </span>
                                <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                                    isDarkMode 
                                        ? 'bg-gray-800/50 text-gray-300 border border-gray-700' 
                                        : 'bg-white/50 text-gray-700 border border-gray-200'
                                } backdrop-blur-sm`}>
                                    🌙 Dark Mode Support
                                </span>
                                <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                                    isDarkMode 
                                        ? 'bg-gray-800/50 text-gray-300 border border-gray-700' 
                                        : 'bg-white/50 text-gray-700 border border-gray-200'
                                } backdrop-blur-sm`}>
                                    📱 Mobile Responsive
                                </span>
                            </div>

                            {/* Chat Preview Mock */}
                            <div className="max-w-2xl mx-auto">
                                <div className={`rounded-2xl shadow-2xl overflow-hidden ${
                                    isDarkMode ? 'bg-gray-800/80' : 'bg-white/80'
                                } backdrop-blur-sm border ${
                                    isDarkMode ? 'border-gray-700' : 'border-gray-200'
                                }`}>
                                    {/* Chat Header */}
                                    <div className={`px-6 py-4 border-b ${
                                        isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
                                    }`}>
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                                                <span className="text-white font-semibold">JD</span>
                                            </div>
                                            <div className="ml-3">
                                                <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                                    John Doe
                                                </p>
                                                <p className={`text-sm ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                                                    Online
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Chat Messages */}
                                    <div className="p-6 space-y-4">
                                        <div className="flex justify-start">
                                            <div className={`max-w-xs px-4 py-2 rounded-2xl ${
                                                isDarkMode 
                                                    ? 'bg-gray-700 text-gray-200' 
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                Hey! How are you doing?
                                            </div>
                                        </div>
                                        <div className="flex justify-end">
                                            <div className="max-w-xs px-4 py-2 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white">
                                                I&apos;m great! Thanks for asking 😊
                                            </div>
                                        </div>
                                        <div className="flex justify-start">
                                            <div className={`max-w-xs px-4 py-2 rounded-2xl ${
                                                isDarkMode 
                                                    ? 'bg-gray-700 text-gray-200' 
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                Awesome! Let&apos;s chat more 🚀
                                            </div>
                                        </div>
                                    </div>

                                    {/* Chat Input */}
                                    <div className={`px-6 py-4 border-t ${
                                        isDarkMode ? 'border-gray-700' : 'border-gray-200'
                                    }`}>
                                        <div className="flex items-center space-x-3">
                                            <div className={`flex-1 px-4 py-2 rounded-full ${
                                                isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                                            }`}>
                                                <span className={`text-sm ${
                                                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                                }`}>
                                                    Type a message...
                                                </span>
                                            </div>
                                            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Scroll Indicator */}
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                        <svg className={`w-6 h-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </div>
                </section>

                {/* Features Section */}
                <section className={`py-20 ${
                    isDarkMode ? 'bg-gray-800' : 'bg-white'
                }`}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
                                isDarkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                                Why Choose Lets Chat?
                            </h2>
                            <p className={`text-lg max-w-2xl mx-auto ${
                                isDarkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                                Discover the features that make our platform the best choice for modern communication
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* Feature 1 */}
                            <div className={`p-8 rounded-2xl transition-all duration-300 hover:scale-105 ${
                                isDarkMode 
                                    ? 'bg-gray-700 hover:bg-gray-600' 
                                    : 'bg-gray-50 hover:bg-gray-100'
                            }`}>
                                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h3 className={`text-xl font-semibold mb-4 ${
                                    isDarkMode ? 'text-white' : 'text-gray-900'
                                }`}>
                                    Lightning Fast
                                </h3>
                                <p className={`${
                                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                }`}>
                                    Experience instant messaging with our optimized real-time infrastructure built for speed.
                                </p>
                            </div>

                            {/* Feature 2 */}
                            <div className={`p-8 rounded-2xl transition-all duration-300 hover:scale-105 ${
                                isDarkMode 
                                    ? 'bg-gray-700 hover:bg-gray-600' 
                                    : 'bg-gray-50 hover:bg-gray-100'
                            }`}>
                                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <h3 className={`text-xl font-semibold mb-4 ${
                                    isDarkMode ? 'text-white' : 'text-gray-900'
                                }`}>
                                    Secure & Private
                                </h3>
                                <p className={`${
                                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                }`}>
                                    Your conversations are protected with enterprise-grade encryption and privacy controls.
                                </p>
                            </div>

                            {/* Feature 3 */}
                            <div className={`p-8 rounded-2xl transition-all duration-300 hover:scale-105 ${
                                isDarkMode 
                                    ? 'bg-gray-700 hover:bg-gray-600' 
                                    : 'bg-gray-50 hover:bg-gray-100'
                            }`}>
                                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className={`text-xl font-semibold mb-4 ${
                                    isDarkMode ? 'text-white' : 'text-gray-900'
                                }`}>
                                    Mobile First
                                </h3>
                                <p className={`${
                                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                }`}>
                                    Fully responsive design that works perfectly on all devices, from phone to desktop.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className={`py-20 ${
                    isDarkMode 
                        ? 'bg-gradient-to-r from-gray-900 to-gray-800' 
                        : 'bg-gradient-to-r from-pink-500 to-purple-600'
                }`}>
                    <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                            Ready to Start Chatting?
                        </h2>
                        <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                            Join thousands of users who are already enjoying seamless conversations. 
                            Get started for free today!
                        </p>
                        <button
                            onClick={handleGetStarted}
                            className="px-8 py-4 bg-white text-gray-900 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                            Start Chatting Now
                        </button>
                    </div>
                </section>
            </main>

            <Footer />

            {/* CSS for animations */}
            <style jsx>{`
                @keyframes blob {
                    0% {
                        transform: translate(0px, 0px) scale(1);
                    }
                    33% {
                        transform: translate(30px, -50px) scale(1.1);
                    }
                    66% {
                        transform: translate(-20px, 20px) scale(0.9);
                    }
                    100% {
                        transform: translate(0px, 0px) scale(1);
                    }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </div>
    );
}

