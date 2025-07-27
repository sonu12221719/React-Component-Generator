// /config/db.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not set in .env');
  }

  try {
    await mongoose.connect(uri, {
      dbName: process.env.MONGODB_DB || undefined, // optional
      autoIndex: true,
    });

    console.log('✅ MongoDB connected');

    // Optional: log connection errors after initial connect
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

  } catch (err) {
    console.error('❌ MongoDB connection failed:', err);
    process.exit(1);
  }
}

// (Optional) graceful shutdown helper
export function setupMongoShutdown() {
  const cleanup = async (signal) => {
    console.log(`\n${signal} received. Closing MongoDB connection...`);
    await mongoose.connection.close();
    process.exit(0);
  };

  ['SIGINT', 'SIGTERM'].forEach((sig) => {
    process.on(sig, () => cleanup(sig));
  });
}
