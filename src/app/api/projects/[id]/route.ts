import { connectToDatabase } from '@/lib/db';
import { ParamsWithId } from '@/types/api';
import { ObjectId } from 'mongodb'; // Import de ObjectId
import { NextRequest, NextResponse } from 'next/server';

// GET /api/projects/:id
// Requête GET pour obtenir les détails d'un projet par son ID
export async function GET(req: NextRequest, { params }: ParamsWithId) {
  console.log(
    '[API] Request GET to /api/projects/:id for getting project details',
  );
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

// DELETE /api/projects/:id
// Requête DELETE pour supprimer un projet par son ID
export async function DELETE(req: NextRequest, { params }: ParamsWithId) {
  console.log(
    '[API] Request DELETE to /api/projects/:id for deleting a project',
  );
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
    const existingProject = await db
      .collection('projects')
      .findOne({ _id: new ObjectId(id) });

    if (!existingProject) {
      console.warn('[API] Project not found:', id);
      return NextResponse.json(
        { message: 'Project not found' },
        { status: 404 },
      );
    }
    await db.collection('projects').deleteOne({ _id: new ObjectId(id) });
    console.log('[API] Project successfully deleted:', id);

    return NextResponse.json(
      { message: 'Project successfully deleted' },
      { status: 200 },
    );
  } catch (error) {
    console.error('[API] Error deleting project:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}

// PATCH /api/projects/:id
// Requête PATCH pour modifier un projet par son ID
// export async function PATCH(req: NextRequest, { params }: ParamsWithId) {
//   console.log(
//     '[API] Request PATCH to /api/projects/:id for updating a project',
//   );
// }

// POST /api/projects/:id
// export async function POST(req: NextRequest, { params }: ParamsWithId) {
//   console.log('[API] Request POST to /api/projects/:id for updating a project');
// }
