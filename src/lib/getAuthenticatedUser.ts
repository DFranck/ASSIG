import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function getAuthenticatedUser() {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    console.error('[ERROR] User not authenticated or ID is missing');
    return NextResponse.json(
      { error: { message: 'User is not authenticated' } },
      { status: 401 },
    );
  }

  return session.user;
}
