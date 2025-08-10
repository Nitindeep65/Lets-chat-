import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export function verifyToken(token) {
  try {
    if (!token) {
      return null;
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error('Token verification error:', error.message);
    return null;
  }
}

export function createAuthMiddleware(handler) {
  return async (request) => {
    try {
      const token = request.headers.get('authorization')?.replace('Bearer ', '');
      
      if (!token) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
      }

      const decoded = verifyToken(token);
      
      if (!decoded) {
        return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
      }

      // Add user info to request
      request.user = decoded;
      
      return handler(request);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
    }
  };
}
