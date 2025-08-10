'use client';
import React from 'react';
import Link from "next/link";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

function Navbar() {
    const router = useRouter();
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    
    const handleClick = (e) => {
        e.preventDefault();
        router.push('/Login');
    }
    
    const handleSignupClick = (e) => {
        e.preventDefault();
        router.push('/Signup');
    }
    
    // Handle mounting to prevent hydration issues
    useEffect(() => {
        setMounted(true);
        
        const savedMode = localStorage.getItem('darkMode');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedMode !== null) {
          setIsDarkMode(JSON.parse(savedMode));
        } else {
          setIsDarkMode(systemPrefersDark);
        }
    }, []);
    
    useEffect(() => {
        if (!mounted) return;
        
        localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
        if (isDarkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode, mounted]);
      
    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Don't render anything until mounted to prevent hydration mismatch
    if (!mounted) {
        return (
            <div className="fixed w-full top-0 z-50 bg-white/95 border-b border-gray-200 shadow-lg">
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex-shrink-0">
                            <Link href="/" className="flex items-center">
                                <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                                    <span className="text-white font-bold text-sm">LC</span>
                                </div>
                                <h1 className="font-bold text-xl bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent hidden sm:block">
                                    Lets Chat
                                </h1>
                            </Link>
                        </div>
                    </div>
                </nav>
            </div>
        );
    }

    return (
        <div className={`fixed w-full top-0 z-50 transition-all duration-300 backdrop-blur-md ${
            isDarkMode 
                ? 'bg-gray-900/95 border-gray-700' 
                : 'bg-white/95 border-gray-200'
        } border-b shadow-lg`}>
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo/Brand */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                                <span className="text-white font-bold text-sm">LC</span>
                            </div>
                            <h1 className={`font-bold text-xl bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent hidden sm:block`}>
                                Lets Chat
                            </h1>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <Link 
                                href="/" 
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                    isDarkMode 
                                        ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                                }`}
                            >
                                Home
                            </Link>
                            <Link 
                                href="/about" 
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                    isDarkMode 
                                        ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                                }`}
                            >
                                About
                            </Link>
                            <Link 
                                href="/admin" 
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors border border-dashed ${
                                    isDarkMode 
                                        ? 'text-orange-300 hover:text-orange-200 border-orange-400 hover:bg-orange-900/20' 
                                        : 'text-orange-700 hover:text-orange-800 border-orange-400 hover:bg-orange-50'
                                }`}
                            >
                                Admin
                            </Link>
                        </div>
                    </div>

                    {/* Desktop Action Buttons */}
                    <div className="hidden md:flex items-center space-x-4">
                        <button
                            onClick={handleClick}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                isDarkMode
                                    ? 'text-gray-300 hover:text-white border border-gray-600 hover:border-gray-500'
                                    : 'text-gray-700 hover:text-gray-900 border border-gray-300 hover:border-gray-400'
                            }`}
                        >
                            Login
                        </button>
                        <button
                            onClick={handleSignupClick}
                            className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-pink-600 hover:to-purple-700 transition-all duration-200 shadow-lg"
                        >
                            Sign Up
                        </button>
                        
                        {/* Dark Mode Toggle */}
                        <button
                            onClick={toggleDarkMode}
                            className={`p-2 rounded-lg transition-all duration-300 ${
                                isDarkMode 
                                    ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300' 
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                            aria-label="Toggle dark mode"
                        >
                            {isDarkMode ? (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                                </svg>
                            )}
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center space-x-2">
                        {/* Mobile Dark Mode Toggle */}
                        <button
                            onClick={toggleDarkMode}
                            className={`p-2 rounded-lg transition-all duration-300 ${
                                isDarkMode 
                                    ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300' 
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                            aria-label="Toggle dark mode"
                        >
                            {isDarkMode ? (
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                                </svg>
                            )}
                        </button>
                        
                        <button
                            onClick={toggleMenu}
                            className={`p-2 rounded-md transition-colors ${
                                isDarkMode 
                                    ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                            }`}
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {isMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            <Link 
                                href="/" 
                                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                                    isDarkMode 
                                        ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                                }`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Home
                            </Link>
                            <Link 
                                href="/about" 
                                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                                    isDarkMode 
                                        ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                                }`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                About
                            </Link>
                            <Link 
                                href="/admin" 
                                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors border border-dashed ${
                                    isDarkMode 
                                        ? 'text-orange-300 hover:text-orange-200 border-orange-400 hover:bg-orange-900/20' 
                                        : 'text-orange-700 hover:text-orange-800 border-orange-400 hover:bg-orange-50'
                                }`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Admin Panel
                            </Link>
                            
                            <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex flex-col space-y-2">
                                    <button
                                        onClick={() => {
                                            handleClick();
                                            setIsMenuOpen(false);
                                        }}
                                        className={`w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors ${
                                            isDarkMode
                                                ? 'text-gray-300 hover:text-white border border-gray-600 hover:border-gray-500'
                                                : 'text-gray-700 hover:text-gray-900 border border-gray-300 hover:border-gray-400'
                                        }`}
                                    >
                                        Login
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleSignupClick();
                                            setIsMenuOpen(false);
                                        }}
                                        className="w-full text-left px-3 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-md text-base font-medium hover:from-pink-600 hover:to-purple-700 transition-all duration-200"
                                    >
                                        Sign Up
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </div>
    );
}

export default Navbar;