/**
 * db.js — MongoDB connection via Mongoose
 * Fix #25: Connection pool tuned for high concurrency
 */
import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI is not set in .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, {
      // Fix #25 — pool size for concurrent load
      maxPoolSize: 50,
      minPoolSize: 5,
      socketTimeoutMS: 45_000,
      serverSelectionTimeoutMS: 5_000,
      heartbeatFrequencyMS: 10_000,
    });
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB runtime error:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️  MongoDB disconnected');
  });
}

export default mongoose;
