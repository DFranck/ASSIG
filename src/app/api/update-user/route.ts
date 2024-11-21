import { connectToDatabase } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'This route is for updating the user',
  });
}

export async function PATCH(req: NextRequest) {
  try {
    // Extraire les données de la requête
    const body = await req.json();
    const { email, ...updateData } = body;

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 },
      );
    }

    // Connexion à la base de données
    const { db } = await connectToDatabase();

    // Mise à jour de l'utilisateur dans MongoDB
    const result = await db.collection('users').updateOne(
      { email }, // Filtre
      { $set: updateData }, // Données mises à jour
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: 'User not found or no updates applied' },
        { status: 404 },
      );
    }

    // Récupération des données mises à jour
    const updatedUser = await db.collection('users').findOne({ email });

    return NextResponse.json(
      {
        message: 'User updated successfully',
        user: updatedUser,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 },
    );
  }
}
