import { auth } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'User is not authenticated' },
        { status: 401 },
      );
    }

    const email = session.user.email;
    const body = await req.json();
    const { db } = await connectToDatabase();
    const user = await db.collection('users').findOne({
      email: email,
    });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found in the database' },
        { status: 404 },
      );
    }
    const newProject = {
      ...body,
      userId: user._id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await db.collection('projects').insertOne(newProject);
    return NextResponse.json({
      message: 'Project created successfully',
      _id: result.insertedId,
    });
  } catch (error) {
    console.error('Error parsing request body:', error);
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 },
    );
  }
}
