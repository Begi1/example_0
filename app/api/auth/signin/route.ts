import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '../../../lib/mongodb';
import { generateToken } from '../../../lib/auth';
import { SignInRequestBody } from '../../../types';
import { User } from '../../../types';  // Import your User type

export async function POST(req: Request) {
  try {
    const db = await connectToDatabase();
    const usersCollection = db.collection('users');

    const { email, password }: SignInRequestBody = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    // Find user in the database
    const userDoc = await usersCollection.findOne({ email });

    // Ensure user is found and cast the document to User
    if (!userDoc) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    // Cast the document to the User type
    const user: User = {
      _id: userDoc._id.toString(),
      name: userDoc.name,
      email: userDoc.email,
      password: userDoc.password,
      createdAt: userDoc.createdAt,
    };

    // Check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    // Generate a JWT token
    const token = generateToken(user);

    // Respond with the token and user data (excluding password)
    const userWithoutPassword = {
      _id: user._id,
      name: user.name,
      email: user.email,
    };
    
    const response = NextResponse.json({ user: userWithoutPassword }, { status: 200 });
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60, // 1 hour
    });
    return response;
    
  } catch (error) {
    console.error('POST /api/auth/signin error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
