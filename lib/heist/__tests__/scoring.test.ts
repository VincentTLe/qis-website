/**
 * Comprehensive test cases for The Heist scoring engine.
 * Tests simulate multi-team, multi-round games with various strategies.
 *
 * Run with: npx tsx lib/heist/__tests__/scoring.test.ts
 */

import type { GameSession, Phase } from '../types';
import { DEFAULT_CONFIG } from '../constants';
import {
  calculatePlayerRound,
  calculatePlayerScore,
  calculateTeamScores,
  getLeaderboard,
  getSubmissionCounts,
  getHighlights,
} from '../scoring';

// ===== TEST HARNESS =====
let passed = 0;
let failed = 0;
const failures: string[] = [];

function assert(condition: boolean, message: string) {
  if (condition) {
    passed++;
  } else {
    failed++;
    failures.push(message);
    console.error(`  FAIL: ${message}`);
  }
}

function assertApprox(actual: number, expected: number, tolerance: number, message: string) {
  assert(Math.abs(actual - expected) <= tolerance, `${message} (expected ~${expected}, got ${actual})`);
}

function describe(name: string, fn: () => void) {
  console.log(`\n=== ${name} ===`);
  fn();
}

// ===== FIXTURE BUILDERS =====
let submissionId = 0;

function makeSession(overrides: Partial<GameSession> = {}): GameSession {
  return {
    id: 'session-1',
    name: 'Test Heist',
    phase: 'results' as Phase,
    phaseOpen: false,
    config: { ...DEFAULT_CONFIG },
    teams: [],
    players: [],
    submissions: [],
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

function addTeam(session: GameSession, teamCode: string, teamName: string, playerCount: number, color?: string) {
  const teamId = `team-${teamCode}`;
  session.teams.push({ id: teamId, teamCode, teamName, color, maxSize: playerCount, sortOrder: session.teams.length });
  for (let i = 1; i <= playerCount; i++) {
    session.players.push({
      id: `player-${teamCode}${i}`,
      teamId,
      playerCode: `${teamCode}${i}`,
      displayName: `Player ${teamCode}${i}`,
    });
  }
}

function addContribution(session: GameSession, playerCode: string, round: 1 | 2 | 3, amount: number) {
  session.submissions.push({
    id: `sub-${++submissionId}`,
    playerCode,
    phase: `r${round}-contribution` as Phase,
    type: 'contribution',
    amount,
    submittedAt: new Date().toISOString(),
  });
}

function addAudit(session: GameSession, playerCode: string, round: 2 | 3, choice: 'no_audit' | 'audit_someone', target?: string) {
  session.submissions.push({
    id: `sub-${++submissionId}`,
    playerCode,
    phase: `r${round}-audit` as Phase,
    type: 'audit',
    auditChoice: choice,
    targetPlayerCode: target,
    submittedAt: new Date().toISOString(),
  });
}

// =====================================================
// TEST CASE 1: Basic 2-team, 3-round game — all cooperate
// =====================================================
describe('TC1: Full cooperation — all contribute max', () => {
  const session = makeSession();
  addTeam(session, 'A', 'Alpha', 4, '#00e87b');
  addTeam(session, 'B', 'Beta', 4, '#3b82f6');

  // All 8 players contribute 10000 every round
  for (const team of ['A', 'B']) {
    for (let p = 1; p <= 4; p++) {
      for (const r of [1, 2, 3] as const) {
        addContribution(session, `${team}${p}`, r, 10000);
      }
      // No audits (skip audit or contribute 'no_audit')
      for (const r of [2, 3] as const) {
        addAudit(session, `${team}${p}`, r, 'no_audit');
      }
    }
  }

  // Each round: endowment=10000, contribution=10000, team total=40000, pool=60000, share=15000
  // net = 10000 - 10000 + 15000 = 15000 per round
  // total = 45000
  const scoreA1 = calculatePlayerRound(session, 'A1', 1);
  assert(scoreA1.contribution === 10000, 'TC1: A1 contributed 10000');
  assert(scoreA1.teamContributionTotal === 40000, 'TC1: team total = 40000');
  assertApprox(scoreA1.multipliedPool, 60000, 0.01, 'TC1: multiplied pool = 60000');
  assertApprox(scoreA1.sharePerPlayer, 15000, 0.01, 'TC1: share per player = 15000');
  assertApprox(scoreA1.netRoundWealth, 15000, 0.01, 'TC1: round net = 15000');

  const totalA1 = calculatePlayerScore(session, 'A1');
  assertApprox(totalA1.totalWealth, 45000, 0.01, 'TC1: A1 total wealth = 45000');

  const teamScores = calculateTeamScores(session);
  const alphaScore = teamScores.find(t => t.teamCode === 'A')!;
  assertApprox(alphaScore.totalWealth, 180000, 0.01, 'TC1: Team Alpha total = 180000');

  // Both teams should be equal
  const betaScore = teamScores.find(t => t.teamCode === 'B')!;
  assertApprox(betaScore.totalWealth, alphaScore.totalWealth, 0.01, 'TC1: Teams equal when all cooperate');
});

// =====================================================
// TEST CASE 2: Free-rider scenario — one player contributes 0
// =====================================================
describe('TC2: Free-rider — A1 contributes 0, others contribute max', () => {
  const session = makeSession();
  addTeam(session, 'A', 'Alpha', 4);

  // A1 contributes 0 every round, others contribute 10000
  for (const r of [1, 2, 3] as const) {
    addContribution(session, 'A1', r, 0);
    addContribution(session, 'A2', r, 10000);
    addContribution(session, 'A3', r, 10000);
    addContribution(session, 'A4', r, 10000);
  }
  // No audits
  for (let p = 1; p <= 4; p++) {
    for (const r of [2, 3] as const) {
      addAudit(session, `A${p}`, r, 'no_audit');
    }
  }

  // Team total = 30000, pool = 45000, share = 11250
  // Free-rider: 10000 - 0 + 11250 = 21250 per round
  // Cooperator: 10000 - 10000 + 11250 = 11250 per round
  const freerider = calculatePlayerRound(session, 'A1', 1);
  assertApprox(freerider.netRoundWealth, 21250, 0.01, 'TC2: Free-rider gets 21250/round');

  const cooperator = calculatePlayerRound(session, 'A2', 1);
  assertApprox(cooperator.netRoundWealth, 11250, 0.01, 'TC2: Cooperator gets 11250/round');

  // Free-rider earns more
  const freeScore = calculatePlayerScore(session, 'A1');
  const coopScore = calculatePlayerScore(session, 'A2');
  assert(freeScore.totalWealth > coopScore.totalWealth, 'TC2: Free-rider earns more than cooperators');
  assertApprox(freeScore.totalWealth, 63750, 0.01, 'TC2: Free-rider total = 63750');
  assertApprox(coopScore.totalWealth, 33750, 0.01, 'TC2: Cooperator total = 33750');
});

// =====================================================
// TEST CASE 3: Audit mechanic — player audits the free-rider
// =====================================================
describe('TC3: Audit punishment — A2 audits free-rider A1 in rounds 2 & 3', () => {
  const session = makeSession();
  addTeam(session, 'A', 'Alpha', 4);

  for (const r of [1, 2, 3] as const) {
    addContribution(session, 'A1', r, 0);
    addContribution(session, 'A2', r, 10000);
    addContribution(session, 'A3', r, 10000);
    addContribution(session, 'A4', r, 10000);
  }

  // Round 2: A2 audits A1
  addAudit(session, 'A1', 2, 'no_audit');
  addAudit(session, 'A2', 2, 'audit_someone', 'A1');
  addAudit(session, 'A3', 2, 'no_audit');
  addAudit(session, 'A4', 2, 'no_audit');

  // Round 3: A2 and A3 both audit A1
  addAudit(session, 'A1', 3, 'no_audit');
  addAudit(session, 'A2', 3, 'audit_someone', 'A1');
  addAudit(session, 'A3', 3, 'audit_someone', 'A1');
  addAudit(session, 'A4', 3, 'no_audit');

  // Round 1: no audit → same as TC2
  const r1 = calculatePlayerRound(session, 'A1', 1);
  assertApprox(r1.netRoundWealth, 21250, 0.01, 'TC3: R1 free-rider = 21250 (no audit)');

  // Round 2: A1 audited once → damage = 3000
  // base = 21250, audit damage = 3000, net = 18250
  const r2A1 = calculatePlayerRound(session, 'A1', 2);
  assert(r2A1.auditsReceived === 1, 'TC3: A1 audited 1x in R2');
  assertApprox(r2A1.auditDamageReceived, 3000, 0.01, 'TC3: A1 audit damage R2 = 3000');
  assertApprox(r2A1.netRoundWealth, 18250, 0.01, 'TC3: A1 R2 net = 18250');

  // A2 paid audit cost in R2
  const r2A2 = calculatePlayerRound(session, 'A2', 2);
  assert(r2A2.auditCostPaid === 1000, 'TC3: A2 audit cost R2 = 1000');
  assertApprox(r2A2.netRoundWealth, 10250, 0.01, 'TC3: A2 R2 net = 10250');

  // Round 3: A1 audited twice → damage = 6000
  const r3A1 = calculatePlayerRound(session, 'A1', 3);
  assert(r3A1.auditsReceived === 2, 'TC3: A1 audited 2x in R3');
  assertApprox(r3A1.auditDamageReceived, 6000, 0.01, 'TC3: A1 audit damage R3 = 6000');
  assertApprox(r3A1.netRoundWealth, 15250, 0.01, 'TC3: A1 R3 net = 15250');

  // With heavy audit, free-rider may not lead anymore
  const scores = getLeaderboard(session);
  const a1Score = scores.playerScores.find(s => s.playerCode === 'A1')!;
  const a4Score = scores.playerScores.find(s => s.playerCode === 'A4')!;
  // A1 total: 21250 + 18250 + 15250 = 54750
  // A4 total: 11250*3 = 33750 (no audit cost, no audit damage)
  assertApprox(a1Score.totalWealth, 54750, 0.01, 'TC3: A1 total = 54750');
  assertApprox(a4Score.totalWealth, 33750, 0.01, 'TC3: A4 total = 33750');
});

// =====================================================
// TEST CASE 4: Multiple teams competing — different strategies
// =====================================================
describe('TC4: 4 teams, mixed strategies', () => {
  const session = makeSession();
  addTeam(session, 'A', 'Cooperators', 3);   // All contribute max
  addTeam(session, 'B', 'Free-riders', 3);    // All contribute 0
  addTeam(session, 'C', 'Mixed', 3);          // 2 cooperate, 1 free-rides
  addTeam(session, 'D', 'Auditors', 3);       // Cooperate + audit each other

  for (const r of [1, 2, 3] as const) {
    // Team A: all max
    for (let i = 1; i <= 3; i++) addContribution(session, `A${i}`, r, 10000);
    // Team B: all 0
    for (let i = 1; i <= 3; i++) addContribution(session, `B${i}`, r, 0);
    // Team C: C1 free-rides, C2/C3 cooperate
    addContribution(session, 'C1', r, 0);
    addContribution(session, 'C2', r, 10000);
    addContribution(session, 'C3', r, 10000);
    // Team D: all max
    for (let i = 1; i <= 3; i++) addContribution(session, `D${i}`, r, 10000);
  }

  // Audits: Team D audits internally (wasteful!)
  for (const r of [2, 3] as const) {
    for (let i = 1; i <= 3; i++) {
      addAudit(session, `A${i}`, r, 'no_audit');
      addAudit(session, `B${i}`, r, 'no_audit');
      addAudit(session, `C${i}`, r, 'no_audit');
    }
    // D1 audits D2, D2 audits D3, D3 audits D1
    addAudit(session, 'D1', r, 'audit_someone', 'D2');
    addAudit(session, 'D2', r, 'audit_someone', 'D3');
    addAudit(session, 'D3', r, 'audit_someone', 'D1');
  }

  const leaderboard = getLeaderboard(session);

  // Team A (all cooperate): each player gets 10000-10000 + (30000*1.5)/3 = 15000/round = 45000 total
  const teamA = leaderboard.teamScores.find(t => t.teamCode === 'A')!;
  assertApprox(teamA.totalWealth, 135000, 0.01, 'TC4: Team A (cooperators) = 135000');

  // Team B (all defect): each player gets 10000-0 + (0*1.5)/3 = 10000/round = 30000 total
  const teamB = leaderboard.teamScores.find(t => t.teamCode === 'B')!;
  assertApprox(teamB.totalWealth, 90000, 0.01, 'TC4: Team B (free-riders) = 90000');

  // Team C (mixed): total contrib=20000, pool=30000, share=10000
  // C1 (free-rider): 10000-0+10000 = 20000/round = 60000
  // C2/C3: 10000-10000+10000 = 10000/round = 30000
  const teamC = leaderboard.teamScores.find(t => t.teamCode === 'C')!;
  assertApprox(teamC.totalWealth, 120000, 0.01, 'TC4: Team C (mixed) = 120000');

  // Team D (cooperate but audit): base = 15000/round, but audit cost 1000 and damage 3000 each round 2&3
  // R1: 15000 each
  // R2&R3: 15000 - 1000(cost) - 3000(damage) = 11000 each
  // Total per player: 15000 + 11000 + 11000 = 37000
  const teamD = leaderboard.teamScores.find(t => t.teamCode === 'D')!;
  assertApprox(teamD.totalWealth, 111000, 0.01, 'TC4: Team D (auditors) = 111000');

  // Cooperators should win
  assert(teamA.totalWealth > teamB.totalWealth, 'TC4: Cooperators beat free-riders as a team');
  assert(teamA.totalWealth > teamD.totalWealth, 'TC4: Internal auditing hurts the team');

  // But free-rider C1 individually does very well
  const c1Score = leaderboard.playerScores.find(s => s.playerCode === 'C1')!;
  const a1Score = leaderboard.playerScores.find(s => s.playerCode === 'A1')!;
  assert(c1Score.totalWealth > a1Score.totalWealth, 'TC4: Free-rider C1 beats cooperator A1 individually');
});

// =====================================================
// TEST CASE 5: Edge case — no submissions at all
// =====================================================
describe('TC5: No submissions — everyone defaults to 0 contribution', () => {
  const session = makeSession();
  addTeam(session, 'A', 'Alpha', 2);

  // No submissions
  const score = calculatePlayerRound(session, 'A1', 1);
  assertApprox(score.contribution, 0, 0, 'TC5: Default contribution = 0');
  assertApprox(score.teamContributionTotal, 0, 0, 'TC5: Team total = 0');
  assertApprox(score.netRoundWealth, 10000, 0.01, 'TC5: Keeps endowment = 10000');
});

// =====================================================
// TEST CASE 6: Edge case — single-player team
// =====================================================
describe('TC6: Single-player team', () => {
  const session = makeSession();
  addTeam(session, 'A', 'Solo', 1);

  addContribution(session, 'A1', 1, 10000);
  addContribution(session, 'A1', 2, 10000);
  addContribution(session, 'A1', 3, 10000);
  addAudit(session, 'A1', 2, 'no_audit');
  addAudit(session, 'A1', 3, 'no_audit');

  // Solo: endowment - contrib + (contrib * 1.5) / 1 = 10000 - 10000 + 15000 = 15000
  const round = calculatePlayerRound(session, 'A1', 1);
  assertApprox(round.netRoundWealth, 15000, 0.01, 'TC6: Solo player gets full multiplied pool');

  const total = calculatePlayerScore(session, 'A1');
  assertApprox(total.totalWealth, 45000, 0.01, 'TC6: Solo total = 45000');
});

// =====================================================
// TEST CASE 7: Edge case — player not found (defensive)
// =====================================================
describe('TC7: Missing player gracefully returns zero score', () => {
  const session = makeSession();
  addTeam(session, 'A', 'Alpha', 2);

  const score = calculatePlayerRound(session, 'NONEXISTENT', 1);
  assert(score.netRoundWealth === 0, 'TC7: Missing player round = 0');

  const total = calculatePlayerScore(session, 'NONEXISTENT');
  assert(total.totalWealth === 0, 'TC7: Missing player total = 0');
});

// =====================================================
// TEST CASE 8: Duplicate submissions — latest wins
// =====================================================
describe('TC8: Duplicate submissions — last one counts', () => {
  const session = makeSession();
  addTeam(session, 'A', 'Alpha', 2);

  // A1 submits twice: first 0, then 10000
  session.submissions.push({
    id: `sub-${++submissionId}`,
    playerCode: 'A1',
    phase: 'r1-contribution' as Phase,
    type: 'contribution',
    amount: 0,
    submittedAt: '2026-01-01T00:00:00Z',
  });
  session.submissions.push({
    id: `sub-${++submissionId}`,
    playerCode: 'A1',
    phase: 'r1-contribution' as Phase,
    type: 'contribution',
    amount: 10000,
    submittedAt: '2026-01-01T00:01:00Z',
  });
  addContribution(session, 'A2', 1, 10000);

  const round = calculatePlayerRound(session, 'A1', 1);
  assert(round.contribution === 10000, 'TC8: Latest submission (10000) wins over first (0)');
});

// =====================================================
// TEST CASE 9: Partial rounds — game ended mid-way
// =====================================================
describe('TC9: Partial game — only round 1 completed', () => {
  const session = makeSession({ phase: 'r2-contribution' as Phase });
  addTeam(session, 'A', 'Alpha', 2);
  addContribution(session, 'A1', 1, 6000);
  addContribution(session, 'A2', 1, 4000);

  // At r2-contribution: both round 1 and 2 are scoreable
  // Round 2 has no submissions yet, so everyone keeps endowment
  const total = calculatePlayerScore(session, 'A1');
  assert(total.rounds.length === 2, 'TC9: 2 rounds scoreable at r2-contribution');
  // R1: team total=10000, pool=15000, share=7500, A1=10000-6000+7500=11500
  // R2: no submissions, team total=0, pool=0, share=0, A1=10000-0+0=10000
  assertApprox(total.totalWealth, 21500, 0.01, 'TC9: A1 partial game total = 21500');
});

// =====================================================
// TEST CASE 10: Submission counts
// =====================================================
describe('TC10: Submission counts', () => {
  const session = makeSession({ phase: 'r1-contribution' as Phase });
  addTeam(session, 'A', 'Alpha', 4);
  addTeam(session, 'B', 'Beta', 4);

  addContribution(session, 'A1', 1, 10000);
  addContribution(session, 'A2', 1, 10000);
  // A3 and A4 haven't submitted. B team hasn't submitted.

  const counts = getSubmissionCounts(session);
  assert(counts.expected === 8, 'TC10: Expected 8 submissions (all players)');
  assert(counts.submitted === 2, 'TC10: 2 players submitted');
});

// =====================================================
// TEST CASE 11: Highlights
// =====================================================
describe('TC11: Highlights with clear leader', () => {
  const session = makeSession();
  addTeam(session, 'A', 'Heroes', 2);
  addTeam(session, 'B', 'Villains', 2);

  // Team A cooperates, Team B defects
  for (const r of [1, 2, 3] as const) {
    addContribution(session, 'A1', r, 10000);
    addContribution(session, 'A2', r, 10000);
    addContribution(session, 'B1', r, 0);
    addContribution(session, 'B2', r, 0);
  }
  for (const r of [2, 3] as const) {
    addAudit(session, 'A1', r, 'no_audit');
    addAudit(session, 'A2', r, 'no_audit');
    addAudit(session, 'B1', r, 'audit_someone', 'B2');
    addAudit(session, 'B2', r, 'no_audit');
  }

  const highlights = getHighlights(session);
  assert(highlights.length >= 2, 'TC11: At least 2 highlights');
  assert(highlights.some(h => h.label === 'Leading Team'), 'TC11: Has leading team highlight');
  assert(highlights.some(h => h.label === 'Top Player'), 'TC11: Has top player highlight');

  // B2 should be most audited (audited by B1 in rounds 2 & 3)
  const mostAudited = highlights.find(h => h.label === 'Most Audited');
  assert(!!mostAudited, 'TC11: Has most audited highlight');
  if (mostAudited) {
    assert(mostAudited.value.includes('2x'), 'TC11: B2 audited 2x');
  }
});

// =====================================================
// TEST CASE 12: Large game — 6 teams x 5 players = 30 players
// =====================================================
describe('TC12: Large game — 6 teams x 5 players', () => {
  const session = makeSession();
  const teamNames = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta'];
  const teamCodes = ['A', 'B', 'C', 'D', 'E', 'F'];

  for (let t = 0; t < 6; t++) {
    addTeam(session, teamCodes[t], teamNames[t], 5);
  }

  // All 30 players contribute random amounts each round
  const contributions = [0, 2000, 4000, 6000, 8000, 10000];
  for (const r of [1, 2, 3] as const) {
    for (let t = 0; t < 6; t++) {
      for (let p = 1; p <= 5; p++) {
        const amount = contributions[(t * 5 + p + r) % contributions.length];
        addContribution(session, `${teamCodes[t]}${p}`, r, amount);
      }
    }
  }
  for (const r of [2, 3] as const) {
    for (let t = 0; t < 6; t++) {
      for (let p = 1; p <= 5; p++) {
        addAudit(session, `${teamCodes[t]}${p}`, r, 'no_audit');
      }
    }
  }

  const leaderboard = getLeaderboard(session);
  assert(leaderboard.teamScores.length === 6, 'TC12: 6 teams in leaderboard');
  assert(leaderboard.playerScores.length === 30, 'TC12: 30 players in leaderboard');

  // All totals should be positive
  for (const ps of leaderboard.playerScores) {
    assert(ps.totalWealth > 0, `TC12: ${ps.playerCode} has positive wealth`);
  }

  // Leaderboard should be sorted
  for (let i = 0; i < leaderboard.teamScores.length - 1; i++) {
    assert(
      leaderboard.teamScores[i].totalWealth >= leaderboard.teamScores[i + 1].totalWealth,
      `TC12: Team leaderboard sorted at position ${i}`
    );
  }
  for (let i = 0; i < leaderboard.playerScores.length - 1; i++) {
    assert(
      leaderboard.playerScores[i].totalWealth >= leaderboard.playerScores[i + 1].totalWealth,
      `TC12: Player leaderboard sorted at position ${i}`
    );
  }
});

// =====================================================
// TEST CASE 13: Mutual audit destruction
// =====================================================
describe('TC13: Mutual audit — everyone audits everyone', () => {
  const session = makeSession();
  addTeam(session, 'A', 'Chaos', 3);

  for (const r of [1, 2, 3] as const) {
    for (let p = 1; p <= 3; p++) {
      addContribution(session, `A${p}`, r, 10000);
    }
  }

  // Round 2: A1→A2, A2→A3, A3→A1
  addAudit(session, 'A1', 2, 'audit_someone', 'A2');
  addAudit(session, 'A2', 2, 'audit_someone', 'A3');
  addAudit(session, 'A3', 2, 'audit_someone', 'A1');

  // Round 3: A1→A3, A2→A1, A3→A2
  addAudit(session, 'A1', 3, 'audit_someone', 'A3');
  addAudit(session, 'A2', 3, 'audit_someone', 'A1');
  addAudit(session, 'A3', 3, 'audit_someone', 'A2');

  // Each player: audited once per audit round, pays audit cost once per audit round
  // R1: 10000-10000 + (30000*1.5)/3 = 15000
  // R2: 15000 - 1000(cost) - 3000(damage) = 11000
  // R3: same = 11000
  // Total: 37000
  for (let p = 1; p <= 3; p++) {
    const score = calculatePlayerScore(session, `A${p}`);
    assertApprox(score.totalWealth, 37000, 0.01, `TC13: A${p} total = 37000 (mutual destruction)`);
  }

  // All players should have equal wealth
  const scores = calculateTeamScores(session);
  const team = scores[0];
  const wealths = team.playerScores.map(p => p.totalWealth);
  assert(new Set(wealths.map(w => Math.round(w))).size === 1, 'TC13: All players equal wealth');
});

// =====================================================
// TEST CASE 14: Asymmetric audit — one player ganged up on
// =====================================================
describe('TC14: Gang audit — A2 and A3 both audit A1 every round', () => {
  const session = makeSession();
  addTeam(session, 'A', 'Alpha', 3);

  for (const r of [1, 2, 3] as const) {
    for (let p = 1; p <= 3; p++) {
      addContribution(session, `A${p}`, r, 10000);
    }
  }

  for (const r of [2, 3] as const) {
    addAudit(session, 'A1', r, 'no_audit');
    addAudit(session, 'A2', r, 'audit_someone', 'A1');
    addAudit(session, 'A3', r, 'audit_someone', 'A1');
  }

  // A1 R2&R3: base 15000 - 0(cost) - 6000(2x damage) = 9000
  // A2 R2&R3: base 15000 - 1000(cost) - 0(damage) = 14000
  // A3 R2&R3: same as A2 = 14000
  const a1 = calculatePlayerScore(session, 'A1');
  const a2 = calculatePlayerScore(session, 'A2');
  const a3 = calculatePlayerScore(session, 'A3');

  // A1: 15000 + 9000 + 9000 = 33000
  // A2: 15000 + 14000 + 14000 = 43000
  // A3: same = 43000
  assertApprox(a1.totalWealth, 33000, 0.01, 'TC14: Ganged-up A1 = 33000');
  assertApprox(a2.totalWealth, 43000, 0.01, 'TC14: Auditor A2 = 43000');
  assertApprox(a3.totalWealth, 43000, 0.01, 'TC14: Auditor A3 = 43000');
  assert(a1.totalWealth < a2.totalWealth, 'TC14: Ganged-up player loses wealth');
});

// =====================================================
// RESULTS
// =====================================================
console.log('\n========================================');
console.log(`Results: ${passed} passed, ${failed} failed`);
if (failures.length > 0) {
  console.log('\nFailures:');
  for (const f of failures) console.log(`  - ${f}`);
  process.exit(1);
} else {
  console.log('All tests passed!');
  process.exit(0);
}
