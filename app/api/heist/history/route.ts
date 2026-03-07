import { NextResponse } from 'next/server';
import { getAllSessions } from '@/lib/heist/game-state';

export async function GET() {
  const sessions = await getAllSessions();
  return NextResponse.json({ sessions });
}
