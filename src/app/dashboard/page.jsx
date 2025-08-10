'use client';

import { useState, useEffect, useRef } from 'react';
import { useRealTimeMessages } from '../../hooks/useRealTimeMessages';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Initialize real-time messaging
  const { 
    messages: realtimeMessages,
    isConnected, 
    onlineUsers, 
    sendMessage: sendRealtimeMessage,
    joinChat, 
    leaveChat, 
    startTyping, 
    stopTyping,
    markMessagesRead
  } = useRealTimeMessages(selectedChat?._id);

  // Auto scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Use real-time messages when available, otherwise fall back to loaded messages
  const displayMessages = selectedChat ? realtimeMessages : messages;

  useEffect(() => {
    scrollToBottom();
  }, [displayMessages]);

  // Handle mounting to prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Dark mode logic
  useEffect(() => {
    if (!mounted) return;
    
    const savedMode = localStorage.getItem('darkMode');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedMode !== null) {
      setIsDarkMode(JSON.parse(savedMode));
    } else {
      setIsDarkMode(systemPrefersDark);
    }
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode, mounted]);

  // Check authentication and load data
  useEffect(() => {
    if (!mounted) return;
    
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      window.location.href = '/Login';
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    loadUsers(token);
  }, [mounted]);

  // Load all users
  const loadUsers = async (token) => {
    try {
      const response = await fetch('/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      } else {
        console.error('Failed to load users');
      }
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load messages with a specific user
  const loadMessages = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/messages?userId=${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      } else {
        console.error('Failed to load messages');
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  // Select a chat
  const selectChat = (selectedUser) => {
    // Leave previous chat room
    if (selectedChat) {
      leaveChat(selectedChat._id);
    }
    
    setSelectedChat(selectedUser);
    loadMessages(selectedUser._id);
    
    // Join new chat room
    joinChat(selectedUser._id);
    
    // Mark messages as read
    markMessagesRead(selectedUser._id);
  };

  // Send a message
  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !selectedChat || sending) return;
    
    setSending(true);
    
    try {
      const result = await sendRealtimeMessage(selectedChat._id, newMessage.trim());
      
      if (result.success) {
        setNewMessage('');
        
        // Stop typing indicator
        if (stopTyping) {
          stopTyping(selectedChat._id);
        }
      } else {
        console.error('Failed to send message:', result.error);
        alert('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Error sending message');
    } finally {
      setSending(false);
    }
  };

  // Handle typing indicator
  const handleTyping = (value) => {
    setNewMessage(value);
    
    // Note: Typing indicators would be implemented with Socket.IO
    // For now, just update the message state
  };

  // Logout function
  const handleLogout = () => {
    if (!mounted) return;
    
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/Login';
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className={`${isDarkMode ? 'dark' : ''}`}>
      {/* Main container with proper top padding to account for fixed navbar */}
      <div className="pt-16"> {/* pt-16 = 64px to match navbar height */}
        <div className="flex h-screen">
          {/* Sidebar - Users List */}
          <div className="w-full md:w-1/3 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Chats</h2>
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Welcome, {user.name}</p>
                  <div className="flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-xs text-gray-400">
                      {isConnected ? 'Connected' : 'Disconnected'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                {/* Dark Mode Toggle */}
                <button
                  onClick={toggleDarkMode}
                  className={`p-2 rounded-full transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300' 
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
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
                
                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                  aria-label="Logout"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Users List */}
            <div className="flex-1 overflow-y-auto">
              {users.length === 0 ? (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  No users found
                </div>
              ) : (
                users.map((userItem) => (
                  <div
                    key={userItem._id}
                    onClick={() => selectChat(userItem)}
                    className={`p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      selectedChat?._id === userItem._id ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {userItem.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-800 dark:text-white truncate">{userItem.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{userItem.email}</p>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <div className={`w-3 h-3 rounded-full flex-shrink-0 ${onlineUsers.has(userItem._id) ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                        <span className="text-xs text-gray-400">
                          {onlineUsers.has(userItem._id) ? 'Online' : 'Offline'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* Chat Area */}
          <div className="flex-1 flex-col bg-gray-50 dark:bg-gray-900 hidden md:flex">
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {selectedChat.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 dark:text-white">{selectedChat.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {selectedChat.isOnline ? 'Online' : 'Offline'}
                        </p>
                      </div>
                    </div>
                    {/* Back button for mobile */}
                    <button 
                      onClick={() => setSelectedChat(null)}
                      className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {displayMessages.length === 0 ? (
                    <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    displayMessages.map((message) => (
                      <div
                        key={message._id}
                        className={`flex ${message.sender._id === user.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.sender._id === user.id
                              ? 'bg-blue-500 text-white'
                              : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-600'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.sender._id === user.id ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                          }`}>
                            {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
                
                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <form onSubmit={sendMessage} className="flex space-x-2">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => handleTyping(e.target.value)}
                        placeholder="Type a message and press Enter..."
                        disabled={sending}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 pr-16 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50"
                      />
                      {newMessage.trim() && !sending && (
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-400 dark:text-gray-500">
                          Press ↵
                        </div>
                      )}
                    </div>
                    <button
                      type="submit"
                      disabled={sending || !newMessage.trim()}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center min-w-[44px]"
                      title={sending ? "Sending..." : "Send message (Enter)"}
                    >
                      {sending ? (
                        <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      )}
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center max-w-md">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                    LC
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-600 dark:text-gray-300 mb-4">Welcome to Lets Chat</h3>
                  
                  {users.length === 0 ? (
                    <div className="space-y-4">
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        No users available to chat with yet.
                      </p>
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                        <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                          🚀 Get Started:
                        </h4>
                        <ol className="text-sm text-blue-700 dark:text-blue-300 space-y-1 text-left">
                          <li>1. Visit the <a href="/admin" className="underline hover:text-blue-800 dark:hover:text-blue-200">Admin Panel</a></li>
                          <li>2. Click "Create Test Users"</li>
                          <li>3. Return here and start chatting!</li>
                        </ol>
                      </div>
                      <a
                        href="/admin"
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                      >
                        Go to Admin Panel
                      </a>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-gray-500 dark:text-gray-400">
                        Select a user from the sidebar to start chatting
                      </p>
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                        <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                          💬 How to Chat:
                        </h4>
                        <ol className="text-sm text-green-700 dark:text-green-300 space-y-1 text-left">
                          <li>1. Click on a user in the sidebar</li>
                          <li>2. Type your message in the input field</li>
                          <li>3. Press Enter or click send (→)</li>
                          <li>4. See messages appear instantly!</li>
                        </ol>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Chat View */}
          {selectedChat && (
            <div className="md:hidden fixed inset-0 z-50 bg-white dark:bg-gray-900 flex flex-col">
              {/* Mobile Chat Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 mt-16">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={() => setSelectedChat(null)}
                      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {selectedChat.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white">{selectedChat.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {selectedChat.isOnline ? 'Online' : 'Offline'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Mobile Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {displayMessages.length === 0 ? (
                  <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  displayMessages.map((message) => (
                    <div
                      key={message._id}
                      className={`flex ${message.sender._id === user.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg ${
                          message.sender._id === user.id
                            ? 'bg-blue-500 text-white'
                            : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-600'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender._id === user.id ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
              
              {/* Mobile Message Input */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <form onSubmit={sendMessage} className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => handleTyping(e.target.value)}
                    placeholder="Type a message..."
                    disabled={sending}
                    className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={sending || !newMessage.trim()}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {sending ? (
                      <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}