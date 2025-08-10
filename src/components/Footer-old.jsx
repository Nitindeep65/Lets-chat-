'use client';
import React, { useState, useEffect } from 'react';

export default function Footer() {
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Check for saved dark mode preference or system preference
    useEffect(() => {
        const savedMode = localStorage.getItem('darkMode');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedMode !== null) {
            setIsDarkMode(JSON.parse(savedMode));
        } else {
            setIsDarkMode(systemPrefersDark);
        }
    }, []);

    // Listen for dark mode changes from other components
    useEffect(() => {
        const handleStorageChange = () => {
            const savedMode = localStorage.getItem('darkMode');
            if (savedMode !== null) {
                setIsDarkMode(JSON.parse(savedMode));
            }
        };

        window.addEventListener('storage', handleStorageChange);
        
        // Also listen for custom dark mode events
        const handleDarkModeChange = () => {
            const savedMode = localStorage.getItem('darkMode');
            if (savedMode !== null) {
                setIsDarkMode(JSON.parse(savedMode));
            }
        };

        // Check periodically for changes (since localStorage events don't fire in same tab)
        const interval = setInterval(handleDarkModeChange, 100);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, []);

    return (
        <footer className={`w-full py-1 flex flex-col items-center shadow-inner fixed bottom-0 transition-all duration-300 ${
            isDarkMode 
                ? 'bg-gray-800 bg-opacity-95' 
                : 'bg-orange-200 bg-opacity-95'
        }`}>
            <div className={`text-sm ${isDarkMode ? 'text-white' : 'text-black'}`}>
                © {new Date().getFullYear()} Lets Chat. All rights reserved.
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-black'}`}>
                Made by Nitindeep singh
            </div>
        </footer>
    );
}



