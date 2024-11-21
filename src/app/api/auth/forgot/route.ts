import { connectToDatabase } from '@/lib/db';
import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import mailjet from 'node-mailjet';

const mailjetClient = new mailjet({
  apiKey: process.env.MAILJET_API_KEY!,
  apiSecret: process.env.MAILJET_API_SECRET!,
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email } = body;

  if (!email) {
    return NextResponse.json({ message: 'emailRequired' }, { status: 400 });
  }

  try {
    const { db } = await connectToDatabase();
    const user = await db.collection('users').findOne({ email });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    } // Si l'utilisateur est lié à un OAuth provider
    if (user.oauthProvider) {
      return NextResponse.json(
        {
          message: `This email is associated with ${user.oauthProvider}. Please use ${user.oauthProvider} to log in.`,
        },
        { status: 400 },
      );
    }
    const resetCode = crypto.randomBytes(3).toString('hex');
    const resetCodeExpiresAt = new Date(Date.now() + 3600000); // 1 hour from now
    await db.collection('users').updateOne(
      { email },
      {
        $set: {
          resetCode,
          resetCodeExpiresAt,
        },
      },
    );
    await mailjetClient.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: 'franckdufournetpro@gmail.com',
            Name: 'EzStart Developper',
          },
          To: [
            {
              Email: email,
              Name: user.username || 'User',
            },
          ],
          Subject: 'Password Reset Code',
          TextPart: `Your password reset code is: ${resetCode}`,
          HTMLPart: `<h3>Your password reset code is: <strong>${resetCode}</strong></h3>`,
          CustomID: 'PasswordResetEmail',
        },
      ],
    });

    return NextResponse.json({ message: 'Email sent' });
  } catch (err) {
    console.error('Failed to send email:', err);
    return NextResponse.json(
      { message: 'Failed to send email' },
      { status: 500 },
    );
  }
}
