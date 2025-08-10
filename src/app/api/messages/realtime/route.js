import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '../../../../lib/db.js';
import Message from '../../../../models/Message.js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const lastMessageId = searchParams.get('lastMessageId');
    const otherUserId = searchParams.get('userId');
    
    console.log('Real-time API called:', { lastMessageId, otherUserId });
    
    if (!otherUserId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }
    
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUserId = decoded.userId;

    console.log('Real-time request from:', currentUserId, 'to:', otherUserId);

    await connectDB();

    // Build query to get messages between the two users
    const query = {
      $or: [
        { senderId: currentUserId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: currentUserId }
      ]
    };

    // If lastMessageId is provided, only get newer messages
    if (lastMessageId) {
      try {
        const { ObjectId } = require('mongodb');
        query._id = { $gt: new ObjectId(lastMessageId) };
        console.log('Looking for messages after:', lastMessageId);
      } catch (err) {
        // If lastMessageId is invalid, get all messages
        console.warn('Invalid lastMessageId:', lastMessageId);
      }
    } else {
      console.log('Getting all messages (initial load)');
    }

    const messages = await Message.find(query)
      .sort({ createdAt: 1 })
      .limit(50)
      .populate('senderId', 'name email')
      .populate('receiverId', 'name email');

    const hasNewMessages = lastMessageId ? messages.length > 0 : false;
    
    console.log('Found messages:', messages.length, 'hasNewMessages:', hasNewMessages);

    return NextResponse.json({
      success: true,
      messages: messages || [],
      hasNewMessages,
      currentUserId,
      otherUserId,
      messageCount: messages.length,
      query: lastMessageId ? 'new_messages' : 'initial_load'
    });

  } catch (error) {
    console.error('Real-time messages error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch messages',
      details: error.message 
    }, { status: 500 });
  }
}
