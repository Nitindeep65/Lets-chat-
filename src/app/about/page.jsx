'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/Footer';

export default function About() {
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

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 min-h-screen">
        <Navbar />
        
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              About Lets Chat
            </h1>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
                Welcome to Lets Chat
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Lets Chat is a modern, real-time messaging platform built with Next.js and React. 
                Our mission is to provide a seamless and intuitive chat experience that brings 
                people together from around the world.
              </p>
              
              <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">
                Features
              </h3>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-6">
                <li>Real-time messaging</li>
                <li>User authentication and secure login</li>
                <li>Dark mode support</li>
                <li>Responsive design for all devices</li>
                <li>Modern and intuitive user interface</li>
              </ul>
              
              <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">
                Technology Stack
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-gray-600 dark:text-gray-300">
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-center">
                  <strong>Next.js 15</strong>
                  <p className="text-sm">React Framework</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-center">
                  <strong>React 19</strong>
                  <p className="text-sm">UI Library</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-center">
                  <strong>Tailwind CSS</strong>
                  <p className="text-sm">Styling</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-center">
                  <strong>MongoDB</strong>
                  <p className="text-sm">Database</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-center">
                  <strong>JWT</strong>
                  <p className="text-sm">Authentication</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-center">
                  <strong>Vercel</strong>
                  <p className="text-sm">Deployment</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg p-8 text-white text-center">
              <h3 className="text-2xl font-semibold mb-4">Get Started Today</h3>
              <p className="mb-6">
                Join thousands of users who are already enjoying seamless conversations on Lets Chat.
              </p>
              <div className="space-x-4">
                <a 
                  href="/Signup" 
                  className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
                >
                  Sign Up Now
                </a>
                <a 
                  href="/Login" 
                  className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors inline-block"
                >
                  Login
                </a>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
}
