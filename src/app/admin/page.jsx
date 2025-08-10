'use client';
import React, { useState, useEffect } from 'react';

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [mounted, setMounted] = useState(false);

  // Handle mounting to prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  const seedUsers = async () => {
    if (!mounted) return;
    
    setLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/seed-users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage(`✅ ${data.message}. Created ${data.createdUsers} new users. Total users: ${data.totalUsers}`);
        loadUsers(); // Refresh the user list
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setMessage(`❌ Network error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/seed-users');
      const data = await response.json();
      
      if (response.ok) {
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  useEffect(() => {
    if (mounted) {
      loadUsers();
    }
  }, [mounted]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      {!mounted ? (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto mb-8"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Admin Panel - User Management
          </h1>
          
          {/* Seed Users Section */}
          <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4">
              Seed Test Users
            </h2>
            <p className="text-blue-700 dark:text-blue-300 mb-4">
              Click the button below to create sample users for testing the chat functionality.
              This will create 5 test users: Alice, Bob, Carol, David, and Emma.
            </p>
            
            <button
              onClick={seedUsers}
              disabled={loading}
              className={`bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Users...
                </div>
              ) : (
                'Create Test Users'
              )}
            </button>
            
            {message && (
              <div className="mt-4 p-3 bg-white dark:bg-gray-700 rounded border">
                <p className="text-sm text-gray-700 dark:text-gray-300">{message}</p>
              </div>
            )}
          </div>
          
          {/* Users List */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Current Users ({users.length})
            </h2>
            
            {users.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>No users found. Click "Create Test Users" to add sample users.</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 dark:text-white truncate">
                          {user.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {user.email}
                        </p>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${
                        user.isOnline ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                      }`}></div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Created: {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Instructions */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
              How to Test the Chat
            </h3>
            <ol className="list-decimal list-inside text-yellow-700 dark:text-yellow-300 space-y-1 text-sm">
              <li>Create test users using the button above</li>
              <li>Go to the <a href="/dashboard" className="underline hover:text-yellow-800">Dashboard</a></li>
              <li>You should now see the test users in the sidebar</li>
              <li>Click on any user to start chatting</li>
              <li>Open another browser tab/window and login as a different user to test real-time messaging</li>
            </ol>
          </div>
          
          {/* Navigation */}
          <div className="mt-8 text-center space-x-4">
            <a
              href="/dashboard"
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors inline-block"
            >
              Go to Dashboard
            </a>
            <a
              href="/"
              className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors inline-block"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
