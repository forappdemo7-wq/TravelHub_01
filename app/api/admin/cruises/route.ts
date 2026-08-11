import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/adminAuth';
import prisma from '@/lib/db';

// ─── GET: List all cruises (admin) ──────────────────────────
export async function GET(req: NextRequest) {
  if (!(await verifyAdmin(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const cruises = await prisma.cruise.findMany({ orderBy: { name: 'asc' } });
    return NextResponse.json(cruises);
  } catch (error) {
    console.error('Admin GET cruises error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ─── POST ──────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  if (!(await verifyAdmin(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { name, ship, price, duration, image, description, destination, highlights, included, featured } = body;

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
        highlights: highlights || [],
        included: included || [],
        featured: featured ?? false,
      },
    });
    return NextResponse.json(newCruise, { status: 201 });
  } catch (error) {
    console.error('Admin POST error:', error);
    return NextResponse.json({ error: 'Failed to create cruise' }, { status: 500 });
  }
}

// ─── PUT ──────────────────────────────────────────────────────
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
        highlights: body.highlights ?? existing.highlights,
        included: body.included ?? existing.included,
        featured: body.featured !== undefined ? body.featured : existing.featured,
      },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Admin PUT error:', error);
    return NextResponse.json({ error: 'Failed to update cruise' }, { status: 500 });
  }
}

// ─── DELETE ──────────────────────────────────────────────────
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
    console.error('Admin DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete cruise' }, { status: 500 });
  }
}