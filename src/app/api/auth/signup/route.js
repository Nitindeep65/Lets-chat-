import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    // Connect to database
    await connectDB();
    
    // Get request body - Fixed: changed 'username' to 'name'
    const { name, email, password } = await request.json();
    
    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }
    
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }
    
    // Hash password - Fixed: increased salt rounds from 6 to 12
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create new user
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword
    });
    
    await user.save();
    
    // Return success response (without password)
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    };
    
    return NextResponse.json(
      { 
        success: true,
        message: 'User created successfully',
        user: userResponse
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Signup error:', error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { error: messages.join(', ') },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}