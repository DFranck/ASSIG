import { connectToDatabase } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json(
      { message: 'Method not allowed' },
      { status: 405 },
    );
  }

  try {
    // Récupération du body de la requête
    const body = await req.json();
    const { email, role } = body;

    // Validation des paramètres
    if (!email || !role) {
      return NextResponse.json(
        { message: 'Email and role are required' },
        { status: 400 },
      );
    }

    // Connexion à la base de données
    const { db } = await connectToDatabase();

    // Mise à jour de l'utilisateur par email
    const result = await db.collection('users').updateOne(
      { email }, // Filtre
      { $set: { role } }, // Mise à jour
    );

    // Vérification si un utilisateur a été mis à jour
    if (result.matchedCount === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(
      { message: `User role updated successfully: ${email} is now ${role}` },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error updating user role:', error);
    return NextResponse.json(
      { message: 'Error updating user role' },
      { status: 500 },
    );
  }
}
