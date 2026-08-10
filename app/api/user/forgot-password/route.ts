import { NextRequest, NextResponse } from 'next/server';
import { readDataFile } from '@/lib/fileStorage';
import { generateResetToken } from '@/lib/resetTokens';

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  const users = readDataFile<any>('users.json');
  const userExists = users.some((u: any) => u.email === email);

  // Always return success for security (prevents email enumeration)
  if (!userExists) {
    return NextResponse.json({ message: 'If that email exists, a reset link has been sent.' });
  }

  const token = generateResetToken(email, 'user');
  const resetLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password/${token}`;

  // Log the link to console
  console.log(`\n🔐 User password reset link for ${email}: ${resetLink}\n`);

  return NextResponse.json({ message: 'Reset link has been generated (check server console).' });
}