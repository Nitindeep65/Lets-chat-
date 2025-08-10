import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

let io;

const initializeSocket = (server) => {
  if (!io) {
    io = new Server(server, {
      cors: {
        origin: process.env.NODE_ENV === 'production' 
          ? process.env.NEXT_PUBLIC_APP_URL 
          : ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001'],
        methods: ['GET', 'POST'],
        credentials: true
      },
      transports: ['websocket', 'polling'],
      pingTimeout: 60000,
      pingInterval: 25000
    });

    // Store connected users
    const connectedUsers = new Map();

    // Authentication middleware
    io.use((socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        if (!token) {
          return next(new Error('Authentication error: No token provided'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = decoded.userId;
        next();
      } catch (error) {
        console.error('Socket authentication error:', error.message);
        next(new Error('Authentication error: Invalid token'));
      }
    });

    io.on('connection', (socket) => {
      console.log(`User ${socket.userId} connected to socket ${socket.id}`);
      
      // Store user connection
      connectedUsers.set(socket.userId, socket.id);
      
      // Broadcast user online status
      socket.broadcast.emit('user_status_change', {
        userId: socket.userId,
        isOnline: true
      });

      // Join user to their personal room
      socket.join(`user_${socket.userId}`);

      // Handle joining chat rooms
      socket.on('join_chat', (chatData) => {
        const { otherUserId } = chatData;
        const roomId = [socket.userId, otherUserId].sort().join('_');
        socket.join(roomId);
        console.log(`User ${socket.userId} joined chat room: ${roomId}`);
      });

      // Handle leaving chat rooms
      socket.on('leave_chat', (chatData) => {
        const { otherUserId } = chatData;
        const roomId = [socket.userId, otherUserId].sort().join('_');
        socket.leave(roomId);
        console.log(`User ${socket.userId} left chat room: ${roomId}`);
      });

      // Handle sending messages
      socket.on('send_message', (messageData) => {
        const { receiverId, content, messageId } = messageData;
        const roomId = [socket.userId, receiverId].sort().join('_');
        
        console.log(`Message from ${socket.userId} to ${receiverId} in room ${roomId}`);
        
        // Emit to the chat room (both sender and receiver)
        io.to(roomId).emit('new_message', {
          id: messageId,
          senderId: socket.userId,
          receiverId: receiverId,
          content: content,
          timestamp: new Date().toISOString(),
          isRead: false
        });

        // Also emit to receiver's personal room for notifications
        io.to(`user_${receiverId}`).emit('message_notification', {
          senderId: socket.userId,
          content: content,
          timestamp: new Date().toISOString()
        });
      });

      // Handle typing indicators
      socket.on('typing_start', (data) => {
        const { receiverId } = data;
        const roomId = [socket.userId, receiverId].sort().join('_');
        socket.to(roomId).emit('user_typing', {
          userId: socket.userId,
          isTyping: true
        });
      });

      socket.on('typing_stop', (data) => {
        const { receiverId } = data;
        const roomId = [socket.userId, receiverId].sort().join('_');
        socket.to(roomId).emit('user_typing', {
          userId: socket.userId,
          isTyping: false
        });
      });

      // Handle read receipts
      socket.on('mark_messages_read', (data) => {
        const { senderId } = data;
        const roomId = [socket.userId, senderId].sort().join('_');
        io.to(roomId).emit('messages_marked_read', {
          readByUserId: socket.userId
        });
      });

      // Handle disconnect
      socket.on('disconnect', (reason) => {
        console.log(`User ${socket.userId} disconnected: ${reason}`);
        
        // Remove user from connected users
        connectedUsers.delete(socket.userId);
        
        // Broadcast user offline status
        socket.broadcast.emit('user_status_change', {
          userId: socket.userId,
          isOnline: false
        });
      });

      // Handle errors
      socket.on('error', (error) => {
        console.error('Socket error:', error);
      });
    });

    console.log('Socket.IO server initialized');
  }

  return io;
};

export { initializeSocket };
export default io;
