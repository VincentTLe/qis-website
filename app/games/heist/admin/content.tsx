"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Play, Pause, SkipForward, RotateCcw, Download, Plus, Eye, Users } from "lucide-react";
import { useHeistPoll, adminAction } from "@/lib/heist/use-heist-poll";
import { PHASE_ORDER, PHASE_LABELS } from "@/lib/heist/constants";
import type { Phase, GameSession, PlayerScore, TeamScore } from "@/lib/heist/types";
import { cn } from "@/lib/utils";

interface AdminState {
  session: (GameSession & { phaseLabel: string }) | null;
  counts?: { submitted: number; expected: number };
  leaderboard?: { teamScores: TeamScore[]; playerScores: PlayerScore[] };
  highlights?: { label: string; value: string }[];
}

export function AdminContent() {
  const [adminKey, setAdminKey] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [keyInput, setKeyInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [checking, setChecking] = useState(false);

  async function verifyKey(key: string) {
    setChecking(true);
    setAuthError("");
    // Test the key with a harmless export action
    const res = await adminAction("export", key);
    setChecking(false);
    if (res.error === "Unauthorized") {
      setAuthError("Wrong admin key");
      sessionStorage.removeItem("heist-admin-key");
      return;
    }
    if (res.error === "Server configuration error") {
      setAuthError("Server error: HEIST_ADMIN_KEY not configured");
      return;
    }
    setAdminKey(key);
    sessionStorage.setItem("heist-admin-key", key);
    setAuthenticated(true);
  }

  useEffect(() => {
    const stored = sessionStorage.getItem("heist-admin-key");
    if (stored) verifyKey(stored);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!authenticated) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center px-6">
        <div className="w-full max-w-sm text-center">
          <Shield className="mx-auto mb-4 text-accent-blue" size={32} />
          <h1 className="mb-6 text-2xl font-bold text-text-primary">Admin Access</h1>
          <input
            type="password"
            value={keyInput}
            onChange={(e) => { setKeyInput(e.target.value); setAuthError(""); }}
            placeholder="Admin key"
            className="mb-4 w-full rounded-xl border border-border bg-surface px-4 py-3 text-center font-mono text-text-primary placeholder:text-text-tertiary focus:border-accent-blue focus:outline-none"
            onKeyDown={(e) => { if (e.key === "Enter" && keyInput) verifyKey(keyInput); }}
          />
          {authError && <p className="mb-3 text-sm font-semibold text-red-400">{authError}</p>}
          <button
            onClick={() => { if (keyInput) verifyKey(keyInput); }}
            disabled={checking || !keyInput}
            className="w-full cursor-pointer rounded-xl bg-accent-blue px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {checking ? "Verifying..." : "Enter"}
          </button>
        </div>
      </section>
    );
  }

  return <AdminDashboard adminKey={adminKey} />;
}

