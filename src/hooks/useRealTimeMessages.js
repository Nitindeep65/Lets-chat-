'use client';

import { useEffect, useRef, useState } from 'react';

export const useRealTimeMessages = (selectedUserId) => {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const intervalRef = useRef(null);
  const lastMessageIdRef = useRef(null);

  // Polling for new messages
  useEffect(() => {
    if (!selectedUserId) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const pollForMessages = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const params = new URLSearchParams({
          userId: selectedUserId
        });

        if (lastMessageIdRef.current) {
          params.append('lastMessageId', lastMessageIdRef.current);
        }

        const response = await fetch(`/api/messages/realtime?${params}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          
          if (data.hasNewMessages && data.messages.length > 0) {
            setMessages(prev => {
              const newMessages = data.messages.filter(msg => 
                !prev.some(existingMsg => existingMsg._id === msg._id)
              );
              
              if (newMessages.length > 0) {
                lastMessageIdRef.current = newMessages[newMessages.length - 1]._id;
                return [...prev, ...newMessages];
              }
              
              return prev;
            });
          }
          
          setIsConnected(true);
        } else {
          setIsConnected(false);
        }
      } catch (error) {
        console.error('Polling error:', error);
        setIsConnected(false);
      }
    };

    // Initial load
    pollForMessages();

    // Set up polling interval (every 2 seconds)
    intervalRef.current = setInterval(pollForMessages, 2000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [selectedUserId]);

  // Reset messages when user changes
  useEffect(() => {
    setMessages([]);
    lastMessageIdRef.current = null;
  }, [selectedUserId]);

  const sendMessage = async (receiverId, content) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          receiverId,
          content: content.trim()
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Add message immediately to local state
        setMessages(prev => [...prev, data.message]);
        lastMessageIdRef.current = data.message._id;
        
        return { success: true, message: data.message };
      } else {
        return { success: false, error: 'Failed to send message' };
      }
    } catch (error) {
      console.error('Error sending message:', error);
      return { success: false, error: 'Error sending message' };
    }
  };

  return {
    messages,
    isConnected,
    onlineUsers,
    sendMessage,
    // Mock functions for compatibility with Socket.IO interface
    joinChat: () => {},
    leaveChat: () => {},
    startTyping: () => {},
    stopTyping: () => {},
    markMessagesRead: () => {}
  };
};
