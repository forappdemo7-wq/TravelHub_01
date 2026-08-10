// app/api/user/update/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function PUT(req: NextRequest) {
  try {
    // ─── Authenticate user ──────────────────────────────────────────────
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ─── Parse request body ─────────────────────────────────────────────
    const { name, email, currentPassword, newPassword, avatar } = await req.json();

    // ─── Find the user in the database ──────────────────────────────────
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // ─── Prepare update data ────────────────────────────────────────────
    const updateData: any = {};

    // Update name if provided
    if (name) updateData.name = name;

    // Update email if provided (and different)
    if (email && email !== user.email) {
      // Check if new email is already taken
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });
      if (existingUser) {
        return NextResponse.json(
          { error: 'Email already in use' },
          { status: 409 }
        );
      }
      updateData.email = email;
    }

    // Update avatar if provided
    if (avatar !== undefined) updateData.avatar = avatar;

    // ─── Handle password change ─────────────────────────────────────────
    if (newPassword) {
      // Current password is required to change password
      if (!currentPassword) {
        return NextResponse.json(
          { error: 'Current password is required to change password' },
          { status: 400 }
        );
      }

      // Verify current password
      const isValid = await bcrypt.compare(currentPassword, user.password);
      if (!isValid) {
        return NextResponse.json(
          { error: 'Current password is incorrect' },
          { status: 401 }
        );
      }

      // Hash new password
      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    // ─── If nothing to update ────────────────────────────────────────────
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { message: 'No changes to update' },
        { status: 200 }
      );
    }

    // ─── Update user in database ────────────────────────────────────────
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: updateData,
    });

    // ─── Return updated user (exclude password) ─────────────────────────
    const { password, ...userWithoutPassword } = updatedUser;

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('User update error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
}