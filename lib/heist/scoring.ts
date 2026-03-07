import type { GameSession, PlayerRoundScore, PlayerScore, TeamScore } from './types';
import { contributionPhaseForRound, auditPhaseForRound } from './constants';

function getLatestSubmission(session: GameSession, playerCode: string, phase: string) {
  const subs = session.submissions
    .filter(s => s.playerCode === playerCode && s.phase === phase)
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  return subs[0] ?? null;
}

export function calculatePlayerRound(
  session: GameSession,
  playerCode: string,
  round: 1 | 2 | 3
): PlayerRoundScore {
  const { config, players, teams } = session;
  const player = players.find(p => p.playerCode === playerCode);
  if (!player) return { playerCode, round, contribution: 0, teamContributionTotal: 0, multipliedPool: 0, sharePerPlayer: 0, baseRoundWealth: 0, auditCostPaid: 0, auditDamageReceived: 0, auditsReceived: 0, netRoundWealth: 0 };
  const team = teams.find(t => t.id === player.teamId);
  if (!team) return { playerCode, round, contribution: 0, teamContributionTotal: 0, multipliedPool: 0, sharePerPlayer: 0, baseRoundWealth: 0, auditCostPaid: 0, auditDamageReceived: 0, auditsReceived: 0, netRoundWealth: 0 };
  const teammates = players.filter(p => p.teamId === team.id);
  const teamSize = teammates.length || 1; // Prevent division by zero

  const contribPhase = contributionPhaseForRound(round);

  // Player's contribution
  const contribSub = getLatestSubmission(session, playerCode, contribPhase);
  const contribution = contribSub?.amount ?? 0;

  // Team total contribution
  const teamContributionTotal = teammates.reduce((sum, tm) => {
    const sub = getLatestSubmission(session, tm.playerCode, contribPhase);
    return sum + (sub?.amount ?? 0);
  }, 0);

  const multipliedPool = teamContributionTotal * config.multiplier;
  const sharePerPlayer = multipliedPool / teamSize;
  const baseRoundWealth = config.endowmentPerRound - contribution + sharePerPlayer;

  // Audit (only rounds 2 and 3)
  let auditCostPaid = 0;
  let auditDamageReceived = 0;
  let auditsReceived = 0;

  if (round === 2 || round === 3) {
    const auditPhase = auditPhaseForRound(round);

    // Did this player audit someone?
    const myAudit = getLatestSubmission(session, playerCode, auditPhase);
    if (myAudit?.auditChoice === 'audit_someone') {
      auditCostPaid = config.auditCost;
    }

    // How many times was this player audited?
    for (const tm of teammates) {
      if (tm.playerCode === playerCode) continue;
      const theirAudit = getLatestSubmission(session, tm.playerCode, auditPhase);
      if (theirAudit?.auditChoice === 'audit_someone' && theirAudit.targetPlayerCode === playerCode) {
        auditsReceived++;
      }
    }
    auditDamageReceived = auditsReceived * config.auditDamage;
  }

  const netRoundWealth = baseRoundWealth - auditCostPaid - auditDamageReceived;

  return {
    playerCode,
    round,
    contribution,
    teamContributionTotal,
    multipliedPool,
    sharePerPlayer,
    baseRoundWealth,
    auditCostPaid,
    auditDamageReceived,
    auditsReceived,
    netRoundWealth,
  };
}

export function calculatePlayerScore(session: GameSession, playerCode: string): PlayerScore {
  const player = session.players.find(p => p.playerCode === playerCode);
  if (!player) return { playerCode, displayName: undefined, teamCode: '', teamName: '', rounds: [], totalWealth: 0 };
  const team = session.teams.find(t => t.id === player.teamId);
  if (!team) return { playerCode, displayName: player.displayName, teamCode: '', teamName: '', rounds: [], totalWealth: 0 };

  const completedRounds = getCompletedRounds(session);
  const rounds = completedRounds.map(r => calculatePlayerRound(session, playerCode, r));
  const totalWealth = rounds.reduce((sum, r) => sum + r.netRoundWealth, 0);

  return {
    playerCode,
    displayName: player.displayName,
    teamCode: team.teamCode,
    teamName: team.teamName,
    rounds,
    totalWealth,
  };
}

export function calculateTeamScores(session: GameSession): TeamScore[] {
  return session.teams.map(team => {
    const teamPlayers = session.players.filter(p => p.teamId === team.id);
    const playerScores = teamPlayers.map(p => calculatePlayerScore(session, p.playerCode));
    const totalWealth = playerScores.reduce((sum, ps) => sum + ps.totalWealth, 0);

    return {
      teamCode: team.teamCode,
      teamName: team.teamName,
      color: team.color,
      totalWealth,
      playerScores,
    };
  });
}

export function getLeaderboard(session: GameSession) {
  const teamScores = calculateTeamScores(session).sort((a, b) => b.totalWealth - a.totalWealth);
  const allPlayerScores = teamScores
    .flatMap(t => t.playerScores)
    .sort((a, b) => b.totalWealth - a.totalWealth);

  return { teamScores, playerScores: allPlayerScores };
}

function getCompletedRounds(session: GameSession): (1 | 2 | 3)[] {
  const { phase } = session;
  // A round is "scoreable" once we're at or past its contribution phase
  const rounds: (1 | 2 | 3)[] = [];
  const order = ['r1-contribution', 'r2-contribution', 'r2-audit', 'r3-contribution', 'r3-audit', 'results'];
  const idx = order.indexOf(phase);

  if (idx >= 0) rounds.push(1); // at or past r1-contribution
  if (idx >= 1) rounds.push(2); // at or past r2-contribution
  if (idx >= 3) rounds.push(3); // at or past r3-contribution

  return rounds;
}

export function getSubmissionCounts(session: GameSession) {
  const { phase, players } = session;
  const expected = players.filter(p => p.displayName).length;

  // Count unique players who submitted for current phase (latest per player)
  const submitted = new Set(
    session.submissions
      .filter(s => s.phase === phase)
      .map(s => s.playerCode)
  ).size;

  return { submitted, expected };
}

export function getHighlights(session: GameSession) {
  const teamScores = calculateTeamScores(session);
  const highlights: { label: string; value: string }[] = [];

  if (teamScores.length === 0) return highlights;

  // Highest wealth team
  const topTeam = [...teamScores].sort((a, b) => b.totalWealth - a.totalWealth)[0];
  if (topTeam) {
    highlights.push({ label: 'Leading Team', value: `${topTeam.teamName} ($${topTeam.totalWealth.toLocaleString()})` });
  }

  // Top player
  const allPlayers = teamScores.flatMap(t => t.playerScores).sort((a, b) => b.totalWealth - a.totalWealth);
  if (allPlayers[0]) {
    highlights.push({ label: 'Top Player', value: `${allPlayers[0].displayName || allPlayers[0].playerCode} ($${allPlayers[0].totalWealth.toLocaleString()})` });
  }

  // Most audited player (across all rounds)
  const auditCounts = new Map<string, number>();
  for (const ts of teamScores) {
    for (const ps of ts.playerScores) {
      const total = ps.rounds.reduce((s, r) => s + r.auditsReceived, 0);
      if (total > 0) auditCounts.set(ps.displayName || ps.playerCode, total);
    }
  }
  if (auditCounts.size > 0) {
    const [name, count] = [...auditCounts.entries()].sort((a, b) => b[1] - a[1])[0];
    highlights.push({ label: 'Most Audited', value: `${name} (${count}x)` });
  }

  return highlights;
}
