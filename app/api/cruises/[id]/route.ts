import { NextRequest, NextResponse } from 'next/server';
import { readDataFile, updateDataFile, deleteFromDataFile } from '@/lib/fileStorage';
import { verifyAdmin } from '@/lib/adminAuth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const cruises = readDataFile('cruises.json');
  const cruise = cruises.find((c: any) => c.id === id);
  if (!cruise) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(cruise);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await verifyAdmin(req);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const data = await req.json();
  const updated = updateDataFile('cruises.json', id, data);
  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await verifyAdmin(req);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const deleted = deleteFromDataFile('cruises.json', id);
  if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ message: 'Deleted' });
}