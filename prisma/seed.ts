import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

async function readJSON(filename: string) {
  const filePath = path.join(process.cwd(), 'data', filename);
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    console.warn(`⚠️ ${filename} not found – skipping`);
    return [];
  }
}

// ─── Seed Tours ───────────────────────────────────────────────
async function seedTours() {
  const tours = await readJSON('tours.json');
  if (!tours.length) return;

  console.log(`🌱 Seeding ${tours.length} tours...`);
  for (const tour of tours) {
    const { id, ...data } = tour;
    await prisma.tour.create({
      data: {
        ...data,
        featured: data.featured ?? false,
        highlights: data.highlights || [],
        included: data.included || [],
        images: data.images || [],
        price: typeof data.price === 'string' ? parseFloat(data.price) : data.price,
        rating: typeof data.rating === 'string' ? parseFloat(data.rating) : data.rating,
      },
    });
  }
  console.log(`✅ ${tours.length} tours seeded`);
}

// ─── Seed Cruises (only fields that exist in the model) ──────
async function seedCruises() {
  const cruises = await readJSON('cruises.json');
  if (!cruises.length) return;

  console.log(`🌱 Seeding ${cruises.length} cruises...`);
  for (const cruise of cruises) {
    // Remove fields that are NOT in the Cruise model
    const { id, rating, highlights, included, ...data } = cruise;
    await prisma.cruise.create({
      data: {
        name: data.name,
        ship: data.ship,
        destination: data.destination,
        duration: data.duration,
        price: typeof data.price === 'string' ? parseFloat(data.price) : data.price,
        image: data.image,
        description: data.description,
        featured: data.featured ?? false,
        // Add other fields only if they exist in your schema
      },
    });
  }
  console.log(`✅ ${cruises.length} cruises seeded`);
}

async function main() {
  console.log('🚀 Starting database seeding...');
  await seedTours();
  await seedCruises();
  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });