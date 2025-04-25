import { MongoClient, Db } from 'mongodb';

// Get the environment variables
const mongoUri = process.env.MONGODB_URI;
const databaseName = process.env.MONGODB_DB;

// Throw an error if the required environment variables are not defined
if (!mongoUri || !databaseName) {
  throw new Error('MONGODB_URI or MONGODB_DB is not defined in .env.local');
}

// MongoClient initialization
const client = new MongoClient(mongoUri);

let clientPromise: Promise<MongoClient>;

// Check if the environment is development to use global variables for reusing connections
if (process.env.NODE_ENV === 'development') {
  if (!(global as any)._mongoClientPromise) {
    (global as any)._mongoClientPromise = client.connect();
  }
  clientPromise = (global as any)._mongoClientPromise;
} else {
  clientPromise = client.connect();
}

// Function to connect to the database
export const connectToDatabase = async (): Promise<Db> => {
  try {
    const client = await clientPromise;
    return client.db(databaseName);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw new Error('Error connecting to MongoDB');
  }
};
