import { NextRequest, NextResponse } from 'next/server';
import { readDataFile, writeDataFile } from '@/lib/fileStorage';
import { validateResetToken, consumeResetToken } from '@/lib/resetTokens';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  const { token, newPassword } = await req.json();
  const record = validateResetToken(token);
  if (!record || record.role !== 'admin') {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
  }

  const admins = readDataFile<any>('admins.json');
  const adminIndex = admins.findIndex((a: any) => a.email === record.email);
  if (adminIndex === -1) {
    return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  admins[adminIndex].password = hashedPassword;
  writeDataFile('admins.json', admins);
  consumeResetToken(token);

  return NextResponse.json({ message: 'Password updated successfully. Redirecting to login...' });
}