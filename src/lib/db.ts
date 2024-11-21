import { Db, MongoClient } from 'mongodb';

let client: MongoClient | null = null;
let db: Db | null = null;

/**
 * Connect to MongoDB and initialize the database connection.
 */
export async function connectToDatabase() {
  if (!client || !db) {
    const uri = process.env.DATABASE_URL as string; // Assurez-vous que DATABASE_URL est défini
    client = new MongoClient(uri);

    try {
      await client.connect();
      console.log('✅ Connected to MongoDB');
      db = client.db(); // Utilise la base de données par défaut de l'URI
    } catch (error) {
      console.error('❌ Error connecting to MongoDB:', error);
      client = null;
      db = null;
      throw error; // Relancez l'erreur pour que l'appelant puisse la gérer
    }
  }

  return { client, db };
}

/**
 * Get the active MongoDB instance.
 */
export function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call connectToDatabase first.');
  }
  return db;
}
