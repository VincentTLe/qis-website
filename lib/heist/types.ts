export type Phase =
  | 'lobby'
  | 'r1-contribution'
  | 'r2-contribution'
  | 'r2-audit'
  | 'r3-contribution'
  | 'r3-audit'
  | 'results';

export interface GameConfig {
  endowmentPerRound: number;
  multiplier: number;
  auditCost: number;
  auditDamage: number;
  allowedContributions: number[];
}

export interface Team {
  id: string;
  teamCode: string;
  teamName: string;
  color?: string;
  maxSize?: number;
  sortOrder?: number;
}

export interface Player {
  id: string;
  teamId: string;
  playerCode: string;
  displayName?: string;
  token?: string;
}

export interface Submission {
  id: string;
  playerCode: string;
  phase: Phase;
  type: 'contribution' | 'audit';
  amount?: number;
  auditChoice?: 'no_audit' | 'audit_someone';
  targetPlayerCode?: string;
  submittedAt: string;
}

export interface GameSession {
  id: string;
  name: string;
  phase: Phase;
  phaseOpen: boolean;
  config: GameConfig;
  teams: Team[];
  players: Player[];
  submissions: Submission[];
  createdAt: string;
}

// Derived scoring types
export interface PlayerRoundScore {
  playerCode: string;
  round: 1 | 2 | 3;
  contribution: number;
  teamContributionTotal: number;
  multipliedPool: number;
  sharePerPlayer: number;
  baseRoundWealth: number;
  auditCostPaid: number;
  auditDamageReceived: number;
  auditsReceived: number;
  netRoundWealth: number;
}

export interface PlayerScore {
  playerCode: string;
  displayName?: string;
  teamCode: string;
  teamName: string;
  rounds: PlayerRoundScore[];
  totalWealth: number;
}

export interface TeamScore {
  teamCode: string;
  teamName: string;
  color?: string;
  totalWealth: number;
  playerScores: PlayerScore[];
}
