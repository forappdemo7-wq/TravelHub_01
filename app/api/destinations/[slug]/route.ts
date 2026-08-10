import { NextResponse } from 'next/server';
import { destinations } from '@/lib/destinations';

export async function GET(
  _: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const destination = destinations.find(d => d.slug === slug);
  if (!destination) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(destination);
}