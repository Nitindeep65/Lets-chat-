import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Message from '@/models/Message';
import Chat from '@/models/Chat';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    console.log('Send message API called');
    
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      console.log('No token provided');
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token verified for user:', decoded.userId);
    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError.message);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { receiverId, content } = await request.json();
    console.log('Message data:', { receiverId, hasContent: !!content });
    
    // Validation
    if (!receiverId || !content || !content.trim()) {
      return NextResponse.json({ 
        error: 'Receiver ID and message content are required' 
      }, { status: 400 });
    }

    if (receiverId === decoded.userId) {
      return NextResponse.json({ 
        error: 'Cannot send message to yourself' 
      }, { status: 400 });
    }
    
    await connectDB();
    console.log('Database connected successfully');
    
    // Check if receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return NextResponse.json({ 
        error: 'Receiver not found' 
      }, { status: 404 });
    }
    
    // Create message
    const message = new Message({
      sender: decoded.userId,
      receiver: receiverId,
      content: content.trim(),
      messageType: 'text'
    });
    
    await message.save();
    console.log('Message saved:', message._id);
    
    // Populate sender and receiver info
    await message.populate('sender receiver', 'name email');
    
    // Update or create chat
    const chat = await Chat.findOneAndUpdate(
      { 
        participants: { 
          $all: [decoded.userId, receiverId] 
        } 
      },
      {
        participants: [decoded.userId, receiverId],
        lastMessage: message._id,
        lastMessageAt: new Date()
      },
      { upsert: true, new: true }
    );
    
    console.log('Chat updated:', chat._id);
    
    return NextResponse.json({ 
      success: true, 
      message: message
    });
  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    console.log('Get messages API called');
    
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      console.log('No token provided');
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token verified for user:', decoded.userId);
    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError.message);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const otherUserId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit')) || 50;
    
    console.log('Get messages between:', decoded.userId, 'and', otherUserId);
    
    if (!otherUserId) {
      return NextResponse.json({ 
        error: 'User ID is required' 
      }, { status: 400 });
    }
    
    await connectDB();
    console.log('Database connected successfully');
    
    // Get messages between current user and other user
    const messages = await Message.find({
      $or: [
        { sender: decoded.userId, receiver: otherUserId },
        { sender: otherUserId, receiver: decoded.userId }
      ]
    })
    .populate('sender receiver', 'name email')
    .sort({ createdAt: 1 })
    .limit(limit);
    
    console.log(`Found ${messages.length} messages`);
    
    // Mark messages as read if they were sent to current user
    await Message.updateMany(
      {
        sender: otherUserId,
        receiver: decoded.userId,
        isRead: false
      },
      {
        isRead: true,
        readAt: new Date()
      }
    );
    
    return NextResponse.json({ 
      success: true,
      messages: messages 
    });
  } catch (error) {
    console.error('Get messages error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}
