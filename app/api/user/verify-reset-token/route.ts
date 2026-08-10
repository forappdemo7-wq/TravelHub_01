import { NextRequest, NextResponse } from 'next/server';
import { validateResetToken } from '@/lib/resetTokens';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');
  if (!token) {
    return NextResponse.json({ error: 'Missing token' }, { status: 400 });
  }

  const record = validateResetToken(token);
  if (!record || record.role !== 'user') {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
  }
  
  return NextResponse.json({ valid: true });
}