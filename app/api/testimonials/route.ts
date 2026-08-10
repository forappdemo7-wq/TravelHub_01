import { NextRequest, NextResponse } from 'next/server';
import { readDataFile, appendToDataFile } from '@/lib/fileStorage';
import { verifyAdmin } from '@/lib/adminAuth';

export async function GET() {
  const testimonials = readDataFile('testimonials.json');
  return NextResponse.json(testimonials);
}

export async function POST(req: NextRequest) {
  const auth = await verifyAdmin(req);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const data = await req.json();
  const newTestimonial = appendToDataFile('testimonials.json', data);
  return NextResponse.json(newTestimonial, { status: 201 });
}