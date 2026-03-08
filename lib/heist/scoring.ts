import type { GameSession, PlayerRoundScore, PlayerScore, TeamScore, Player } from './types';
import { contributionPhaseForRound, auditPhaseForRound, DEFAULT_CONFIG } from './constants';

function getLatestSubmission(session: GameSession, playerCode: string, phase: string) {
  const subs = session.submissions
    .filter(s => s.playerCode === playerCode && s.phase === phase)
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  return subs[0] ?? null;
}

function emptyRoundScore(playerCode: string, round: 1 | 2 | 3): PlayerRoundScore {
  return {
    playerCode,
    round,
    contribution: 0,
    teamContributionTotal: 0,
    multipliedPool: 0,
    sharePerPlayer: 0,
    baseRoundWealth: 0,
    auditCostPaid: 0,
    auditDamageReceived: 0,
    auditRedistributionReceived: 0,
    auditTeamBonusReceived: 0,
    auditBonusReceived: 0,
    auditsReceived: 0,
    successfulAudits: 0,
    netRoundWealth: 0,
  };
}

function getAuditSettings(session: GameSession) {
  return {
    auditCost: session.config.auditCost ?? DEFAULT_CONFIG.auditCost,
    auditDamage: session.config.auditDamage ?? DEFAULT_CONFIG.auditDamage,
    auditSuccessThreshold:
      session.config.auditSuccessThreshold ?? DEFAULT_CONFIG.auditSuccessThreshold,
    auditSuccessBonus: session.config.auditSuccessBonus ?? DEFAULT_CONFIG.auditSuccessBonus,
    auditTeamBonus: session.config.auditTeamBonus ?? DEFAULT_CONFIG.auditTeamBonus,
  };
}

function getScoringPlayers(teamPlayers: Player[]) {
  const joinedPlayers = teamPlayers.filter(player => player.displayName);
  return joinedPlayers.length > 0 ? joinedPlayers : teamPlayers;
}

function getRoundAuditOutcome(
  session: GameSession,
  teamPlayers: Player[],
  round: 2 | 3
) {
  const auditPhase = auditPhaseForRound(round);
  const contributionPhase = contributionPhaseForRound(round);
  const { auditDamage, auditSuccessThreshold, auditSuccessBonus, auditTeamBonus } = getAuditSettings(session);
  const auditsReceivedCount = new Map<string, number>();
  const auditDamageReceived = new Map<string, number>();
  const auditRedistributionReceived = new Map<string, number>();
  const auditTeamBonusReceived = new Map<string, number>();
  const auditBonusReceived = new Map<string, number>();
  const successfulAudits = new Map<string, number>();
  const teamPlayerCodes = new Set(teamPlayers.map(player => player.playerCode));

  for (const player of teamPlayers) {
    auditsReceivedCount.set(player.playerCode, 0);
    auditDamageReceived.set(player.playerCode, 0);
    auditRedistributionReceived.set(player.playerCode, 0);
    auditTeamBonusReceived.set(player.playerCode, 0);
    auditBonusReceived.set(player.playerCode, 0);
    successfulAudits.set(player.playerCode, 0);
  }

  const auditsByTarget = new Map<string, string[]>();
  for (const player of teamPlayers) {
    const auditSubmission = getLatestSubmission(session, player.playerCode, auditPhase);
    if (
      auditSubmission?.auditChoice !== 'audit_someone' ||
      !auditSubmission.targetPlayerCode ||
      !teamPlayerCodes.has(auditSubmission.targetPlayerCode)
    ) {
      continue;
    }

    const currentCount = auditsReceivedCount.get(auditSubmission.targetPlayerCode) ?? 0;
    auditsReceivedCount.set(auditSubmission.targetPlayerCode, currentCount + 1);

    const auditors = auditsByTarget.get(auditSubmission.targetPlayerCode) ?? [];
    auditors.push(player.playerCode);
    auditsByTarget.set(auditSubmission.targetPlayerCode, auditors);
  }

  for (const [targetPlayerCode, auditors] of auditsByTarget.entries()) {
    const contribution =
      getLatestSubmission(session, targetPlayerCode, contributionPhase)?.amount ?? 0;
    const isAuditSuccessful = contribution < auditSuccessThreshold;

    if (!isAuditSuccessful) {
      continue;
    }

    auditDamageReceived.set(targetPlayerCode, auditDamage);

    const redistributionRecipients = getScoringPlayers(teamPlayers).filter(
      player => player.playerCode !== targetPlayerCode
    );
    const redistributionShare =
      redistributionRecipients.length > 0 ? auditDamage / redistributionRecipients.length : 0;
    const teamBonusShare =
      redistributionRecipients.length > 0 ? auditTeamBonus / redistributionRecipients.length : 0;
    for (const recipient of redistributionRecipients) {
      const current = auditRedistributionReceived.get(recipient.playerCode) ?? 0;
      auditRedistributionReceived.set(recipient.playerCode, current + redistributionShare);

      const currentTeamBonus = auditTeamBonusReceived.get(recipient.playerCode) ?? 0;
      auditTeamBonusReceived.set(recipient.playerCode, currentTeamBonus + teamBonusShare);
    }

    const bonusShare = auditors.length > 0 ? auditSuccessBonus / auditors.length : 0;
    for (const auditorPlayerCode of auditors) {
      const currentBonus = auditBonusReceived.get(auditorPlayerCode) ?? 0;
      auditBonusReceived.set(auditorPlayerCode, currentBonus + bonusShare);

      const currentSuccesses = successfulAudits.get(auditorPlayerCode) ?? 0;
      successfulAudits.set(auditorPlayerCode, currentSuccesses + 1);
    }
  }

  return {
    auditsReceivedCount,
    auditDamageReceived,
    auditRedistributionReceived,
    auditTeamBonusReceived,
    auditBonusReceived,
    successfulAudits,
  };
}

