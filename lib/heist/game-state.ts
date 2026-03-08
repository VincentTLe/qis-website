import { prisma } from '@/lib/prisma';
import type { GameSession, Phase } from './types';
import { DEFAULT_CONFIG, PHASE_ORDER, TEAM_COLORS } from './constants';

// Helper to convert Prisma result to GameSession shape used by scoring
function toGameSession(s: Awaited<ReturnType<typeof querySession>>): GameSession | null {
  if (!s) return null;
  return {
    id: s.id,
    name: s.name,
    phase: s.phase as Phase,
    phaseOpen: s.phaseOpen,
    config: s.config as unknown as GameSession['config'],
    teams: s.teams.map(t => ({
      id: t.id,
      teamCode: t.teamCode,
      teamName: t.teamName,
      color: t.color ?? undefined,
      maxSize: t.maxSize,
      sortOrder: t.sortOrder,
    })),
    players: s.players.map(p => ({
      id: p.id,
      teamId: p.teamId,
      playerCode: p.playerCode,
      displayName: p.displayName ?? undefined,
      token: p.token,
    })),
    submissions: s.submissions.map(sub => ({
      id: sub.id,
      playerCode: sub.playerCode,
      phase: sub.phase as Phase,
      type: sub.type as 'contribution' | 'audit',
      amount: sub.amount ?? undefined,
      auditChoice: sub.auditChoice as 'no_audit' | 'audit_someone' | undefined,
      targetPlayerCode: sub.targetPlayerCode ?? undefined,
      submittedAt: sub.submittedAt.toISOString(),
    })),
    createdAt: s.createdAt.toISOString(),
  };
}

function querySession(id?: string) {
  const where = id ? { id } : { endedAt: null };
  return prisma.session.findFirst({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      teams: { orderBy: { sortOrder: 'asc' } },
      players: { orderBy: { playerCode: 'asc' } },
      submissions: { orderBy: { submittedAt: 'asc' } },
    },
  });
}

export async function getActiveSession(): Promise<GameSession | null> {
  const s = await querySession();
  return toGameSession(s);
}

export async function getSessionById(id: string): Promise<GameSession | null> {
  const s = await querySession(id);
  return toGameSession(s);
}

export async function getAllSessions() {
  return prisma.session.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      teams: true,
      _count: { select: { players: true, submissions: true } },
    },
  });
}

export async function createSession(
  name: string,
  teamsInput: { teamCode: string; teamName: string; size: number }[]
) {
  // End any existing active sessions
  await prisma.session.updateMany({
    where: { endedAt: null },
    data: { endedAt: new Date() },
  });

  const session = await prisma.session.create({
    data: {
      name,
      phase: 'lobby',
      phaseOpen: true,
      config: JSON.parse(JSON.stringify(DEFAULT_CONFIG)),
    },
  });

  // Create teams and empty player slots
  for (let i = 0; i < teamsInput.length; i++) {
    const { teamCode, teamName, size } = teamsInput[i];
    const team = await prisma.team.create({
      data: {
        sessionId: session.id,
        teamCode,
        teamName,
        color: TEAM_COLORS[i % TEAM_COLORS.length],
        maxSize: size,
        sortOrder: i,
      },
    });

    // Create empty player slots (displayName null = open slot)
    for (let j = 1; j <= size; j++) {
      await prisma.player.create({
        data: {
          sessionId: session.id,
          teamId: team.id,
          playerCode: `${teamCode}${j}`,
        },
      });
    }
  }

  return getActiveSession();
}

export async function joinLobby(displayName: string) {
  // Find active session in lobby
  const session = await prisma.session.findFirst({
    where: { endedAt: null, phase: 'lobby' },
  });
  if (!session) throw new Error('No active lobby');

  // Use transaction to prevent race conditions (two players claiming same slot)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return prisma.$transaction(async (tx: any) => {
    const slot = await tx.player.findFirst({
      where: { sessionId: session.id, displayName: null },
      orderBy: [{ team: { sortOrder: 'asc' } }, { playerCode: 'asc' }],
      include: { team: true },
    });
    if (!slot) throw new Error('Game is full');

    // Atomic update: only succeeds if displayName is still null
    const updated = await tx.player.updateMany({
      where: { id: slot.id, displayName: null },
      data: { displayName },
    });
    if (updated.count === 0) throw new Error('Slot was taken, please try again');

    const player = await tx.player.findUnique({
      where: { id: slot.id },
      include: { team: true },
    });
    if (!player) throw new Error('Player not found after update');

    return {
      token: player.token,
      playerCode: player.playerCode,
      displayName: player.displayName,
      teamCode: player.team.teamCode,
      teamName: player.team.teamName,
      teamColor: player.team.color,
    };
  });
}

