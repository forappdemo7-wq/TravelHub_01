import { NextRequest, NextResponse } from 'next/server';
import { readDataFile, writeDataFile } from '@/lib/fileStorage';
import { verifyAdmin, generateToken } from '@/lib/adminAuth';
import bcrypt from 'bcryptjs';

interface Admin {
  id: string;
  email: string;
  password: string;
  name: string;
}

export async function PUT(req: NextRequest) {
  const auth = await verifyAdmin(req);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { currentPassword, newEmail, newPassword, confirmPassword } = await req.json();
  
  // Read admins from file
  const admins = readDataFile<Admin>('admins.json');
  
  // Get the first admin (assuming single admin for now)
  const admin = admins[0];
  
  if (!admin) {
    return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
  }

  // Verify current password
  const isValid = await bcrypt.compare(currentPassword, admin.password);
  if (!isValid) {
    return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
  }

  // Update email if provided
  if (newEmail && newEmail !== admin.email) {
    admin.email = newEmail;
  }

  // Update password if provided
  if (newPassword) {
    if (newPassword !== confirmPassword) {
      return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 });
    }
    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }
    admin.password = await bcrypt.hash(newPassword, 10);
  }

  // Save updated admin
  writeDataFile('admins.json', [admin]);

  // Generate new token with updated email
  const newToken = generateToken(admin);

  return NextResponse.json({ 
    success: true, 
    token: newToken,
    admin: { id: admin.id, email: admin.email, name: admin.name }
  });
}