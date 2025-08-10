import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGODB_URL || 'mongodb://localhost:27017/letschat';

console.log('MONGODB_URI from env:', process.env.MONGODB_URI ? 'Found' : 'Not found');

if (!MONGODB_URI || MONGODB_URI === 'mongodb://localhost:27017/letschat') {
  console.warn('Warning: Using default/local MongoDB URI. Please set MONGODB_URI environment variable for production.');
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
