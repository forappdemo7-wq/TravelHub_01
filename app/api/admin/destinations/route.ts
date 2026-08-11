import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/adminAuth';
import prisma from '@/lib/db';

async function isAdmin(req: NextRequest) {
  const auth = await verifyAdmin(req);
  return !!auth;
}

export async function GET(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const destinations = await prisma.destination.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(destinations);
  } catch (error) {
    console.error('Admin GET destinations error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();

    const {
      slug,
      name,
      country,
      image,
      description,
      price,
      duration,
      rating,
      reviewsCount,
      highlights,
      activities,
      size,
    } = body;

    if (!slug || !name || !country || !image || !description || !price || !duration) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if slug already exists
    const existing = await prisma.destination.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
    }

    const newDestination = await prisma.destination.create({
      data: {
        slug,
        name,
        country,
        image,
        description,
        price: Number(price),
        duration,
        rating: rating ? Number(rating) : 0,
        reviewsCount: reviewsCount ? Number(reviewsCount) : 0,
        highlights: highlights || [],
        activities: activities || [],
        size: size || null,
      },
    });

    return NextResponse.json(newDestination, { status: 201 });
  } catch (error) {
    console.error('Admin POST destination error:', error);
    return NextResponse.json({ error: 'Failed to create destination' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing destination id' }, { status: 400 });
    }

    const body = await req.json();

    const existing = await prisma.destination.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Destination not found' }, { status: 404 });
    }

    // If slug is changing, check uniqueness
    if (body.slug && body.slug !== existing.slug) {
      const slugExists = await prisma.destination.findUnique({ where: { slug: body.slug } });
      if (slugExists) {
        return NextResponse.json({ error: 'Slug already in use' }, { status: 409 });
      }
    }

    const updated = await prisma.destination.update({
      where: { id },
      data: {
        slug: body.slug ?? existing.slug,
        name: body.name ?? existing.name,
        country: body.country ?? existing.country,
        image: body.image ?? existing.image,
        description: body.description ?? existing.description,
        price: body.price ? Number(body.price) : existing.price,
        duration: body.duration ?? existing.duration,
        rating: body.rating ? Number(body.rating) : existing.rating,
        reviewsCount: body.reviewsCount ? Number(body.reviewsCount) : existing.reviewsCount,
        highlights: body.highlights ?? existing.highlights,
        activities: body.activities ?? existing.activities,
        size: body.size ?? existing.size,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Admin PUT destination error:', error);
    return NextResponse.json({ error: 'Failed to update destination' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing destination id' }, { status: 400 });
    }

    await prisma.destination.delete({ where: { id } });
    return NextResponse.json({ message: 'Destination deleted successfully' });
  } catch (error) {
    console.error('Admin DELETE destination error:', error);
    return NextResponse.json({ error: 'Failed to delete destination' }, { status: 500 });
  }
}