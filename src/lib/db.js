import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGODB_URL;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable in your .env.local and Vercel dashboard');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  // Check if already connected
  if (mongoose.connections[0].readyState) {
    console.log('Using existing MongoDB connection');
    return;
  }

  try {
    const opts = {
      bufferCommands: false,
    };

    console.log('Attempting MongoDB connection...');
    await mongoose.connect(MONGODB_URI, opts);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    throw new Error(`Failed to connect to MongoDB: ${error.message}`);
  }

}

export default connectDB;