function isRoundCompleted(session: GameSession, round: 1 | 2 | 3) {
  const { phase, phaseOpen } = session;

  if (round === 1) {
    if (phase === 'r1-contribution') return !phaseOpen;
    return phase !== 'lobby';
  }

  if (round === 2) {
    if (phase === 'r2-audit') return !phaseOpen;
    return phase === 'r3-contribution' || phase === 'r3-audit' || phase === 'results';
  }

  if (phase === 'r3-audit') return !phaseOpen;
  return phase === 'results';
}

export function calculatePlayerRound(
  session: GameSession,
  playerCode: string,
  round: 1 | 2 | 3
): PlayerRoundScore {
  const { config, players, teams } = session;
  const player = players.find(p => p.playerCode === playerCode);
  if (!player) return emptyRoundScore(playerCode, round);
  const team = teams.find(t => t.id === player.teamId);
  if (!team) return emptyRoundScore(playerCode, round);
  const teammates = getScoringPlayers(players.filter(p => p.teamId === team.id));
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
  let auditRedistributionReceived = 0;
  let auditTeamBonusReceived = 0;
  let auditBonusReceived = 0;
  let auditsReceived = 0;
  let successfulAudits = 0;

  if (round === 2 || round === 3) {
    const auditPhase = auditPhaseForRound(round);
    const { auditCost } = getAuditSettings(session);

    // Did this player audit someone?
    const myAudit = getLatestSubmission(session, playerCode, auditPhase);
    if (myAudit?.auditChoice === 'audit_someone') {
      auditCostPaid = auditCost;
    }

    const outcome = getRoundAuditOutcome(session, teammates, round);
    auditsReceived = outcome.auditsReceivedCount.get(playerCode) ?? 0;
    auditDamageReceived = outcome.auditDamageReceived.get(playerCode) ?? 0;
    auditRedistributionReceived = outcome.auditRedistributionReceived.get(playerCode) ?? 0;
    auditTeamBonusReceived = outcome.auditTeamBonusReceived.get(playerCode) ?? 0;
    auditBonusReceived = outcome.auditBonusReceived.get(playerCode) ?? 0;
    successfulAudits = outcome.successfulAudits.get(playerCode) ?? 0;
  }

  const netRoundWealth =
    baseRoundWealth - auditCostPaid - auditDamageReceived + auditRedistributionReceived + auditTeamBonusReceived + auditBonusReceived;

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
    auditRedistributionReceived,
    auditTeamBonusReceived,
    auditBonusReceived,
    auditsReceived,
    successfulAudits,
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
    const teamPlayers = getScoringPlayers(session.players.filter(p => p.teamId === team.id));
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
  const rounds: (1 | 2 | 3)[] = [];

  if (isRoundCompleted(session, 1)) rounds.push(1);
  if (isRoundCompleted(session, 2)) rounds.push(2);
  if (isRoundCompleted(session, 3)) rounds.push(3);

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
