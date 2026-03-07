"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Trophy, Users } from "lucide-react";
import Link from "next/link";
import type { GameSession, TeamScore, PlayerScore } from "@/lib/heist/types";
import { PHASE_LABELS } from "@/lib/heist/constants";
import type { Phase } from "@/lib/heist/types";
import { cn } from "@/lib/utils";

interface SessionData {
  session: GameSession;
  leaderboard: { teamScores: TeamScore[]; playerScores: PlayerScore[] };
  highlights: { label: string; value: string }[];
}

export function SessionDetailContent() {
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/heist/history/${id}`)
      .then(r => r.json())
      .then(d => { if (d.session) setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="p-12 text-center text-text-secondary">Loading...</p>;
  if (!data) return <p className="p-12 text-center text-red-400">Session not found</p>;

  const { session, leaderboard, highlights } = data;

  return (
    <section className="px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <Link href="/games/heist/history" className="mb-6 inline-flex items-center gap-1 font-mono text-sm text-text-secondary hover:text-text-primary">
          <ArrowLeft size={14} /> Back to History
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary">{session.name}</h1>
          <p className="mt-1 text-sm text-text-secondary">
            {new Date(session.createdAt).toLocaleDateString()} — {session.teams.length} teams, {session.players.length} players
          </p>
        </div>

        {/* Team Standings */}
        <div className="mb-8 glass-card rounded-xl p-6">
          <h2 className="mb-4 flex items-center gap-2 font-mono text-sm uppercase tracking-wider text-text-tertiary">
            <Trophy size={16} className="text-accent-green" /> Final Team Standings
          </h2>
          <div className="space-y-3">
            {leaderboard.teamScores.map((ts, i) => {
              const maxW = Math.max(...leaderboard.teamScores.map(t => t.totalWealth), 1);
              return (
                <motion.div key={ts.teamCode} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex items-center gap-4">
                  <span className={cn("w-8 text-right font-mono text-xl font-black", i === 0 ? "text-accent-green" : i === 1 ? "text-accent-blue" : "text-text-tertiary")}>
                    {i + 1}
                  </span>
                  <span className="h-6 w-6 rounded-lg" style={{ backgroundColor: ts.color ?? "#888" }} />
                  <div className="flex-1">
                    <div className="mb-1 flex justify-between">
                      <span className="font-bold text-text-primary">{ts.teamName}</span>
                      <span className="font-mono font-bold text-accent-green">${ts.totalWealth.toLocaleString()}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-surface">
                      <div className="h-full rounded-full" style={{ backgroundColor: ts.color ?? "#00e87b", width: `${(ts.totalWealth / maxW) * 100}%` }} />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Top Players */}
        <div className="mb-8 glass-card rounded-xl p-6">
          <h2 className="mb-4 flex items-center gap-2 font-mono text-sm uppercase tracking-wider text-text-tertiary">
            <Users size={16} className="text-accent-blue" /> Player Leaderboard
          </h2>
          <div className="space-y-2">
            {leaderboard.playerScores.map((ps, i) => (
              <div key={ps.playerCode} className="flex items-center justify-between rounded-lg bg-surface/50 px-4 py-2">
                <div className="flex items-center gap-3">
                  <span className={cn("font-mono text-sm font-bold", i === 0 ? "text-accent-green" : i === 1 ? "text-accent-blue" : "text-text-tertiary")}>#{i + 1}</span>
                  <span className="text-sm text-text-primary">{ps.displayName || ps.playerCode}</span>
                  <span className="font-mono text-xs text-text-tertiary">{ps.teamCode}</span>
                </div>
                <span className="font-mono text-sm font-bold text-accent-green">${ps.totalWealth.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Highlights */}
        {highlights.length > 0 && (
          <div className="mb-8 grid gap-4 md:grid-cols-3">
            {highlights.map(h => (
              <div key={h.label} className="glass-card rounded-xl p-4">
                <p className="font-mono text-xs uppercase text-text-tertiary">{h.label}</p>
                <p className="text-lg font-bold text-text-primary">{h.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Submissions summary */}
        <details className="glass-card rounded-xl p-4">
          <summary className="cursor-pointer font-mono text-xs uppercase tracking-wider text-text-tertiary">
            All Submissions ({session.submissions.length})
          </summary>
          <div className="mt-3 max-h-80 overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-text-tertiary">
                  <th className="py-1 pr-3">Player</th>
                  <th className="py-1 pr-3">Phase</th>
                  <th className="py-1 pr-3">Type</th>
                  <th className="py-1 pr-3">Value</th>
                  <th className="py-1">Time</th>
                </tr>
              </thead>
              <tbody className="font-mono text-text-secondary">
                {session.submissions.map(s => (
                  <tr key={s.id} className="border-b border-border/50">
                    <td className="py-1 pr-3">{s.playerCode}</td>
                    <td className="py-1 pr-3">{PHASE_LABELS[s.phase as Phase] ?? s.phase}</td>
                    <td className="py-1 pr-3">{s.type}</td>
                    <td className="py-1 pr-3">
                      {s.type === "contribution" ? `$${s.amount?.toLocaleString()}` : s.auditChoice === "audit_someone" ? `→ ${s.targetPlayerCode}` : "none"}
                    </td>
                    <td className="py-1">{new Date(s.submittedAt).toLocaleTimeString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </div>
    </section>
  );
}
