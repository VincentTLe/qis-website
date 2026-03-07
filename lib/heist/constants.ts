import type { GameConfig, Phase } from './types';

export const DEFAULT_CONFIG: GameConfig = {
  endowmentPerRound: 10000,
  multiplier: 1.5,
  auditCost: 1000,
  auditDamage: 3000,
  allowedContributions: [0, 2000, 4000, 6000, 8000, 10000],
};

export const PHASE_ORDER: Phase[] = [
  'lobby',
  'r1-contribution',
  'r2-contribution',
  'r2-audit',
  'r3-contribution',
  'r3-audit',
  'results',
];

export const PHASE_LABELS: Record<Phase, string> = {
  'lobby': 'Lobby',
  'r1-contribution': 'Round 1 — Contribution',
  'r2-contribution': 'Round 2 — Contribution',
  'r2-audit': 'Round 2 — Audit',
  'r3-contribution': 'Round 3 — Contribution',
  'r3-audit': 'Round 3 — Audit',
  'results': 'Final Results',
};

export function phaseRound(phase: Phase): 1 | 2 | 3 | null {
  if (phase === 'r1-contribution') return 1;
  if (phase === 'r2-contribution' || phase === 'r2-audit') return 2;
  if (phase === 'r3-contribution' || phase === 'r3-audit') return 3;
  return null;
}

export function phaseType(phase: Phase): 'contribution' | 'audit' | null {
  if (phase.endsWith('-contribution')) return 'contribution';
  if (phase.endsWith('-audit')) return 'audit';
  return null;
}

export function contributionPhaseForRound(round: 1 | 2 | 3): Phase {
  return `r${round}-contribution` as Phase;
}

export function auditPhaseForRound(round: 2 | 3): Phase {
  return `r${round}-audit` as Phase;
}

export const TEAM_COLORS = [
  '#00e87b', // green
  '#3b82f6', // blue
  '#f59e0b', // amber
  '#ef4444', // red
  '#a855f7', // purple
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#f97316', // orange
];
