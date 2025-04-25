// Import necessary modules
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../../../lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    // Extract the user ID from the URL
    const url = new URL(req.url);
    const userId = url.searchParams.get('id');

    // Validate the user ID
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required.' }, { status: 400 });
    }

    // Connect to the database
    const db = await connectToDatabase();
    const usersCollection = db.collection('users');

    // Fetch user by _id
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

    // If the user is not found, return an error
    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    // Return the user data without the password
    const { password, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword, { status: 200 });
  } catch (error) {
    console.error('GET /api/users/getUser error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
