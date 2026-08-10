import { NextRequest, NextResponse } from 'next/server';
import { readDataFile, writeDataFile } from '@/lib/fileStorage';
import { validateResetToken, consumeResetToken } from '@/lib/resetTokens';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  const { token, newPassword } = await req.json();
  const record = validateResetToken(token);
  if (!record || record.role !== 'user') {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
  }

  const users = readDataFile<any>('users.json');
  const userIndex = users.findIndex((u: any) => u.email === record.email);
  if (userIndex === -1) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  users[userIndex].password = hashedPassword;
  writeDataFile('users.json', users);
  consumeResetToken(token);

  return NextResponse.json({ message: 'Password updated successfully. Redirecting to login...' });
}