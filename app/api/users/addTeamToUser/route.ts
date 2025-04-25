import { ObjectId } from "mongodb";
import { connectToDatabase } from "../../../lib/mongodb";
import { NextResponse } from "next/server";

// Helper function to validate if a string is a valid ObjectId
const isValidObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);

export async function POST(req: Request) {
  try {
    const db = await connectToDatabase();
    const usersCollection = db.collection("users");
    const teamsCollection = db.collection("teams"); // Connect to the 'teams' collection

    const { userId, teamId } = await req.json(); // Expecting userId and teamId in the body

    // Validate inputs
    if (!userId || !teamId) {
      return NextResponse.json(
        { error: "Both userId and teamId are required." },
        { status: 400 }
      );
    }

    // Validate the format of teamId
    if (!isValidObjectId(teamId)) {
      return NextResponse.json(
        { error: "Invalid teamId format." },
        { status: 400 }
      );
    }

    // Check if the team exists
    const team = await teamsCollection.findOne({ _id: new ObjectId(teamId) });

    if (!team) {
      return NextResponse.json(
        { error: "Team not found." },
        { status: 404 }
      );
    }

    // Update the user's document to include the new team in their 'teams' array
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userId) }, // Match user by ID
      {
        $addToSet: { teams: teamId }, // Add the teamId to the 'teams' array if it's not already there
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: "User not found or team already added." },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Team added to user successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error adding team to user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
