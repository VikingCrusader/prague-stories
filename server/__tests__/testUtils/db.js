import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod;

export async function connectTestDB() {
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
}

export async function closeTestDB() {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
}

export async function clearTestDB() {
  const collections = mongoose.connection.collections;
  for (const key of Object.keys(collections)) {
    await collections[key].deleteMany({});
  }
  // The in-memory card catalog would otherwise outlive the reset whenever the
  // next test's cards give the same count/updatedAt stamp.
  const { clearLocationCatalog } = await import('../../src/services/locationCatalog.js');
  clearLocationCatalog();
}
