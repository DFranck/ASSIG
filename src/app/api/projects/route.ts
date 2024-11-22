import { connectToDatabase } from '@/lib/db';
import { getAuthenticatedUser } from '@/lib/getAuthenticatedUser';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/projects
export async function GET() {
  console.log('[API] request GET to /api/projects for getting user projects');
  const user = await getAuthenticatedUser();
  if (user instanceof NextResponse) {
    return user;
  }
  try {
    const { db } = await connectToDatabase();

    const projects = await db
      .collection('projects')
      .find({ userId: new ObjectId(user.id) })
      .toArray();

    if (!projects || projects.length === 0) {
      return NextResponse.json(
        { message: 'No projects found for the user' },
        { status: 404 },
      );
    }

    // console.log('[API] Projects fetched successfully:', projects);
    return NextResponse.json(projects);
  } catch (error) {
    console.error('[API] Error fetching user projects:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

// POST /api/projects
export async function POST(req: NextRequest) {
  console.log(
    '[API] Request POST to /api/projects to create a new user project',
  );

  try {
    const user = await getAuthenticatedUser();
    if (user instanceof NextResponse) {
      return user; // Retourne une erreur si l'utilisateur n'est pas authentifié
    }

    const { db } = await connectToDatabase();

    // Vérifiez si l'utilisateur existe encore dans la base
    const existingUser = await db
      .collection('users')
      .findOne({ _id: new ObjectId(user.id) });
    if (!existingUser) {
      console.warn('[API] User not found in the database:', user.id);
      return NextResponse.json(
        { error: 'User no longer exists in the database' },
        { status: 404 },
      );
    }

    // Traitez les données envoyées
    const body = await req.json();
    const newProject = {
      ...body,
      userId: existingUser._id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('projects').insertOne(newProject);

    return NextResponse.json({
      message: 'Project created successfully',
      _id: result.insertedId,
    });
  } catch (error) {
    console.error('[API] Error creating new project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
