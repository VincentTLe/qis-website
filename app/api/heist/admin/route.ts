import { NextRequest, NextResponse } from 'next/server';
import type { Phase } from '@/lib/heist/types';
import {
  createSession,
  advancePhase,
  closePhase,
  reopenPhase,
  resetSession,
  endSession,
  setPhase,
  getActiveSession,
} from '@/lib/heist/game-state';

function checkAuth(request: NextRequest) {
  const adminKey = process.env.HEIST_ADMIN_KEY;
  if (!adminKey) {
    throw new Error('HEIST_ADMIN_KEY environment variable is not set');
  }
  return request.headers.get('x-admin-key') === adminKey;
}

export async function POST(request: NextRequest) {
  try {
    if (!checkAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  } catch {
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  const { action } = body;

  try {
    switch (action) {
      case 'create-session': {
        const name = (body.name as string) ?? 'The Heist';
        const teams = (body.teams as { teamCode: string; teamName: string; size: number }[]) ?? [];
        const session = await createSession(name, teams);
        return NextResponse.json({ ok: true, session });
      }

      case 'advance-phase': {
        const phase = await advancePhase();
        return NextResponse.json({ ok: true, phase });
      }

      case 'close-phase': {
        const phase = await closePhase();
        return NextResponse.json({ ok: true, phase });
      }

      case 'reopen-phase': {
        const phase = await reopenPhase();
        return NextResponse.json({ ok: true, phase });
      }

      case 'set-phase': {
        const phase = await setPhase(body.phase as Phase);
        return NextResponse.json({ ok: true, phase });
      }

      case 'end-session': {
        await endSession();
        return NextResponse.json({ ok: true });
      }

      case 'reset': {
        await resetSession();
        return NextResponse.json({ ok: true });
      }

      case 'export': {
        const data = await getActiveSession();
        return NextResponse.json({ ok: true, data });
      }

      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
