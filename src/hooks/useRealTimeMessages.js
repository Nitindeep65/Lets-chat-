'use client';

import { useEffect, useRef, useState } from 'react';

export const useRealTimeMessages = (selectedUserId) => {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const intervalRef = useRef(null);
  const lastMessageIdRef = useRef(null);

  // Debug function
  const debugLog = (message, data = null) => {
    console.log(`[RealTime] ${message}`, data || '');
  };

  // Polling for new messages
  useEffect(() => {
    if (!selectedUserId) {
      debugLog('No selectedUserId, clearing interval');
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setMessages([]);
      lastMessageIdRef.current = null;
      return;
    }

    debugLog('Starting real-time polling for user:', selectedUserId);

    const pollForMessages = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          debugLog('No token found');
          return;
        }

        const params = new URLSearchParams({
          userId: selectedUserId
        });

        // For new messages only, add lastMessageId
        if (lastMessageIdRef.current) {
          params.append('lastMessageId', lastMessageIdRef.current);
          debugLog('Polling for new messages after:', lastMessageIdRef.current);
        } else {
          debugLog('Initial load for all messages');
        }

        const response = await fetch(`/api/messages/realtime?${params}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          debugLog('API Response:', { 
            messageCount: data.messages?.length || 0, 
            hasNewMessages: data.hasNewMessages,
            currentUserId: data.currentUserId,
            otherUserId: data.otherUserId
          });
          
          if (lastMessageIdRef.current) {
            // If we have a lastMessageId, these are new messages
            if (data.hasNewMessages && data.messages.length > 0) {
              debugLog('Adding new messages:', data.messages.length);
              setMessages(prev => {
                // Filter out invalid messages and duplicates
                const validNewMessages = data.messages.filter(msg => 
                  msg && 
                  msg._id && 
                  msg.content &&
                  !prev.some(existingMsg => existingMsg._id === msg._id)
                );
                
                if (validNewMessages.length > 0) {
                  lastMessageIdRef.current = validNewMessages[validNewMessages.length - 1]._id;
                  debugLog('Updated lastMessageId to:', lastMessageIdRef.current);
                  return [...prev, ...validNewMessages];
                }
                
                return prev;
              });
            }
          } else {
            // Initial load - set all messages
            if (data.messages.length > 0) {
              debugLog('Initial load - setting messages:', data.messages.length);
              // Filter out invalid messages
              const validMessages = data.messages.filter(msg => msg && msg._id && msg.content);
              debugLog('Valid messages after filtering:', validMessages.length);
              
              if (validMessages.length > 0) {
                setMessages(validMessages);
                lastMessageIdRef.current = validMessages[validMessages.length - 1]._id;
                debugLog('Set lastMessageId to:', lastMessageIdRef.current);
              } else {
                debugLog('No valid messages found for initial load');
                setMessages([]);
              }
            } else {
              debugLog('No messages found for initial load');
              setMessages([]);
            }
          }
          
          setIsConnected(true);
        } else {
          debugLog('API Error:', response.status);
          setIsConnected(false);
        }
      } catch (error) {
        debugLog('Polling error:', error.message);
        setIsConnected(false);
      }
    };

    // Initial load
    pollForMessages();

    // Set up polling interval (every 2 seconds for debugging)
    intervalRef.current = setInterval(pollForMessages, 2000);

    return () => {
      debugLog('Cleaning up polling for user:', selectedUserId);
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
    debugLog('Sending message to:', receiverId);
    debugLog('Message content:', content);
    
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
        debugLog('Message sent successfully:', data.message._id);
        
        // Add message immediately to local state for sender
        const newMessage = data.message;
        
        // Validate message before adding
        if (newMessage && newMessage._id && newMessage.content) {
          setMessages(prev => {
            // Check if message already exists
            if (prev.some(msg => msg._id === newMessage._id)) {
              debugLog('Message already exists in local state');
              return prev;
            }
            debugLog('Adding message to local state');
            return [...prev, newMessage];
          });
          
          // Update last message ID to include this new message
          lastMessageIdRef.current = newMessage._id;
          debugLog('Updated lastMessageId after send:', lastMessageIdRef.current);
        } else {
          debugLog('Invalid message received from server:', newMessage);
        }
        
        return { success: true, message: newMessage };
      } else {
        const errorData = await response.json();
        debugLog('Send message error:', errorData);
        return { success: false, error: errorData.error || 'Failed to send message' };
      }
    } catch (error) {
      debugLog('Network error sending message:', error.message);
      return { success: false, error: 'Network error sending message' };
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
