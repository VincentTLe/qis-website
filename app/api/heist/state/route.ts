import { NextRequest, NextResponse } from 'next/server';
import { getActiveSession, getPlayerByToken } from '@/lib/heist/game-state';
import { getLeaderboard, getSubmissionCounts, getHighlights } from '@/lib/heist/scoring';
import { PHASE_LABELS, phaseType } from '@/lib/heist/constants';
import type { Phase } from '@/lib/heist/types';

export async function GET(request: NextRequest) {
  const session = await getActiveSession();
  if (!session) {
    return NextResponse.json({ session: null });
  }

  const role = request.nextUrl.searchParams.get('role') ?? 'player';
  const counts = getSubmissionCounts(session);

  // === ADMIN: full access ===
  if (role === 'admin') {
    const leaderboard = getLeaderboard(session);
    return NextResponse.json({
      session: { ...session, phaseLabel: PHASE_LABELS[session.phase] },
      counts,
      leaderboard,
      highlights: getHighlights(session),
    });
  }

  // === PROJECTOR: phase-aware smart display ===
  if (role === 'projector') {
    const phase = session.phase;
    const isOpen = session.phaseOpen;
    const pType = phaseType(phase);
    const base = {
      phase,
      phaseLabel: PHASE_LABELS[phase],
      phaseOpen: isOpen,
      teams: session.teams,
    };

    // Lobby: show roster
    if (phase === 'lobby') {
      const roster = session.teams.map(team => {
        const teamPlayers = session.players.filter(p => p.teamId === team.id);
        return {
          ...team,
          players: teamPlayers.map(p => ({
            playerCode: p.playerCode,
            displayName: p.displayName,
            joined: !!p.displayName,
          })),
          joinedCount: teamPlayers.filter(p => p.displayName).length,
          maxSize: team.maxSize ?? teamPlayers.length,
        };
      });
      const totalJoined = roster.reduce((s, t) => s + t.joinedCount, 0);
      const totalCapacity = roster.reduce((s, t) => s + t.maxSize!, 0);
      return NextResponse.json({ ...base, view: 'lobby', roster, totalJoined, totalCapacity });
    }

    // Contribution open: show only submission count
    if (pType === 'contribution' && isOpen) {
      return NextResponse.json({ ...base, view: 'collecting', counts });
    }

    // Contribution closed or audit: show team leaderboard
    if (pType === 'contribution' && !isOpen) {
      const leaderboard = getLeaderboard(session);
      return NextResponse.json({ ...base, view: 'team-leaderboard', teamScores: leaderboard.teamScores, counts });
    }

    if (pType === 'audit') {
      const leaderboard = getLeaderboard(session);
      return NextResponse.json({
        ...base,
        view: isOpen ? 'collecting' : 'team-leaderboard',
        teamScores: leaderboard.teamScores,
        counts,
      });
    }

    // Results: full everything
    if (phase === 'results') {
      const leaderboard = getLeaderboard(session);
      return NextResponse.json({
        ...base,
        view: 'results',
        leaderboard,
        highlights: getHighlights(session),
      });
    }

    return NextResponse.json({ ...base, view: 'waiting' });
  }

  // === PLAYER: token-based auth ===
  const token = request.headers.get('x-player-token');
  if (!token) {
    return NextResponse.json({
      phase: session.phase,
      phaseLabel: PHASE_LABELS[session.phase],
      phaseOpen: session.phaseOpen,
      joinOpen: session.phase === 'lobby',
    });
  }

  const playerInfo = await getPlayerByToken(token);
  if (!playerInfo || playerInfo.sessionId !== session.id) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  const player = session.players.find(p => p.playerCode === playerInfo.playerCode);
  if (!player) {
    return NextResponse.json({ error: 'Player not found' }, { status: 404 });
  }

  const team = session.teams.find(t => t.id === player.teamId)!;
  const teammates = session.players
    .filter(p => p.teamId === team.id && p.playerCode !== player.playerCode && p.displayName)
    .map(p => ({ playerCode: p.playerCode, displayName: p.displayName }));

  const mySubmissions = session.submissions.filter(s => s.playerCode === player.playerCode);
  const submittedThisPhase = mySubmissions.some(s => s.phase === session.phase);

  return NextResponse.json({
    phase: session.phase,
    phaseLabel: PHASE_LABELS[session.phase],
    phaseOpen: session.phaseOpen,
    player: {
      playerCode: player.playerCode,
      displayName: player.displayName,
      teamCode: team.teamCode,
      teamName: team.teamName,
      teamColor: team.color,
    },
    teammates,
    submittedThisPhase,
    mySubmissions: mySubmissions.map(s => ({
      phase: s.phase,
      type: s.type,
      amount: s.amount,
      auditChoice: s.auditChoice,
      targetPlayerCode: s.targetPlayerCode,
    })),
  });
}
