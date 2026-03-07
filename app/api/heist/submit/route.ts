import { NextRequest, NextResponse } from 'next/server';
import { getActiveSession, addSubmission, getPlayerByToken } from '@/lib/heist/game-state';
import { phaseType } from '@/lib/heist/constants';

export async function POST(request: NextRequest) {
  const session = await getActiveSession();
  if (!session) {
    return NextResponse.json({ error: 'No active session' }, { status: 400 });
  }

  if (!session.phaseOpen) {
    return NextResponse.json({ error: 'Phase is not open for submissions' }, { status: 400 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  // Auth: accept either token or playerCode
  let playerCode: string;
  const token = request.headers.get('x-player-token');
  if (token) {
    const playerInfo = await getPlayerByToken(token);
    if (!playerInfo || playerInfo.sessionId !== session.id) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    playerCode = playerInfo.playerCode;
  } else if (body.playerCode) {
    playerCode = body.playerCode as string;
  } else {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const player = session.players.find(p => p.playerCode === playerCode);
  if (!player) {
    return NextResponse.json({ error: 'Invalid player code' }, { status: 400 });
  }

  const currentPhaseType = phaseType(session.phase);
  if (!currentPhaseType) {
    return NextResponse.json({ error: 'Current phase does not accept submissions' }, { status: 400 });
  }

  if (currentPhaseType === 'contribution') {
    const amount = body.amount as number;
    if (!session.config.allowedContributions.includes(amount)) {
      return NextResponse.json({ error: 'Invalid contribution amount' }, { status: 400 });
    }

    const sub = await addSubmission({
      playerCode,
      phase: session.phase,
      type: 'contribution',
      amount,
    });
    return NextResponse.json({ ok: true, submission: sub });
  }

  if (currentPhaseType === 'audit') {
    const auditChoice = body.auditChoice as string;
    const targetPlayerCode = body.targetPlayerCode as string | undefined;

    if (auditChoice !== 'no_audit' && auditChoice !== 'audit_someone') {
      return NextResponse.json({ error: 'Invalid audit choice' }, { status: 400 });
    }

    if (auditChoice === 'audit_someone') {
      if (!targetPlayerCode) {
        return NextResponse.json({ error: 'Must specify target for audit' }, { status: 400 });
      }
      if (targetPlayerCode === playerCode) {
        return NextResponse.json({ error: 'Cannot audit yourself' }, { status: 400 });
      }
      const target = session.players.find(p => p.playerCode === targetPlayerCode);
      if (!target || target.teamId !== player.teamId || !target.displayName) {
        return NextResponse.json({ error: 'Invalid audit target' }, { status: 400 });
      }
    }

    const sub = await addSubmission({
      playerCode,
      phase: session.phase,
      type: 'audit',
      auditChoice,
      targetPlayerCode: auditChoice === 'audit_someone' ? targetPlayerCode : undefined,
    });
    return NextResponse.json({ ok: true, submission: sub });
  }

  return NextResponse.json({ error: 'Unknown submission type' }, { status: 400 });
}
