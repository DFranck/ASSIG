import { connectToDatabase } from '@/lib/db';
import { signUpSchema } from '@/lib/zod';
import { hash } from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsedData = signUpSchema.parse(body);

    const { username, email, password } = parsedData;

    const { db } = await connectToDatabase();

    const existingUser = await db.collection('users').findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      const message =
        existingUser.email === email
          ? 'This email is already in use. Please sign in.'
          : 'This username is already taken. Please choose another.';
      return NextResponse.json({ message }, { status: 409 });
    }

    const hashedPassword = await hash(password, 10);
    const usernameNormalized = username.toLowerCase().replace(/[^a-z0-9]/g, '');
    const user = await db.collection('users').insertOne({
      email,
      username,
      usernameNormalized,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(
      { message: 'User created successfully', user },
      { status: 201 },
    );
  } catch (error: any) {
    console.error('Error during user signup:', error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: 'Validation error', errors: error.errors },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}
