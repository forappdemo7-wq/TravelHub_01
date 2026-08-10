import { NextResponse } from 'next/server';
import { restaurants } from '@/lib/restaurant-data';

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const restaurant = restaurants.find(r => r.id === id);
  if (!restaurant) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(restaurant);
}