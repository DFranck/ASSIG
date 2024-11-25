import { connectToDatabase } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { resetCode } = body;

  if (!resetCode) {
    return NextResponse.json(
      { message: 'Missing reset code' },
      { status: 400 },
    );
  }
  const { db } = await connectToDatabase();
  const user = await db.collection('users').findOne({ resetCode });
  if (
    !user ||
    !user.resetCodeExpiresAt ||
    new Date() > user.resetCodeExpiresAt
  ) {
    return NextResponse.json(
      { message: 'Invalid or expired reset code' },
      { status: 400 },
    );
  }

  return NextResponse.json({ message: 'Code is valid' }, { status: 200 });
}
