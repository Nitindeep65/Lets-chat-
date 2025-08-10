import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    console.log('Seeding users...');
    
    await connectDB();
    
    // Check if we already have users (to avoid duplicates)
    const existingUsersCount = await User.countDocuments();
    
    if (existingUsersCount > 1) {
      return NextResponse.json({ 
        message: 'Users already exist in database',
        count: existingUsersCount
      });
    }
    
    // Sample users to create
    const sampleUsers = [
      {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        password: 'password123',
        isOnline: true
      },
      {
        name: 'Bob Smith',
        email: 'bob@example.com',
        password: 'password123',
        isOnline: false
      },
      {
        name: 'Carol Davis',
        email: 'carol@example.com',
        password: 'password123',
        isOnline: true
      },
      {
        name: 'David Wilson',
        email: 'david@example.com',
        password: 'password123',
        isOnline: false
      },
      {
        name: 'Emma Brown',
        email: 'emma@example.com',
        password: 'password123',
        isOnline: true
      }
    ];
    
    // Hash passwords and create users
    const createdUsers = [];
    
    for (const userData of sampleUsers) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      
      if (!existingUser) {
        // Hash the password
        const hashedPassword = await bcrypt.hash(userData.password, 12);
        
        // Create user
        const user = new User({
          ...userData,
          password: hashedPassword,
          lastSeen: new Date()
        });
        
        const savedUser = await user.save();
        createdUsers.push({
          id: savedUser._id,
          name: savedUser.name,
          email: savedUser.email
        });
        
        console.log(`Created user: ${savedUser.name}`);
      }
    }
    
    const totalUsers = await User.countDocuments();
    
    return NextResponse.json({ 
      success: true,
      message: `Successfully seeded database`,
      createdUsers: createdUsers.length,
      totalUsers: totalUsers,
      users: createdUsers
    });
    
  } catch (error) {
    console.error('Seed users error:', error);
    return NextResponse.json({ 
      error: 'Failed to seed users',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    await connectDB();
    
    const users = await User.find({}).select('name email isOnline lastSeen createdAt');
    const userCount = users.length;
    
    return NextResponse.json({
      success: true,
      count: userCount,
      users: users.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        isOnline: user.isOnline,
        lastSeen: user.lastSeen,
        createdAt: user.createdAt
      }))
    });
    
  } catch (error) {
    console.error('Get all users error:', error);
    return NextResponse.json({ 
      error: 'Failed to get users',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}
