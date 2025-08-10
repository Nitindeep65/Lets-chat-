import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export async function GET(request) {
  try {
    console.log('Users API called');
    
    // Verify JWT token
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
    
    await connectDB();
    console.log('Database connected successfully');
    
    // Get all users except current user
    const users = await User.find({ 
      _id: { $ne: decoded.userId } 
    }).select('name email isOnline lastSeen');
    
    console.log(`Found ${users.length} users`);
    
    return NextResponse.json({ 
      success: true,
      users: users 
    });
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    console.log('Update user status API called');
    
    // Verify JWT token
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { isOnline } = await request.json();
    
    await connectDB();
    
    // Update user's online status
    const updatedUser = await User.findByIdAndUpdate(
      decoded.userId,
      {
        isOnline: isOnline,
        lastSeen: isOnline ? new Date() : new Date()
      },
      { new: true }
    ).select('name email isOnline lastSeen');
    
    console.log(`User ${decoded.userId} status updated to ${isOnline ? 'online' : 'offline'}`);
    
    return NextResponse.json({ 
      success: true,
      user: updatedUser 
    });
  } catch (error) {
    console.error('Update user status error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}
