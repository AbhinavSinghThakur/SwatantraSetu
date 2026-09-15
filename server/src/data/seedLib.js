import mongoose from 'mongoose';
import { store, resetStore } from './store.js';

export async function seedDatabase() {
  resetStore();
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('No MONGODB_URI — using in-memory sample data only.');
    return;
  }
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
    const db = mongoose.connection.db;
    await db.collection('meta').updateOne(
      { key: 'seed' },
      {
        $set: {
          key: 'seed',
          seededAt: new Date(),
          counts: {
            workers: store.workers.length,
            cooperatives: store.cooperatives.length,
            bookings: store.bookings.length,
          },
        },
      },
      { upsert: true }
    );
    console.log('MongoDB connected and seed metadata written. API also serves in-memory demo data.');
    await mongoose.disconnect();
  } catch (err) {
    console.log('MongoDB unavailable — continuing with in-memory sample data.', err.message);
  }
}
