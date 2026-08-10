import { NextResponse } from 'next/server';
import { restaurants } from '@/lib/restaurant-data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const destId = searchParams.get('destinationId');
  const cuisine = searchParams.get('cuisine');
  
  let result = restaurants;
  if (destId) result = result.filter(r => r.destinationId === destId);
  if (cuisine) result = result.filter(r => r.cuisine.toLowerCase().includes(cuisine.toLowerCase()));
  
  return NextResponse.json(result);
}