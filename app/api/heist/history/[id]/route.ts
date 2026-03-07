import { NextRequest, NextResponse } from 'next/server';
import { getSessionById } from '@/lib/heist/game-state';
import { getLeaderboard, getHighlights } from '@/lib/heist/scoring';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getSessionById(id);
  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  const leaderboard = getLeaderboard(session);
  const highlights = getHighlights(session);

  return NextResponse.json({ session, leaderboard, highlights });
}
