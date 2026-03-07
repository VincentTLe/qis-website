import { NextRequest, NextResponse } from 'next/server';
import { getPlayerByToken } from '@/lib/heist/game-state';

export async function GET(request: NextRequest) {
  const token = request.headers.get('x-player-token');
  if (!token) {
    return NextResponse.json({ error: 'No token' }, { status: 401 });
  }

  const player = await getPlayerByToken(token);
  if (!player) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  return NextResponse.json({ ok: true, ...player });
}
