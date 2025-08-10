import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request) {
    try {
        await connectDB();
        const { email, password } = await request.json();

        // Validation
        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" }, // Fixed: specific error message
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

        // Find user with password field (since it's select: false by default)
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password'); // Fixed: toLowerCase() and +password
        
        if (!user) {
            return NextResponse.json(
                { error: "Invalid email or password" }, // Fixed: don't reveal which field is wrong
                { status: 401 }
            );
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json(
                { error: "Invalid email or password" }, // Fixed: consistent error message
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
            { userId: user._id, email: user.email }, // Fixed: use userId for consistency
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Create response with token in BOTH cookie AND body
        const response = NextResponse.json({
            success: true,
            message: 'Login successful',
            token: token, // Fixed: include token in response body for frontend
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
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}