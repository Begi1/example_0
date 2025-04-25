import { connectToDatabase } from "../../../lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const db = await connectToDatabase();
    const { teamId } = await req.json();

    if (!teamId) {
      return NextResponse.json({ error: "Team ID is required" }, { status: 400 });
    }

    const team = await db.collection("teams").findOne({ _id: new ObjectId(teamId) });

    if (!team) {
      return NextResponse.json({ exists: false }, { status: 200 });
    }

    return NextResponse.json({ exists: true }, { status: 200 });
  } catch (error) {
    console.error("Error checking team existence:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
