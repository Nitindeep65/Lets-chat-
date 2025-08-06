'use client';
import React from 'react';
import Link from "next/link";
import { useState, useEffect } from 'react';

import { useRouter } from 'next/navigation';

function Navbar() {
    const router = useRouter();
    const handleClick= (e) =>{
        e.preventDefault();
        router.push('/Login');
    }
     const [isDarkMode, setIsDarkMode] = useState(false);
    
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
      
        const toggleDarkMode = () => {
          setIsDarkMode(!isDarkMode);
        };

    return (
        
        <div className={`shadow-white shadow-2xl fixed w-full p-4 h-14 flex items-center transition-all duration-300 ${
            isDarkMode 
                ? 'bg-gray-800 bg-opacity-95' 
                : 'bg-orange-200 bg-opacity-95'
        }`}>
            <nav className="flex items-center pl-12 w-full px-4">
                {/* App name centered */}
                <div className="items-center justify-center flex mx-auto text-center">
                    <h1 className="font-serif pl-15 bg-gradient-to-r from-pink-700 to-black bg-clip-text text-transparent text-3xl">Lets Chat</h1>
                </div>
                {/* Options on the right */}
                <ul className="flex items-center space-x-4">
                    <button className="bg-orange-100 shadow-black shadow-2xl text-black font-bold w-16 h-8 rounded-lg hover:bg-pink-800 hover:text-white hover:font-sans">
                        <Link href="/about" className="hover:underline">About</Link>
                    </button>
                    <button 
                    onClick={handleClick} className="bg-orange-100 shadow-black shadow-2xl text-black font-bold w-16 h-8 rounded-lg hover:bg-pink-800 hover:text-white hover:font-sans">
                     Login
                    </button>
                    
                    {/* Dark Mode Toggle in Navbar */}
                    <button
                      onClick={toggleDarkMode}
                      className={`p-2 rounded-lg transition-all duration-300 ${
                        isDarkMode 
                          ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300' 
                          : 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
                      } shadow-lg`}
                      aria-label="Toggle dark mode"
                    >
                      {isDarkMode ? (
                        // Sun icon for light mode
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        // Moon icon for dark mode
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                        </svg>
                      )}
                    </button>
                </ul>
            </nav>
            
        </div>
    );
}

export default Navbar;