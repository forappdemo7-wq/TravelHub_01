import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { verifyAdmin } from '@/lib/adminAuth';

// ─── GET: Fetch a single cruise by ID ──────────────────────────────
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const cruise = await prisma.cruise.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        ship: true,
        destination: true,
        duration: true,
        price: true,
        image: true,
        description: true,
        featured: true,
      },
    });

    if (!cruise) {
      return NextResponse.json({ error: 'Cruise not found' }, { status: 404 });
    }

    return NextResponse.json(cruise);
  } catch (error) {
    console.error('GET cruise error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ─── PUT: Admin only – update a cruise ─────────────────────────────
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifyAdmin(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
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
        featured: body.featured !== undefined ? body.featured : existing.featured,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('PUT cruise error:', error);
    return NextResponse.json({ error: 'Failed to update cruise' }, { status: 500 });
  }
}

// ─── DELETE: Admin only – remove a cruise ──────────────────────────
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifyAdmin(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    await prisma.cruise.delete({ where: { id } });
    return NextResponse.json({ message: 'Cruise deleted successfully' });
  } catch (error) {
    console.error('DELETE cruise error:', error);
    return NextResponse.json({ error: 'Failed to delete cruise' }, { status: 500 });
  }
}