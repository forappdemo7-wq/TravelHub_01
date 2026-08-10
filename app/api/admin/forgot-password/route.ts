import { NextRequest, NextResponse } from 'next/server';
import { readDataFile } from '@/lib/fileStorage';
import { generateResetToken } from '@/lib/resetTokens';

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  const admins = readDataFile<any>('admins.json');
  const adminExists = admins.some((a: any) => a.email === email);

  if (!adminExists) {
    return NextResponse.json({ message: 'If that email exists, a reset link has been sent.' });
  }

  const token = generateResetToken(email, 'admin');
  const resetLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/admin/reset-password/${token}`;

  console.log(`\n🔐 Admin password reset link for ${email}: ${resetLink}\n`);

  return NextResponse.json({ message: 'Reset link has been generated (check server console).' });
}