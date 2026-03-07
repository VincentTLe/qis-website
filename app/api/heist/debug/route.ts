import { NextResponse } from 'next/server';

export async function GET() {
  const checks: Record<string, string> = {};

  // Check env vars
  checks.DATABASE_URL = process.env.DATABASE_URL ? 'set (' + process.env.DATABASE_URL.substring(0, 30) + '...)' : 'MISSING';
  checks.HEIST_ADMIN_KEY = process.env.HEIST_ADMIN_KEY ? 'set' : 'MISSING';

  // Try importing prisma
  try {
    const { prisma } = await import('@/lib/prisma');
    checks.prisma_import = 'ok';

    // Try a simple query
    try {
      const count = await prisma.session.count();
      checks.db_query = `ok (${count} sessions)`;
    } catch (e) {
      checks.db_query = `FAILED: ${e instanceof Error ? e.message : String(e)}`;
    }
  } catch (e) {
    checks.prisma_import = `FAILED: ${e instanceof Error ? e.message : String(e)}`;
  }

  return NextResponse.json(checks);
}
