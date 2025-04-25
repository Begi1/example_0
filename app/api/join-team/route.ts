import { connectToDatabase } from '../../lib/mongodb';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function PATCH(req: Request) {
  try {
    const db = await connectToDatabase();
    const usersCollection = db.collection('users');
    const teamsCollection = db.collection('teams');

    const body = await req.json();
    const { userId, teamId } = body;

    if (!userId || !teamId) {
      return NextResponse.json({ error: 'User ID and Team ID are required.' }, { status: 400 });
    }

    // Validate ObjectIds
    const isValidObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);

    if (!isValidObjectId(userId) || !isValidObjectId(teamId)) {
      return NextResponse.json({ error: 'Invalid ID format.' }, { status: 400 });
    }

    // Check if team exists
    const team = await teamsCollection.findOne({ _id: new ObjectId(teamId) });
    if (!team) {
      return NextResponse.json({ error: 'Team not found.' }, { status: 404 });
    }

    // Add team to user
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $addToSet: { teams: teamId } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Team joined successfully.' }, { status: 200 });
  } catch (error) {
    console.error('PATCH /api/join-team error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
