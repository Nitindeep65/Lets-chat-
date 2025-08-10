import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';

export async function GET() {
  try {
    console.log('Test API called');
    console.log('Environment variables check:', {
      hasMongoURI: !!process.env.MONGODB_URI,
      hasJWTSecret: !!process.env.JWT_SECRET,
      nodeEnv: process.env.NODE_ENV,
      isVercel: !!process.env.VERCEL,
      mongoURIPrefix: process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 20) + '...' : 'NOT_SET'
    });

    await connectDB();
    console.log('Database connection successful');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database connected successfully!',
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
      vercel: !!process.env.VERCEL
    });
  } catch (error) {
    console.error('Test API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function POST() {
  return NextResponse.json({
    message: 'Use GET method to test connectivity'
  }, { status: 405 });
}
