// app/api/favorites/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/db';

// ─── GET: Fetch user's favorites ──────────────────────────────────────────
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const favorites = await prisma.favorite.findMany({
      where: { userEmail: session.user.email },
      orderBy: { addedAt: 'desc' },
    });

    return NextResponse.json(favorites);
  } catch (error) {
    console.error('GET favorites error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ─── POST: Add a new favorite ─────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { itemId, itemType, itemName, itemImage, itemPrice } = await req.json();

    // Validate required fields
    if (!itemId || !itemType || !itemName || !itemImage || itemPrice === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const validTypes = ['tour', 'cruise', 'restaurant', 'destination'];
    if (!validTypes.includes(itemType)) {
      return NextResponse.json({ error: 'Invalid itemType' }, { status: 400 });
    }

    // ─── Find the user by email to get the correct userId ──────────
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if already favorited
    const existing = await prisma.favorite.findFirst({
      where: {
        userEmail: session.user.email,
        itemId,
        itemType,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Already in favorites' },
        { status: 400 }
      );
    }

    // Create new favorite
    const newFavorite = await prisma.favorite.create({
      data: {
        userEmail: session.user.email,
        userId: user.id, // ✅ use the real user ID from the database
        itemId,
        itemType,
        itemName,
        itemImage,
        itemPrice,
      },
    });

    return NextResponse.json(newFavorite, { status: 201 });
  } catch (error) {
    console.error('POST favorite error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ─── DELETE: Remove a favorite by ID ──────────────────────────────────────
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing favorite id' }, { status: 400 });
    }

    // Ensure the favorite belongs to the user
    const existing = await prisma.favorite.findFirst({
      where: { id, userEmail: session.user.email },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Favorite not found or unauthorized' },
        { status: 404 }
      );
    }

    await prisma.favorite.delete({ where: { id } });

    return NextResponse.json({ message: 'Removed from favorites' });
  } catch (error) {
    console.error('DELETE favorite error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}