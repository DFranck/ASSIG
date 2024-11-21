import { connectToDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  console.log('[API] Received request for user projects');

  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  });

  if (!token) {
    console.error('[API] User not authenticated');
    return NextResponse.json(
      { error: 'User is not authenticated' },
      { status: 401 },
    );
  }

  // console.log('[API] Token:', token);

  try {
    const { db } = await connectToDatabase();

    const projects = await db
      .collection('projects')
      .find({ userId: new ObjectId(token.sub) })
      .toArray();

    if (!projects || projects.length === 0) {
      return NextResponse.json(
        { message: 'No projects found for the user' },
        { status: 404 },
      );
    }

    console.log('[API] Projects fetched successfully:', projects);
    return NextResponse.json(projects);
  } catch (error) {
    console.error('[API] Error fetching user projects:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
