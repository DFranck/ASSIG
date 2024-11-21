import { auth } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import { compare, hash } from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    { message: 'This route is for POST change-password requests' },
    { status: 401 },
  );
}

export async function POST(req: NextRequest) {
  console.log('User is attempting to change password');

  try {
    // Authentification utilisateur via la session
    const session = await auth();
    console.log('Session:', session);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Extraction des paramètres de la requête
    const { currentPassword, newPassword } = await req.json();
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { message: 'Current and new passwords are required' },
        { status: 400 },
      );
    }

    // Connexion à la base de données
    const { db } = await connectToDatabase();
    const userEmail = session.user.email;

    // Recherche de l'utilisateur par email
    const user = await db.collection('users').findOne({ email: userEmail });

    if (!user || !user.password) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Vérification du mot de passe actuel
    const isPasswordCorrect = await compare(currentPassword, user.password);
    if (!isPasswordCorrect) {
      return NextResponse.json(
        { message: 'Current password is incorrect' },
        { status: 401 },
      );
    }

    // Hachage du nouveau mot de passe
    const hashedPassword = await hash(newPassword, 12);

    // Mise à jour du mot de passe de l'utilisateur
    const result = await db.collection('users').updateOne(
      { email: userEmail }, // Filtre
      { $set: { password: hashedPassword } }, // Mise à jour
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: 'Failed to update password' },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { message: 'Password updated successfully' },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error while changing password:', error);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 },
    );
  }
}
