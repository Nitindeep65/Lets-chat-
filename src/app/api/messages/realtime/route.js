import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '../../../../lib/db.js';
import Message from '../../../../models/Message.js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const lastMessageId = searchParams.get('lastMessageId');
    const otherUserId = searchParams.get('userId');
    
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUserId = decoded.userId;

    await connectDB();

    // Build query to get new messages
    const query = {
      $or: [
        { senderId: currentUserId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: currentUserId }
      ]
    };

    // If lastMessageId is provided, only get newer messages
    if (lastMessageId) {
      query._id = { $gt: lastMessageId };
    }

    const messages = await Message.find(query)
      .sort({ createdAt: 1 })
      .limit(50)
      .populate('senderId', 'name email')
      .populate('receiverId', 'name email');

    return NextResponse.json({
      success: true,
      messages: messages || [],
      hasNewMessages: messages.length > 0
    });

  } catch (error) {
    console.error('Real-time messages error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch messages',
      details: error.message 
    }, { status: 500 });
  }
}
