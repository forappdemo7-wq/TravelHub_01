// app/api/bookings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/db';

// ─── GET: Fetch bookings (by email for user, or all for admin) ──────────
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (email) {
      const bookings = await prisma.booking.findMany({
        where: { userEmail: email },
        orderBy: { bookingDate: 'desc' },
      });
      return NextResponse.json(bookings);
    }

    // Admin can see all bookings (you can add role check later)
    const bookings = await prisma.booking.findMany({
      orderBy: { bookingDate: 'desc' },
    });
    return NextResponse.json(bookings);
  } catch (error) {
    console.error('GET bookings error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ─── POST: Create a new booking ──────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();

    const validTypes = ['tour', 'cruise', 'restaurant', 'destination'];
    if (!validTypes.includes(data.itemType)) {
      return NextResponse.json({ error: 'Invalid itemType' }, { status: 400 });
    }

    // ─── Ensure numeric fields ──────────────────────────────────────
    const travelers = Number(data.travelers);
    const totalPrice = Number(data.totalPrice);
    const itemPrice = Number(data.itemPrice);

    if (isNaN(travelers) || travelers < 1) {
      return NextResponse.json({ error: 'Invalid travelers count' }, { status: 400 });
    }

    // ─── Find the user by email to get the correct userId ──────────
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const booking = await prisma.booking.create({
      data: {
        userId: user.id, // use the real user ID from the database
        userEmail: session.user.email,
        userName: data.userName,
        userPhone: data.userPhone,
        itemId: String(data.itemId),
        itemType: data.itemType,
        itemName: data.itemName,
        itemImage: data.itemImage,
        itemPrice: itemPrice,
        travelers: travelers,
        totalPrice: totalPrice,
        travelDate: data.travelDate,
        specialRequests: data.specialRequests || '',
        status: data.status || 'pending',
        bookingDate: data.bookingDate ? new Date(data.bookingDate) : new Date(),
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error('POST booking error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ─── PUT: Update booking status (admin or user cancelling) ──────────────
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Authorization: admin or owner
    const isAdmin = session.user?.role === 'admin';
    if (!isAdmin && booking.userEmail !== session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    if (!isAdmin && status !== 'cancelled') {
      return NextResponse.json({ error: 'You can only cancel a booking' }, { status: 403 });
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('PUT booking error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ─── DELETE: Remove a booking (admin only) ──────────────────────────────
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing booking id' }, { status: 400 });
    }

    // Optional: add admin check here
    await prisma.booking.delete({ where: { id } });

    return NextResponse.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('DELETE booking error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}