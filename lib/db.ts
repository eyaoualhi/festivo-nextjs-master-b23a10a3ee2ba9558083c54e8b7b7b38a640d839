import "server-only";
import mongoose from "mongoose";

type ConnectionCache = { promise: Promise<typeof mongoose> | null };

/** Survit au rechargement à chaud : une seule connexion par processus (cours ch. 5). */
const globalForMongoose = globalThis as typeof globalThis & { mongooseCache?: ConnectionCache };
const cache: ConnectionCache = (globalForMongoose.mongooseCache ??= { promise: null });

export async function connectDB(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI manque : copiez-la depuis .env.example dans .env.local.");
  }

  cache.promise ??= mongoose.connect(uri, { serverSelectionTimeoutMS: 10_000 });
  try {
    return await cache.promise;
  } catch (error) {
    cache.promise = null;
    throw error;
  }
}
