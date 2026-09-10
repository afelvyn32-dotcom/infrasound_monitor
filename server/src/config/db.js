import mongoose from 'mongoose';
import { ENV } from './env.js';

let mongoMemoryServer = null;

export const connectDB = async () => {
  let uri = ENV.MONGO_URI;

  if (uri && uri.trim() !== '') {
    try {
      console.log(`[DB] Attempting connection to MongoDB at: ${uri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')}`);
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 4000 });
      console.log('[DB] Successfully connected to configured MongoDB');
      return;
    } catch (err) {
      console.warn(`[DB] Could not connect to configured MONGO_URI: ${err.message}. Falling back to embedded MongoMemoryServer...`);
    }
  }

  try {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    mongoMemoryServer = await MongoMemoryServer.create();
    const memoryUri = mongoMemoryServer.getUri();
    console.log('[DB] Launching embedded in-memory MongoDB instance for zero-setup environment...');
    await mongoose.connect(memoryUri);
    console.log('[DB] Connected to embedded in-memory MongoDB successfully');
  } catch (memErr) {
    console.error('[DB] Critical error initializing MongoDB connection:', memErr.message);
    throw memErr;
  }
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};
