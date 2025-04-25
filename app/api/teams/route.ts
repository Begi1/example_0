import { ObjectId } from "mongodb";
import { connectToDatabase } from "../../lib/mongodb"; // Adjust path if necessary

export const POST = async (req: Request) => {
  const { teamName, members } = await req.json(); // Parse JSON from the request body

  // Validate team name and members
  if (!teamName || typeof teamName !== "string") {
    return new Response(
      JSON.stringify({ message: "Invalid team name" }),
      { status: 400 }
    );
  }
  
  if (!members || members.length === 0) {
    return new Response(
      JSON.stringify({ message: "Members are required" }),
      { status: 400 }
    );
  }

  try {
    const db = await connectToDatabase();
    const result = await db.collection("teams").insertOne({
      name: teamName,
      members: members, // Store members as strings
    });

    return new Response(
      JSON.stringify({ id: result.insertedId.toString(), name: teamName }), // Convert MongoDB ObjectId to string
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ message: "Error creating team", error }),
      { status: 500 }
    );
  }
};


// GET: Get teams by IDs
export const GET = async (req: Request) => {
  try {
    const url = new URL(req.url);
    const teamIdsParam = url.searchParams.getAll("ids");

    const db = await connectToDatabase();

    if (teamIdsParam.length === 0) {
      return new Response(
        JSON.stringify({ message: "No team IDs provided" }),
        { status: 400 }
      );
    }

    // Convert string IDs to ObjectId
    const teamIds = teamIdsParam.map((id) => new ObjectId(id));

    const teams = await db
      .collection("teams")
      .find({ _id: { $in: teamIds } })
      .toArray();

    return new Response(JSON.stringify(teams), { status: 200 });
  } catch (error) {
    console.error("Error fetching teams:", error);
    return new Response(
      JSON.stringify({ message: "Error fetching teams", error }),
      { status: 500 }
    );
  }
};
