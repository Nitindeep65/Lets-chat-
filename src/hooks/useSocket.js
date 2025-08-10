'use client';

import { useEffect, useRef, useState } from 'react';

export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());

  // For Vercel deployment, we'll use polling instead of Socket.IO
  // Socket.IO requires a custom server which Vercel doesn't support
  
  useEffect(() => {
    // Simulate connection for UI purposes
    setIsConnected(true);
    
    return () => {
      setIsConnected(false);
    };
  }, []);

  return {
    socket: null,
    isConnected,
    onlineUsers,
    joinChat: () => {},
    leaveChat: () => {},
    sendMessage: () => {},
    startTyping: () => {},
    stopTyping: () => {},
    markMessagesRead: () => {}
  };
};
