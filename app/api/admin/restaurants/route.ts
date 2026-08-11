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
    const restaurants = await prisma.restaurant.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(restaurants);
  } catch (error) {
    console.error('Admin GET restaurants error:', error);
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
      name,
      description,
      image,
      cuisine,
      priceLevel,
      price,
      rating,
      reviewsCount,
      location,
      address,
      phone,
      hours,
      dietaryOptions,
      destinationId,
      coordinates,
      menuHighlights,
      bookable,
      bookingUrl,
    } = body;

    if (!name || !description || !image || !cuisine || !priceLevel || !price || !location || !address || !phone || !hours) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newRestaurant = await prisma.restaurant.create({
      data: {
        name,
        description,
        image,
        cuisine,
        priceLevel,
        price: Number(price),
        rating: rating ? Number(rating) : 0,
        reviewsCount: reviewsCount ? Number(reviewsCount) : 0,
        location,
        address,
        phone,
        hours,
        dietaryOptions: dietaryOptions || [],
        destinationId: destinationId || null,
        coordinates: coordinates || null,
        menuHighlights: menuHighlights || [],
        bookable: bookable ?? false,
        bookingUrl: bookingUrl || null,
      },
    });

    return NextResponse.json(newRestaurant, { status: 201 });
  } catch (error) {
    console.error('Admin POST restaurant error:', error);
    return NextResponse.json({ error: 'Failed to create restaurant' }, { status: 500 });
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
      return NextResponse.json({ error: 'Missing restaurant id' }, { status: 400 });
    }

    const body = await req.json();

    const existing = await prisma.restaurant.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
    }

    const updated = await prisma.restaurant.update({
      where: { id },
      data: {
        name: body.name ?? existing.name,
        description: body.description ?? existing.description,
        image: body.image ?? existing.image,
        cuisine: body.cuisine ?? existing.cuisine,
        priceLevel: body.priceLevel ?? existing.priceLevel,
        price: body.price ? Number(body.price) : existing.price,
        rating: body.rating ? Number(body.rating) : existing.rating,
        reviewsCount: body.reviewsCount ? Number(body.reviewsCount) : existing.reviewsCount,
        location: body.location ?? existing.location,
        address: body.address ?? existing.address,
        phone: body.phone ?? existing.phone,
        hours: body.hours ?? existing.hours,
        dietaryOptions: body.dietaryOptions ?? existing.dietaryOptions,
        destinationId: body.destinationId ?? existing.destinationId,
        coordinates: body.coordinates ?? existing.coordinates,
        menuHighlights: body.menuHighlights ?? existing.menuHighlights,
        bookable: body.bookable ?? existing.bookable,
        bookingUrl: body.bookingUrl ?? existing.bookingUrl,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Admin PUT restaurant error:', error);
    return NextResponse.json({ error: 'Failed to update restaurant' }, { status: 500 });
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
      return NextResponse.json({ error: 'Missing restaurant id' }, { status: 400 });
    }

    await prisma.restaurant.delete({ where: { id } });
    return NextResponse.json({ message: 'Restaurant deleted successfully' });
  } catch (error) {
    console.error('Admin DELETE restaurant error:', error);
    return NextResponse.json({ error: 'Failed to delete restaurant' }, { status: 500 });
  }
}