function AdminDashboard({ adminKey }: { adminKey: string }) {
  const { data, refresh } = useHeistPoll<AdminState>("/api/heist/state?role=admin", 2000);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  async function doAction(action: string, body: Record<string, unknown> = {}) {
    setBusy(true);
    setActionError(null);
    const res = await adminAction(action, adminKey, body);
    if (res.error) setActionError(res.error);
    await refresh();
    setBusy(false);
  }

  const session = data?.session ?? null;

  if (!session) return <SetupPanel onAction={doAction} busy={busy} error={actionError} />;

  const isLobby = session.phase === "lobby";
  const joinedPlayers = session.players.filter(p => p.displayName);
  const totalSlots = session.players.length;

  return (
    <section className="px-6 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">{session.name}</h1>
            <p className="font-mono text-sm text-accent-blue">{session.phaseLabel}</p>
          </div>
          <div className="flex items-center gap-2">
            {session.phaseOpen && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-green/10 px-3 py-1 text-xs font-semibold text-accent-green">
                <span className="h-2 w-2 animate-pulse rounded-full bg-accent-green" /> Open
              </span>
            )}
            {!session.phaseOpen && !isLobby && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-400/10 px-3 py-1 text-xs font-semibold text-red-400">Closed</span>
            )}
          </div>
        </div>

        {/* Error banner */}
        {actionError && (
          <div className="mb-4 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm font-semibold text-red-400">
            {actionError}
          </div>
        )}

        {/* Phase Controls */}
        <div className="mb-6 glass-card rounded-xl p-4">
          <div className="flex flex-wrap gap-2">
            {isLobby ? (
              <ActionButton
                onClick={() => doAction("advance-phase")}
                disabled={busy || joinedPlayers.length === 0}
                icon={<Play size={16} />}
                className="bg-accent-green text-background"
              >
                Start Game ({joinedPlayers.length}/{totalSlots} joined)
              </ActionButton>
            ) : session.phase !== "results" && !session.phaseOpen ? (
              <ActionButton onClick={() => doAction("advance-phase")} disabled={busy} icon={<SkipForward size={16} />} className="bg-accent-green text-background">
                Next Phase
              </ActionButton>
            ) : null}
            {session.phaseOpen && !isLobby && (
              <ActionButton onClick={() => doAction("close-phase")} disabled={busy} icon={<Pause size={16} />} className="bg-red-500 text-white">
                Close Phase
              </ActionButton>
            )}
            {!session.phaseOpen && !isLobby && session.phase !== "results" && (
              <ActionButton onClick={() => doAction("reopen-phase")} disabled={busy} icon={<Play size={16} />} className="bg-amber-500 text-background">
                Reopen Phase
              </ActionButton>
            )}
            <ActionButton
              onClick={() => { if (confirm("End and archive this session?")) doAction("end-session"); }}
              disabled={busy}
              icon={<RotateCcw size={16} />}
              className="bg-surface text-text-secondary border border-border"
            >
              End Session
            </ActionButton>
            <ActionButton
              onClick={async () => {
                const res = await adminAction("export", adminKey);
                if (res.data) {
                  const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: "application/json" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url; a.download = `heist-${session.id}.json`; a.click();
                }
              }}
              disabled={busy}
              icon={<Download size={16} />}
              className="bg-surface text-text-secondary border border-border"
            >
              Export
            </ActionButton>
          </div>
        </div>

        {/* Lobby roster */}
        {isLobby && (
          <div className="mb-6 glass-card rounded-xl p-4">
            <div className="mb-3 flex items-center gap-2">
              <Users size={16} className="text-accent-green" />
              <p className="font-mono text-sm text-text-secondary">
                Lobby: <span className="font-bold text-accent-green">{joinedPlayers.length}</span> / {totalSlots} joined
              </p>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-surface">
              <div className="h-full rounded-full bg-accent-green transition-all duration-500" style={{ width: `${totalSlots ? (joinedPlayers.length / totalSlots) * 100 : 0}%` }} />
            </div>
          </div>
        )}

        {/* Submission counts */}
        {data?.counts && !isLobby && session.phase !== "results" && (
          <div className="mb-6 glass-card rounded-xl p-4">
            <p className="font-mono text-sm text-text-secondary">
              Submissions: <span className="font-bold text-accent-green">{data.counts.submitted}</span> / {data.counts.expected}
            </p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface">
              <div className="h-full rounded-full bg-accent-green transition-all duration-500" style={{ width: `${data.counts.expected ? (data.counts.submitted / data.counts.expected) * 100 : 0}%` }} />
            </div>
          </div>
        )}

        {/* Phase progress */}
        <div className="mb-6 glass-card rounded-xl p-4">
          <p className="mb-3 font-mono text-xs uppercase tracking-wider text-text-tertiary">Phase Progress</p>
          <div className="flex gap-1">
            {PHASE_ORDER.map((p) => {
              const idx = PHASE_ORDER.indexOf(p);
              const currentIdx = PHASE_ORDER.indexOf(session.phase as Phase);
              return (
                <div
                  key={p}
                  className={cn("h-2 flex-1 rounded-full transition-all", idx < currentIdx ? "bg-accent-green" : p === session.phase ? "bg-accent-blue" : "bg-surface")}
                  title={PHASE_LABELS[p]}
                />
              );
            })}
          </div>
        </div>

        {/* Teams & Players */}
        <div className="mb-6 glass-card rounded-xl p-4">
          <p className="mb-3 font-mono text-xs uppercase tracking-wider text-text-tertiary">Teams & Players</p>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {session.teams.map((team) => {
              const teamPlayers = session.players.filter(p => p.teamId === team.id);
              return (
                <div key={team.id} className="rounded-lg border border-border bg-surface/50 p-3">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: team.color ?? "#888" }} />
                    <span className="font-semibold text-text-primary">{team.teamName}</span>
                    <span className="font-mono text-xs text-text-tertiary">({teamPlayers.filter(p => p.displayName).length}/{teamPlayers.length})</span>
                  </div>
                  <div className="space-y-1">
                    {teamPlayers.map(p => {
                      const hasSub = session.submissions.some(s => s.playerCode === p.playerCode && s.phase === session.phase);
                      return (
                        <div key={p.id} className="flex items-center gap-2 text-sm">
                          <span className={cn("h-1.5 w-1.5 rounded-full", p.displayName ? (hasSub ? "bg-accent-green" : "bg-accent-blue") : "bg-text-tertiary")} />
                          <span className="font-mono text-text-secondary">{p.playerCode}</span>
                          {p.displayName ? (
                            <span className="text-text-primary">{p.displayName}</span>
                          ) : (
                            <span className="text-text-tertiary italic">empty slot</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Leaderboard */}
        {data?.leaderboard && data.leaderboard.teamScores.length > 0 && !isLobby && (
          <div className="mb-6 glass-card rounded-xl p-4">
            <p className="mb-3 font-mono text-xs uppercase tracking-wider text-text-tertiary">Team Standings</p>
            <div className="space-y-2">
              {data.leaderboard.teamScores.map((ts, i) => (
                <div key={ts.teamCode} className="flex items-center justify-between rounded-lg bg-surface/50 px-4 py-2">
                  <div className="flex items-center gap-3">
                    <span className={cn("font-mono text-sm font-bold", i === 0 ? "text-accent-green" : i === 1 ? "text-accent-blue" : "text-text-tertiary")}>#{i + 1}</span>
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: ts.color ?? "#888" }} />
                    <span className="font-semibold text-text-primary">{ts.teamName}</span>
                  </div>
                  <span className="font-mono text-sm font-bold text-accent-green">${ts.totalWealth.toLocaleString()}</span>
                </div>
              ))}
            </div>

            <p className="mb-3 mt-6 font-mono text-xs uppercase tracking-wider text-text-tertiary">Top Players</p>
            <div className="space-y-2">
              {data.leaderboard.playerScores.slice(0, 10).map((ps, i) => (
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
        )}

        {/* Submissions detail */}
        {session.submissions.length > 0 && (
          <details className="glass-card rounded-xl p-4">
            <summary className="cursor-pointer font-mono text-xs uppercase tracking-wider text-text-tertiary">
              <Eye className="mr-1 inline" size={12} /> All Submissions ({session.submissions.length})
            </summary>
            <div className="mt-3 max-h-64 overflow-y-auto">
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
                  {[...session.submissions].reverse().map((s) => (
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
        )}
      </div>
    </section>
  );
}

function SetupPanel({ onAction, busy, error }: { onAction: (action: string, body?: Record<string, unknown>) => void; busy: boolean; error?: string | null }) {
  const [sessionName, setSessionName] = useState("The Heist");
  const [teamCount, setTeamCount] = useState(4);
  const [teamSize, setTeamSize] = useState(4);
  const [teamNames, setTeamNames] = useState<string[]>([]);

  const teamCodes = "ABCDEFGH".split("").slice(0, teamCount);
  const defaultNames = teamCodes.map((c) => `Team ${c}`);
  const names = teamCodes.map((c, i) => teamNames[i] || defaultNames[i]);

  async function handleCreate() {
    const teams = teamCodes.map((c, i) => ({
      teamCode: c,
      teamName: names[i],
      size: teamSize,
    }));
    await onAction("create-session", { name: sessionName, teams });
  }

  return (
    <section className="px-6 py-12">
      <div className="mx-auto max-w-lg">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="mb-8 text-center text-2xl font-bold text-text-primary">
            <Shield className="mb-2 mx-auto text-accent-blue" size={28} />
            New Game Session
          </h1>

          <div className="glass-card rounded-xl p-6 space-y-4">
            <div>
              <label className="mb-1 block font-mono text-xs uppercase tracking-wider text-text-tertiary">Session Name</label>
              <input value={sessionName} onChange={(e) => setSessionName(e.target.value)} className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-text-primary focus:border-accent-blue focus:outline-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block font-mono text-xs uppercase tracking-wider text-text-tertiary">Teams</label>
                <input type="number" min={2} max={8} value={teamCount} onChange={(e) => setTeamCount(Number(e.target.value))} className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-text-primary focus:border-accent-blue focus:outline-none" />
              </div>
              <div>
                <label className="mb-1 block font-mono text-xs uppercase tracking-wider text-text-tertiary">Players/team</label>
                <input type="number" min={2} max={5} value={teamSize} onChange={(e) => setTeamSize(Number(e.target.value))} className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-text-primary focus:border-accent-blue focus:outline-none" />
              </div>
            </div>

            <div>
              <label className="mb-1 block font-mono text-xs uppercase tracking-wider text-text-tertiary">Team Names (optional)</label>
              <div className="space-y-2">
                {teamCodes.map((c, i) => (
                  <div key={c} className="flex items-center gap-2">
                    <span className="font-mono text-xs text-text-tertiary w-6">{c}</span>
                    <input
                      value={teamNames[i] || ""}
                      onChange={(e) => { const n = [...teamNames]; n[i] = e.target.value; setTeamNames(n); }}
                      placeholder={defaultNames[i]}
                      className="flex-1 rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent-blue focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            <p className="text-center font-mono text-sm text-text-secondary">
              {teamCount * teamSize} player slots — Players will auto-join via lobby
            </p>

            {error && (
              <div className="rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm font-semibold text-red-400">
                {error}
              </div>
            )}

            <button
              onClick={handleCreate}
              disabled={busy}
              className="w-full cursor-pointer rounded-xl bg-accent-green px-6 py-3 font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              <Plus className="mr-1 inline" size={16} />
              Create Session & Open Lobby
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ActionButton({ onClick, disabled, icon, className, children }: { onClick: () => void; disabled: boolean; icon: React.ReactNode; className?: string; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn("inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-40", className)}
    >
      {icon}
      {children}
    </button>
  );
}
