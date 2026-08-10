// app/api/auth/forgot-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import prisma from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // ─── Check if user exists ──────────────────────────────────────────
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // For security, don't reveal if email exists or not
    if (!user) {
      // Still return success to prevent email enumeration
      return NextResponse.json({
        message: 'If that email exists, a reset link has been sent.',
      });
    }

    // ─── Generate reset token ──────────────────────────────────────────
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    // ─── Store token in database ──────────────────────────────────────
    // Delete any existing reset tokens for this email
    await prisma.resetToken.deleteMany({
      where: { email },
    });

    await prisma.resetToken.create({
      data: {
        email,
        token,
        expiresAt,
        role: 'user', // or 'admin' if needed
        consumed: false,
      },
    });

    // ─── Build reset link ──────────────────────────────────────────────
    const resetLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password/${token}`;

    // ─── Log the link (in production, send email) ──────────────────────
    console.log(`\n🔐 Password reset link for ${email}: ${resetLink}\n`);

    // In production, you would send an email here:
    // await sendResetEmail(email, resetLink);

    return NextResponse.json({
      message: 'Reset link has been generated (check server console).',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
}