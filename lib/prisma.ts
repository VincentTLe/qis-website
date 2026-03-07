import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';

function cleanConnectionString(url: string): string {
  // Remove channel_binding param — not supported by Neon serverless HTTP driver
  const u = new URL(url);
  u.searchParams.delete('channel_binding');
  return u.toString();
}

function createPrismaClient() {
  const raw = process.env.DATABASE_URL;
  if (!raw) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  const connectionString = cleanConnectionString(raw);
  const adapter = new PrismaNeon({ connectionString });
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
