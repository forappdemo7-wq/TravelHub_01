// app/api/auth/reset-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: 'Token and new password are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // ─── Find the reset token ──────────────────────────────────────────
    const resetToken = await prisma.resetToken.findUnique({
      where: { token },
    });

    if (!resetToken) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 400 }
      );
    }

    // ─── Check if token is expired or already consumed ──────────────────
    if (resetToken.consumed) {
      return NextResponse.json(
        { error: 'Token already used' },
        { status: 400 }
      );
    }

    if (new Date() > resetToken.expiresAt) {
      // Delete expired token
      await prisma.resetToken.delete({ where: { id: resetToken.id } });
      return NextResponse.json(
        { error: 'Token expired' },
        { status: 400 }
      );
    }

    // ─── Find the user by email ────────────────────────────────────────
    const user = await prisma.user.findUnique({
      where: { email: resetToken.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // ─── Hash the new password and update user ──────────────────────────
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    // ─── Mark token as consumed ─────────────────────────────────────────
    await prisma.resetToken.update({
      where: { id: resetToken.id },
      data: { consumed: true },
    });

    return NextResponse.json({
      message: 'Password updated successfully. Redirecting to login...',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
}