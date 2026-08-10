const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Connecting...');
  await prisma.$connect();
  console.log('✅ Connected successfully!');
  const result = await prisma.$queryRaw`SELECT 1 as test`;
  console.log('✅ Query result:', result);
  await prisma.$disconnect();
}
main().catch((e) => {
  console.error('❌ Connection failed:', e);
  process.exit(1);
});