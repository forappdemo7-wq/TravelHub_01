import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { verifyAdmin } from '@/lib/adminAuth';

// ─── GET: Fetch a single tour by ID ──────────────────────────────
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const tour = await prisma.tour.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        location: true,
        duration: true,
        price: true,
        rating: true,
        image: true,
        images: true,
        description: true,
        highlights: true,
        included: true,
        featured: true,
      },
    });

    if (!tour) {
      return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
    }

    return NextResponse.json(tour);
  } catch (error) {
    console.error('GET tour error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ─── PUT: Admin only – update a tour ─────────────────────────────
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

    const existing = await prisma.tour.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
    }

    const updated = await prisma.tour.update({
      where: { id },
      data: {
        name: body.name ?? existing.name,
        location: body.location ?? existing.location,
        duration: body.duration ?? existing.duration,
        price: body.price !== undefined ? Number(body.price) : existing.price,
        rating: body.rating !== undefined ? Number(body.rating) : existing.rating,
        image: body.image ?? existing.image,
        images: body.images ?? existing.images,
        description: body.description ?? existing.description,
        highlights: body.highlights ?? existing.highlights,
        included: body.included ?? existing.included,
        featured: body.featured !== undefined ? body.featured : existing.featured,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('PUT tour error:', error);
    return NextResponse.json({ error: 'Failed to update tour' }, { status: 500 });
  }
}

// ─── DELETE: Admin only – remove a tour ──────────────────────────
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifyAdmin(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    await prisma.tour.delete({ where: { id } });
    return NextResponse.json({ message: 'Tour deleted successfully' });
  } catch (error) {
    console.error('DELETE tour error:', error);
    return NextResponse.json({ error: 'Failed to delete tour' }, { status: 500 });
  }
}