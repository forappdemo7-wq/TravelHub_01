import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/adminAuth';
import prisma from '@/lib/db';

// ─── GET: Public listing (supports ?featured=true & ?id=...) ──
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const featured = searchParams.get('featured') === 'true';
    const id = searchParams.get('id');

    if (id) {
      const cruise = await prisma.cruise.findUnique({ where: { id } });
      return NextResponse.json(cruise || null);
    }

    const cruises = await prisma.cruise.findMany({
      where: featured ? { featured: true } : undefined,
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(cruises);
  } catch (error) {
    console.error('GET cruises error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ─── POST: Admin only ──────────────────────────────────────────
export async function POST(req: NextRequest) {
  if (!(await verifyAdmin(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, ship, price, duration, image, description, destination, featured } = body;

    // Validate required fields
    if (!name || !ship || !price || !duration || !image || !description || !destination) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newCruise = await prisma.cruise.create({
      data: {
        name,
        ship,
        price: Number(price),
        duration,
        image,
        description,
        destination,
        featured: featured ?? false,
        // ❌ NO 'highlights' or 'included' – they don't exist in the model
      },
    });
    return NextResponse.json(newCruise, { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ error: 'Failed to create cruise' }, { status: 500 });
  }
}

// ─── PUT: Admin only ──────────────────────────────────────────
export async function PUT(req: NextRequest) {
  if (!(await verifyAdmin(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Missing cruise id' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const existing = await prisma.cruise.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Cruise not found' }, { status: 404 });
    }

    // ✅ Only update fields that exist in the model
    const updated = await prisma.cruise.update({
      where: { id },
      data: {
        name: body.name ?? existing.name,
        ship: body.ship ?? existing.ship,
        price: body.price !== undefined ? Number(body.price) : existing.price,
        duration: body.duration ?? existing.duration,
        image: body.image ?? existing.image,
        description: body.description ?? existing.description,
        destination: body.destination ?? existing.destination,
        featured: body.featured !== undefined ? body.featured : existing.featured,
        // ❌ NO 'highlights' or 'included' – they don't exist in the model
      },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ error: 'Failed to update cruise' }, { status: 500 });
  }
}

// ─── DELETE: Admin only ──────────────────────────────────────
export async function DELETE(req: NextRequest) {
  if (!(await verifyAdmin(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Missing cruise id' }, { status: 400 });
  }

  try {
    await prisma.cruise.delete({ where: { id } });
    return NextResponse.json({ message: 'Cruise deleted successfully' });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete cruise' }, { status: 500 });
  }
}