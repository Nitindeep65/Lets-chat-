import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request) {
    try {
        console.log('Login API called');
        console.log('Environment check:', {
            hasMongoURI: !!process.env.MONGODB_URI,
            hasJWTSecret: !!process.env.JWT_SECRET,
            nodeEnv: process.env.NODE_ENV,
            isVercel: !!process.env.VERCEL
        });

        await connectDB();
        console.log('Database connected successfully');
        
        const { email, password } = await request.json();
        console.log('Login attempt for email:', email);

        // Validation
        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        // Check if JWT_SECRET exists
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET not found in environment variables');
            return NextResponse.json(
                { error: "Server configuration error" },
                { status: 500 }
            );
        }

        // Find user with password field
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
        
        if (!user) {
            console.log('User not found for email:', email);
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 401 }
            );
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Password mismatch for user:', email);
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 401 }
            );
        }

        // Update user status to online
        await User.findByIdAndUpdate(user._id, {
            isOnline: true,
            lastSeen: new Date()
        });

        // Generate JWT
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        console.log('Login successful for user:', email);

        // Create response with token in BOTH cookie AND body
        const response = NextResponse.json({
            success: true,
            message: 'Login successful',
            token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isOnline: true
            }
        });

        // Set HTTP-only cookie for additional security
        response.cookies.set('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60, // 7 days
            path: '/'
        });

        return response;

    } catch (error) {
        console.error('Login error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        return NextResponse.json(
            { 
                error: 'Internal server error',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            },
            { status: 500 }
        );
    }
}