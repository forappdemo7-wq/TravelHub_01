import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { readDataFile, writeDataFile } from './fileStorage';

// Log the JWT secret when the server starts (to verify it's loaded)
console.log('🔐 JWT_SECRET from env:', process.env.JWT_SECRET);
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-me';
const ADMIN_FILE = 'admins.json';

export interface Admin {
  id: string;
  email: string;
  password: string;
  name: string;
}

export async function getAdminByEmail(email: string): Promise<Admin | null> {
  const admins = readDataFile<Admin>(ADMIN_FILE);
  console.log('📁 Admins in file (getAdminByEmail):', admins);
  return admins.find(a => a.email === email) || null;
}

export async function verifyAdminCredentials(email: string, password: string): Promise<Admin | null> {
  const admin = await getAdminByEmail(email);
  if (!admin) return null;
  const isValid = await bcrypt.compare(password, admin.password);
  console.log(`🔐 Password check for ${email}:`, isValid);
  return isValid ? admin : null;
}

export async function createDefaultAdmin() {
  const admins = readDataFile<Admin>(ADMIN_FILE);
  if (admins.length === 0) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const defaultAdmin: Admin = {
      id: '1',
      email: 'admin@travelhub.com',
      password: hashedPassword,
      name: 'Super Admin',
    };
    writeDataFile(ADMIN_FILE, [defaultAdmin]);
    console.log('✅ Default admin created: admin@travelhub.com / admin123');
  }
}

export function generateToken(admin: Admin): string {
  console.log('🔑 Generating token for admin:', admin.email);
  return jwt.sign({ id: admin.id, email: admin.email }, JWT_SECRET, { expiresIn: '7d' });
}

export async function verifyAdminToken(token: string): Promise<Admin | null> {
  try {
    console.log('🔍 Verifying token (first 50 chars):', token.slice(0, 50) + '...');
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    console.log('✅ Decoded payload:', decoded);
    const admins = readDataFile<Admin>(ADMIN_FILE);
    console.log('📁 Admins from file for verification:', admins);
    const admin = admins.find(a => a.id === decoded.id);
    console.log('👤 Admin found for id', decoded.id, '?', admin);
    return admin || null;
  } catch (error) {
    console.error('❌ Token verification error:', error);
    return null;
  }
}

export async function verifyAdmin(req: NextRequest): Promise<boolean> {
  const authHeader = req.headers.get('authorization');
  console.log('📨 Authorization header:', authHeader);
  if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
  const token = authHeader.split(' ')[1];
  console.log('🔑 Token extracted (first 50 chars):', token.slice(0, 50) + '...');
  const admin = await verifyAdminToken(token);
  return admin !== null;
}