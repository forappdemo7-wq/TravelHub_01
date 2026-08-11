import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/adminAuth';
import prisma from '@/lib/db';

// ─── GET: List all tours (admin) ─────────────────────────────
export async function GET(req: NextRequest) {
  if (!(await verifyAdmin(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const tours = await prisma.tour.findMany({ orderBy: { name: 'asc' } });
    return NextResponse.json(tours);
  } catch (error) {
    console.error('Admin GET tours error:', error);
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
    const { name, location, duration, price, rating, image, description, highlights, included, images, featured } = body;

    if (!name || !location || !duration || !price || !image || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newTour = await prisma.tour.create({
      data: {
        name,
        location,
        duration,
        price: Number(price),
        rating: rating ? Number(rating) : 0,
        image,
        description,
        highlights: highlights || [],
        included: included || [],
        images: images || [],
        featured: featured ?? false,
      },
    });
    return NextResponse.json(newTour, { status: 201 });
  } catch (error) {
    console.error('Admin POST error:', error);
    return NextResponse.json({ error: 'Failed to create tour' }, { status: 500 });
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
    return NextResponse.json({ error: 'Missing tour id' }, { status: 400 });
  }

  try {
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
        description: body.description ?? existing.description,
        highlights: body.highlights ?? existing.highlights,
        included: body.included ?? existing.included,
        images: body.images ?? existing.images,
        featured: body.featured !== undefined ? body.featured : existing.featured,
      },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Admin PUT error:', error);
    return NextResponse.json({ error: 'Failed to update tour' }, { status: 500 });
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
    return NextResponse.json({ error: 'Missing tour id' }, { status: 400 });
  }

  try {
    await prisma.tour.delete({ where: { id } });
    return NextResponse.json({ message: 'Tour deleted successfully' });
  } catch (error) {
    console.error('Admin DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete tour' }, { status: 500 });
  }
}