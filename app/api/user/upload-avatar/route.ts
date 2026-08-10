// app/api/user/upload-avatar/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { v2 as cloudinary } from 'cloudinary';
import prisma from '@/lib/db';

// ─── Configure Cloudinary ──────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('avatar') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // ─── Validate file type ──────────────────────────────────────────────
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Use JPEG, PNG, WEBP, or GIF.' }, { status: 400 });
    }

    // ─── Validate file size (max 2MB) ──────────────────────────────────
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Max 2MB.' }, { status: 400 });
    }

    // ─── Convert file to buffer ──────────────────────────────────────────
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // ─── Upload to Cloudinary ────────────────────────────────────────────
    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'travelhub/avatars',
          transformation: [{ width: 200, height: 200, crop: 'fill' }],
          format: 'webp',
          quality: 'auto:best',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    const avatarUrl = result.secure_url;

    // ─── Update user in database ────────────────────────────────────────
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { avatar: avatarUrl },
      select: { id: true, name: true, email: true, avatar: true },
    });

    // ─── Return the updated user ────────────────────────────────────────
    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Avatar upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}