import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminCredentials, generateToken, createDefaultAdmin } from '@/lib/adminAuth';

export async function POST(req: NextRequest) {
  await createDefaultAdmin();
  const { email, password } = await req.json();
  const admin = await verifyAdminCredentials(email, password);
  if (!admin) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }
  const token = generateToken(admin);
  return NextResponse.json({ token, admin: { id: admin.id, name: admin.name, email: admin.email } });
}