import { connectToDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb'; // Import de ObjectId
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  if (!id || !ObjectId.isValid(id)) {
    console.error('[API] Invalid or missing project ID:', id);
    return NextResponse.json(
      { message: 'Invalid or missing project ID' },
      { status: 400 },
    );
  }

  try {
    const { db } = await connectToDatabase();

    const project = await db
      .collection('projects')
      .findOne({ _id: new ObjectId(id) });

    if (!project) {
      console.warn('[API] Project not found:', id);
      return NextResponse.json(
        { message: 'Project not found' },
        { status: 404 },
      );
    }
    return NextResponse.json(project);
  } catch (error) {
    console.error('[API] Error fetching project details:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
