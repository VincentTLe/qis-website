"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Swords, Users, Target, Clock } from "lucide-react";
import { useHeistPoll } from "@/lib/heist/use-heist-poll";
import type { TeamScore, PlayerScore } from "@/lib/heist/types";
import { cn } from "@/lib/utils";

interface RosterTeam {
  teamCode: string;
  teamName: string;
  color?: string;
  joinedCount: number;
  maxSize: number;
  players: { playerCode: string; displayName?: string; joined: boolean }[];
}

interface ProjectorState {
  phase: string;
  phaseLabel: string;
  phaseOpen: boolean;
  view: "lobby" | "collecting" | "team-leaderboard" | "results" | "waiting";
  teams?: { id: string; teamCode: string; teamName: string; color?: string }[];
  // lobby
  roster?: RosterTeam[];
  totalJoined?: number;
  totalCapacity?: number;
  // collecting / team-leaderboard
  counts?: { submitted: number; expected: number };
  teamScores?: TeamScore[];
  // results
  leaderboard?: { teamScores: TeamScore[]; playerScores: PlayerScore[] };
  highlights?: { label: string; value: string }[];
}

export function ProjectorContent() {
  const { data } = useHeistPoll<ProjectorState>("/api/heist/state?role=projector", 1500);

  if (!data || !data.phase) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Swords className="mx-auto mb-4 text-accent-green" size={48} />
          <h1 className="text-4xl font-bold text-text-primary">The Heist</h1>
          <p className="mt-2 text-xl text-text-secondary">Waiting for game to start...</p>
        </div>
      </div>
    );
  }

  const { view, phaseLabel } = data;

  return (
    <div className="flex h-screen flex-col overflow-hidden p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Swords className="text-accent-green" size={36} />
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">The Heist</h1>
        </div>
        <p className="text-2xl font-bold text-accent-blue">{phaseLabel}</p>
      </div>

      {/* View switch */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {view === "lobby" && <LobbyView key="lobby" data={data} />}
          {view === "collecting" && <CollectingView key="collecting" data={data} />}
          {view === "team-leaderboard" && <TeamLeaderboardView key="tl" data={data} />}
          {view === "results" && <ResultsView key="results" data={data} />}
          {view === "waiting" && (
            <motion.div key="waiting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex h-full items-center justify-center">
              <p className="text-2xl text-text-secondary">Waiting...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function LobbyView({ data }: { data: ProjectorState }) {
  const { roster, totalJoined, totalCapacity } = data;
  if (!roster) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col">
      <div className="mb-6 text-center">
        <p className="text-3xl font-bold text-text-primary">
          <span className="text-accent-green">{totalJoined}</span> / {totalCapacity} players joined
        </p>
        <div className="mx-auto mt-3 h-3 w-96 overflow-hidden rounded-full bg-surface">
          <motion.div
            className="h-full rounded-full bg-accent-green"
            animate={{ width: `${totalCapacity ? (totalJoined! / totalCapacity) * 100 : 0}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <div className="grid flex-1 gap-6" style={{ gridTemplateColumns: `repeat(${Math.min(roster.length, 4)}, 1fr)` }}>
        {roster.map((team) => (
          <div key={team.teamCode} className="rounded-xl border border-border bg-surface/30 p-5">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-4 w-4 rounded-lg" style={{ backgroundColor: team.color ?? "#888" }} />
              <span className="text-xl font-bold text-text-primary">{team.teamName}</span>
              <span className="ml-auto font-mono text-sm text-text-tertiary">{team.joinedCount}/{team.maxSize}</span>
            </div>
            <div className="space-y-2">
              {team.players.map((p) => (
                <motion.div
                  key={p.playerCode}
                  initial={p.joined ? { opacity: 0, x: -10 } : {}}
                  animate={{ opacity: 1, x: 0 }}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2",
                    p.joined ? "bg-accent-green/5 border border-accent-green/20" : "border border-dashed border-border"
                  )}
                >
                  <span className="font-mono text-sm text-text-tertiary">{p.playerCode}</span>
                  {p.joined ? (
                    <span className="font-semibold text-text-primary">{p.displayName}</span>
                  ) : (
                    <span className="text-text-tertiary italic">waiting...</span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function CollectingView({ data }: { data: ProjectorState }) {
  const { phaseLabel, counts, teamScores } = data;
  const pct = counts?.expected ? (counts.submitted / counts.expected) * 100 : 0;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex h-full flex-col items-center justify-center">
      <Clock className="mb-6 text-accent-blue" size={64} />
      <p className="mb-4 text-4xl font-bold text-text-primary">{phaseLabel}</p>
      <p className="mb-8 text-6xl font-black text-accent-green">
        {counts?.submitted} <span className="text-3xl text-text-tertiary">/ {counts?.expected}</span>
      </p>
      <div className="h-4 w-96 overflow-hidden rounded-full bg-surface">
        <motion.div className="h-full rounded-full bg-accent-green" animate={{ width: `${pct}%` }} transition={{ duration: 0.5 }} />
      </div>
      <p className="mt-3 text-lg text-text-secondary">submissions received</p>

      {/* Show team leaderboard below if available (audit collecting phase) */}
      {teamScores && teamScores.length > 0 && (
        <div className="mt-12 w-full max-w-2xl">
          <TeamBars teamScores={teamScores} />
        </div>
      )}
    </motion.div>
  );
}

function TeamLeaderboardView({ data }: { data: ProjectorState }) {
  const { teamScores, counts } = data;
  if (!teamScores) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col">
      {counts && (
        <p className="mb-4 text-center font-mono text-sm text-text-tertiary">
          {counts.submitted}/{counts.expected} submitted
        </p>
      )}
      <h2 className="mb-6 text-center font-mono text-sm uppercase tracking-widest text-text-tertiary">
        <Users className="mr-1 inline" size={14} /> Team Standings
      </h2>
      <div className="flex-1 flex items-center">
        <div className="w-full max-w-3xl mx-auto">
          <TeamBars teamScores={teamScores} large />
        </div>
      </div>
    </motion.div>
  );
}

function ResultsView({ data }: { data: ProjectorState }) {
  const { leaderboard, highlights } = data;
  if (!leaderboard) return null;

  const maxTeamWealth = Math.max(...leaderboard.teamScores.map(t => t.totalWealth), 1);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex h-full gap-8 overflow-hidden">
      {/* Team Leaderboard */}
      <div className="flex-1">
        <h2 className="mb-4 font-mono text-sm uppercase tracking-widest text-text-tertiary">
          <Users className="mr-1 inline" size={14} /> Final Team Standings
        </h2>
        <div className="space-y-3">
          <AnimatePresence>
            {leaderboard.teamScores.map((team, i) => (
              <motion.div key={team.teamCode} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex items-center gap-4">
                <span className={cn("w-10 text-right font-mono text-2xl font-black", i === 0 ? "text-accent-green" : i === 1 ? "text-accent-blue" : i === 2 ? "text-purple-400" : "text-text-tertiary")}>
                  {i + 1}
                </span>
                <span className="h-8 w-8 rounded-lg" style={{ backgroundColor: team.color ?? "#888" }} />
                <div className="flex-1">
                  <div className="mb-1 flex items-baseline justify-between">
                    <span className="text-lg font-bold text-text-primary">{team.teamName}</span>
                    <span className="font-mono text-lg font-bold text-accent-green">${team.totalWealth.toLocaleString()}</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-surface">
                    <motion.div className="h-full rounded-full" style={{ backgroundColor: team.color ?? "#00e87b" }} initial={{ width: 0 }} animate={{ width: `${(team.totalWealth / maxTeamWealth) * 100}%` }} transition={{ duration: 0.8, ease: "easeOut" }} />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Right column */}
      <div className="w-80 flex-shrink-0 space-y-6">
        <div>
          <h2 className="mb-4 font-mono text-sm uppercase tracking-widest text-text-tertiary">
            <Target className="mr-1 inline" size={14} /> Top Players
          </h2>
          <div className="space-y-2">
            {leaderboard.playerScores.slice(0, 8).map((ps, i) => (
              <motion.div key={ps.playerCode} layout className="flex items-center justify-between rounded-lg bg-surface/60 px-4 py-2">
                <div className="flex items-center gap-3">
                  <span className={cn("font-mono text-sm font-bold", i === 0 ? "text-accent-green" : i === 1 ? "text-accent-blue" : i === 2 ? "text-purple-400" : "text-text-tertiary")}>#{i + 1}</span>
                  <span className="text-sm font-semibold text-text-primary">{ps.displayName || ps.playerCode}</span>
                  <span className="font-mono text-xs text-text-tertiary">{ps.teamCode}</span>
                </div>
                <span className="font-mono text-sm font-bold text-accent-green">${ps.totalWealth.toLocaleString()}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {highlights && highlights.length > 0 && (
          <div>
            <h2 className="mb-4 font-mono text-sm uppercase tracking-widest text-text-tertiary">Highlights</h2>
            <div className="space-y-3">
              {highlights.map((h) => (
                <div key={h.label} className="rounded-lg border border-border bg-surface/40 px-4 py-3">
                  <p className="font-mono text-xs uppercase text-text-tertiary">{h.label}</p>
                  <p className="text-lg font-bold text-text-primary">{h.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function TeamBars({ teamScores, large }: { teamScores: TeamScore[]; large?: boolean }) {
  const maxWealth = Math.max(...teamScores.map(t => t.totalWealth), 1);

  return (
    <div className={cn("space-y-4", large && "space-y-6")}>
      {teamScores.map((team, i) => (
        <motion.div key={team.teamCode} layout className="flex items-center gap-4">
          <span className={cn("w-10 text-right font-mono font-black", large ? "text-3xl" : "text-2xl", i === 0 ? "text-accent-green" : i === 1 ? "text-accent-blue" : i === 2 ? "text-purple-400" : "text-text-tertiary")}>
            {i + 1}
          </span>
          <span className={cn("rounded-lg", large ? "h-10 w-10" : "h-8 w-8")} style={{ backgroundColor: team.color ?? "#888" }} />
          <div className="flex-1">
            <div className="mb-1 flex items-baseline justify-between">
              <span className={cn("font-bold text-text-primary", large ? "text-2xl" : "text-lg")}>{team.teamName}</span>
              <span className={cn("font-mono font-bold text-accent-green", large ? "text-2xl" : "text-lg")}>${team.totalWealth.toLocaleString()}</span>
            </div>
            <div className={cn("overflow-hidden rounded-full bg-surface", large ? "h-5" : "h-3")}>
              <motion.div className="h-full rounded-full" style={{ backgroundColor: team.color ?? "#00e87b" }} animate={{ width: `${maxWealth > 0 ? (team.totalWealth / maxWealth) * 100 : 0}%` }} transition={{ duration: 0.8 }} />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
