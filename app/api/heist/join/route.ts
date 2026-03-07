import { NextRequest, NextResponse } from 'next/server';
import { joinLobby } from '@/lib/heist/game-state';

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  const { displayName } = body;

  if (!displayName || typeof displayName !== 'string' || displayName.trim().length === 0) {
    return NextResponse.json({ error: 'Display name is required' }, { status: 400 });
  }

  try {
    const result = await joinLobby(displayName.trim());
    return NextResponse.json({ ok: true, ...result });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Failed to join';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