export async function getPlayerByToken(token: string) {
  const player = await prisma.player.findFirst({
    where: {
      token,
      session: { endedAt: null },
    },
    include: { team: true, session: true },
  });
  if (!player) return null;
  return {
    playerCode: player.playerCode,
    displayName: player.displayName,
    teamCode: player.team.teamCode,
    teamName: player.team.teamName,
    teamColor: player.team.color,
    sessionId: player.sessionId,
    phase: player.session.phase as Phase,
    phaseOpen: player.session.phaseOpen,
  };
}

export async function advancePhase() {
  const session = await prisma.session.findFirst({ where: { endedAt: null } });
  if (!session) throw new Error('No active session');

   if (session.phase === 'lobby') {
    const openSlots = await prisma.player.count({
      where: { sessionId: session.id, displayName: null },
    });
    if (openSlots > 0) {
      throw new Error('Cannot start game until all lobby slots are filled');
    }
  }

  const idx = PHASE_ORDER.indexOf(session.phase as Phase);
  if (idx >= PHASE_ORDER.length - 1) throw new Error('Already at final phase');
  const newPhase = PHASE_ORDER[idx + 1];
  await prisma.session.update({
    where: { id: session.id },
    data: { phase: newPhase, phaseOpen: true },
  });
  return newPhase;
}

export async function closePhase() {
  const session = await prisma.session.findFirst({ where: { endedAt: null } });
  if (!session) throw new Error('No active session');
  await prisma.session.update({
    where: { id: session.id },
    data: { phaseOpen: false },
  });
  return session.phase as Phase;
}

export async function reopenPhase() {
  const session = await prisma.session.findFirst({ where: { endedAt: null } });
  if (!session) throw new Error('No active session');
  await prisma.session.update({
    where: { id: session.id },
    data: { phaseOpen: true },
  });
  return session.phase as Phase;
}

export async function setPhase(phase: Phase) {
  if (!PHASE_ORDER.includes(phase)) throw new Error('Invalid phase');
  const session = await prisma.session.findFirst({ where: { endedAt: null } });
  if (!session) throw new Error('No active session');
  await prisma.session.update({
    where: { id: session.id },
    data: { phase, phaseOpen: false },
  });
  return phase;
}

export async function addSubmission(data: {
  playerCode: string;
  phase: Phase;
  type: 'contribution' | 'audit';
  amount?: number;
  auditChoice?: string;
  targetPlayerCode?: string;
}) {
  const session = await prisma.session.findFirst({ where: { endedAt: null } });
  if (!session) throw new Error('No active session');

  const player = await prisma.player.findFirst({
    where: { sessionId: session.id, playerCode: data.playerCode },
  });
  if (!player) throw new Error('Player not found');

  return prisma.submission.create({
    data: {
      sessionId: session.id,
      playerId: player.id,
      playerCode: data.playerCode,
      phase: data.phase,
      type: data.type,
      amount: data.amount ?? null,
      auditChoice: data.auditChoice ?? null,
      targetPlayerCode: data.targetPlayerCode ?? null,
    },
  });
}

export async function endSession() {
  const session = await prisma.session.findFirst({ where: { endedAt: null } });
  if (!session) throw new Error('No active session');
  await prisma.session.update({
    where: { id: session.id },
    data: { endedAt: new Date(), phase: 'results', phaseOpen: false },
  });
}

export async function resetSession() {
  // Soft-delete: mark as ended
  await prisma.session.updateMany({
    where: { endedAt: null },
    data: { endedAt: new Date() },
  });
}
