"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swords, Check, Loader2 } from "lucide-react";
import { useHeistPoll, submitAction, joinGame, getMe } from "@/lib/heist/use-heist-poll";
import { cn } from "@/lib/utils";

const AMOUNTS = [0, 2000, 4000, 6000, 8000, 10000];

interface PlayerState {
  phase: string;
  phaseLabel: string;
  phaseOpen: boolean;
  player?: {
    playerCode: string;
    displayName?: string;
    teamCode: string;
    teamName: string;
    teamColor?: string;
  };
  teammates?: { playerCode: string; displayName?: string }[];
  submittedThisPhase?: boolean;
  mySubmissions?: {
    phase: string;
    type: string;
    amount?: number;
    auditChoice?: string;
    targetPlayerCode?: string;
  }[];
  session?: null;
  error?: string;
}

interface PlayerInfo {
  playerCode: string;
  displayName?: string | null;
  teamCode: string;
  teamName: string;
  teamColor?: string | null;
}

export function PlayerContent() {
  const [token, setToken] = useState<string | null>(null);
  const [playerInfo, setPlayerInfo] = useState<PlayerInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("heist-player-token");
    if (stored) {
      getMe(stored).then((data) => {
        if (data?.playerCode) {
          setToken(stored);
          setPlayerInfo(data);
        } else {
          localStorage.removeItem("heist-player-token");
        }
        setLoading(false);
      }).catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-accent-green" size={32} />
      </section>
    );
  }

  if (!token || !playerInfo) {
    return (
      <JoinScreen
        onJoined={(t, info) => {
          setToken(t);
          setPlayerInfo(info);
          localStorage.setItem("heist-player-token", t);
        }}
      />
    );
  }

  return (
    <GameScreen
      token={token}
      playerInfo={playerInfo}
      onLeave={() => {
        setToken(null);
        setPlayerInfo(null);
        localStorage.removeItem("heist-player-token");
      }}
    />
  );
}

function JoinScreen({ onJoined }: { onJoined: (token: string, info: PlayerInfo) => void }) {
  const [name, setName] = useState("");
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data } = useHeistPoll<PlayerState>("/api/heist/state?role=player", 3000);
  const noSession = data?.session === null;

  async function handleJoin() {
    if (!name.trim()) return;
    setJoining(true);
    setError(null);
    try {
      const res = await joinGame(name.trim());
      if (res.ok) {
        onJoined(res.token, res);
      } else {
        setError(res.error ?? "Failed to join");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Connection failed");
    } finally {
      setJoining(false);
    }
  }

  return (
    <section className="flex min-h-[60vh] items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm text-center"
      >
        <div className="mb-6 inline-flex items-center gap-2 text-accent-green">
          <Swords size={28} />
        </div>
        <h1 className="mb-2 text-3xl font-bold text-text-primary">The Heist</h1>

        {noSession ? (
          <p className="mt-4 text-text-secondary">Waiting for the game to start...</p>
        ) : (
          <>
            <p className="mb-8 text-text-secondary">Enter your name to join</p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="mb-4 w-full rounded-xl border border-border bg-surface px-4 py-4 text-center text-xl font-semibold text-text-primary placeholder:text-text-tertiary focus:border-accent-green focus:outline-none"
              maxLength={20}
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && handleJoin()}
            />
            {error && <p className="mb-3 text-sm text-red-400">{error}</p>}
            <button
              onClick={handleJoin}
              disabled={!name.trim() || joining}
              className="w-full cursor-pointer rounded-xl bg-accent-green px-6 py-4 font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              {joining ? "Joining..." : "Join Game"}
            </button>
          </>
        )}
      </motion.div>
    </section>
  );
}

function GameScreen({ token, playerInfo, onLeave }: { token: string; playerInfo: PlayerInfo; onLeave: () => void }) {
  const { data, loading } = useHeistPoll<PlayerState>(
    "/api/heist/state?role=player",
    2000,
    { "x-player-token": token }
  );
  const [submitting, setSubmitting] = useState(false);
  const [justSubmitted, setJustSubmitted] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [auditChoice, setAuditChoice] = useState<"no_audit" | "audit_someone">("no_audit");
  const [auditTarget, setAuditTarget] = useState("");
  const [prevPhase, setPrevPhase] = useState<string | null>(null);

  const currentPhase = data?.phase;
  useEffect(() => {
    if (currentPhase && currentPhase !== prevPhase) {
      setPrevPhase(currentPhase);
      setJustSubmitted(false);
      setSelectedAmount(null);
      setAuditChoice("no_audit");
      setAuditTarget("");
    }
  }, [currentPhase, prevPhase]);

  if (loading || !data) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-accent-green" size={32} />
      </section>
    );
  }

  if (data.error) {
    return (
      <section className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6">
        <p className="text-red-400">Session expired or invalid</p>
        <button onClick={onLeave} className="cursor-pointer text-sm text-text-secondary underline">Rejoin</button>
      </section>
    );
  }

  const { phase, phaseLabel, phaseOpen, teammates, submittedThisPhase } = data;
  const pInfo = data.player ?? playerInfo;
  const isContribution = phase?.includes("contribution");
  const isAudit = phase?.includes("audit");
  const isActive = phaseOpen && (isContribution || isAudit);
  const hasSubmitted = submittedThisPhase || justSubmitted;

  async function handleContribution() {
    if (selectedAmount === null) return;
    setSubmitting(true);
    try {
      const res = await submitAction({ amount: selectedAmount }, token);
      if (res.ok) setJustSubmitted(true);
    } catch { /* ignore */ } finally {
      setSubmitting(false);
    }
  }

  async function handleAudit() {
    setSubmitting(true);
    try {
      const res = await submitAction({
        auditChoice,
        targetPlayerCode: auditChoice === "audit_someone" ? auditTarget : undefined,
      }, token);
      if (res.ok) setJustSubmitted(true);
    } catch { /* ignore */ } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="px-6 py-12">
      <div className="mx-auto max-w-sm">
        <div className="mb-8 text-center">
          <div className="mb-2 flex items-center justify-center gap-2">
            <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: pInfo?.teamColor ?? "#00e87b" }} />
            <span className="font-mono text-sm text-text-secondary">
              {pInfo?.teamName} — {pInfo?.playerCode}
            </span>
          </div>
          <p className="text-sm font-medium text-text-primary">{pInfo?.displayName}</p>
          <p className="mt-1 font-mono text-xs uppercase tracking-wider text-accent-blue">{phaseLabel}</p>
          {phaseOpen && <span className="mt-1 inline-block h-2 w-2 animate-pulse rounded-full bg-accent-green" />}
        </div>

        <AnimatePresence mode="wait" key={phase}>
          {(!isActive || phase === "lobby" || phase === "results") && (
            <motion.div key="waiting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
              <div className="glass-card rounded-xl p-8">
                {phase === "lobby" ? (
                  <div>
                    <p className="text-lg font-semibold text-accent-green">You&apos;re in!</p>
                    <p className="mt-2 text-text-secondary">
                      Assigned to <span className="font-bold text-text-primary">{pInfo?.teamName}</span> as <span className="font-mono font-bold text-accent-blue">{pInfo?.playerCode}</span>
                    </p>
                    <p className="mt-4 text-sm text-text-tertiary">Waiting for the game to start...</p>
                  </div>
                ) : phase === "results" ? (
                  <p className="text-lg font-semibold text-accent-green">Game Over! Check the projector for results.</p>
                ) : (
                  <p className="text-text-secondary">Waiting for the next phase to open...</p>
                )}
              </div>
            </motion.div>
          )}

          {isActive && isContribution && (
            <motion.div key="contribution" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {hasSubmitted ? (
                <div className="glass-card flex flex-col items-center rounded-xl p-8 text-center">
                  <Check className="mb-2 text-accent-green" size={40} />
                  <p className="font-semibold text-text-primary">Submitted!</p>
                  <p className="mt-1 text-sm text-text-secondary">You can change your answer until the phase closes.</p>
                  <button onClick={() => setJustSubmitted(false)} className="mt-4 cursor-pointer text-sm text-accent-blue underline">Change answer</button>
                </div>
              ) : (
                <div className="glass-card rounded-xl p-6">
                  <p className="mb-1 text-center text-sm text-text-secondary">You have <span className="font-bold text-accent-green">$10,000</span></p>
                  <p className="mb-6 text-center text-sm text-text-secondary">How much do you contribute to the team vault?</p>
                  <div className="grid grid-cols-3 gap-3">
                    {AMOUNTS.map((amt) => (
                      <button
                        key={amt}
                        onClick={() => setSelectedAmount(amt)}
                        className={cn(
                          "cursor-pointer rounded-xl border-2 px-3 py-4 font-mono text-lg font-bold transition-all",
                          selectedAmount === amt
                            ? "border-accent-green bg-accent-green/10 text-accent-green"
                            : "border-border bg-surface text-text-primary hover:border-text-tertiary"
                        )}
                      >
                        ${(amt / 1000).toFixed(0)}k
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleContribution}
                    disabled={selectedAmount === null || submitting}
                    className="mt-6 w-full cursor-pointer rounded-xl bg-accent-green px-6 py-4 font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-40"
                  >
                    {submitting ? "Submitting..." : "Confirm"}
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {isActive && isAudit && (
            <motion.div key="audit" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {hasSubmitted ? (
                <div className="glass-card flex flex-col items-center rounded-xl p-8 text-center">
                  <Check className="mb-2 text-accent-green" size={40} />
                  <p className="font-semibold text-text-primary">Audit submitted!</p>
                  <button onClick={() => setJustSubmitted(false)} className="mt-4 cursor-pointer text-sm text-accent-blue underline">Change answer</button>
                </div>
              ) : (
                <div className="glass-card rounded-xl p-6">
                  <p className="mb-1 text-center text-sm text-text-secondary">Audit costs you <span className="font-bold text-red-400">$1,000</span></p>
                  <p className="mb-6 text-center text-sm text-text-secondary">Deals <span className="font-bold text-red-400">$3,000</span> damage to target</p>
                  <div className="mb-4 flex gap-3">
                    <button
                      onClick={() => setAuditChoice("no_audit")}
                      className={cn("flex-1 cursor-pointer rounded-xl border-2 px-3 py-4 font-semibold transition-all", auditChoice === "no_audit" ? "border-accent-green bg-accent-green/10 text-accent-green" : "border-border bg-surface text-text-primary")}
                    >
                      No Audit
                    </button>
                    <button
                      onClick={() => setAuditChoice("audit_someone")}
                      className={cn("flex-1 cursor-pointer rounded-xl border-2 px-3 py-4 font-semibold transition-all", auditChoice === "audit_someone" ? "border-red-400 bg-red-400/10 text-red-400" : "border-border bg-surface text-text-primary")}
                    >
                      Audit
                    </button>
                  </div>
                  {auditChoice === "audit_someone" && teammates && (
                    <div className="mb-4 space-y-2">
                      <p className="text-xs uppercase tracking-wider text-text-tertiary">Select target</p>
                      {teammates.map((tm) => (
                        <button
                          key={tm.playerCode}
                          onClick={() => setAuditTarget(tm.playerCode)}
                          className={cn("w-full cursor-pointer rounded-lg border-2 px-4 py-3 text-left font-mono transition-all", auditTarget === tm.playerCode ? "border-red-400 bg-red-400/10 text-red-400" : "border-border bg-surface text-text-primary")}
                        >
                          {tm.playerCode} {tm.displayName && `— ${tm.displayName}`}
                        </button>
                      ))}
                    </div>
                  )}
                  <button
                    onClick={handleAudit}
                    disabled={submitting || (auditChoice === "audit_someone" && !auditTarget)}
                    className="w-full cursor-pointer rounded-xl bg-accent-green px-6 py-4 font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-40"
                  >
                    {submitting ? "Submitting..." : "Confirm"}
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 text-center">
          <button onClick={onLeave} className="cursor-pointer text-xs text-text-tertiary hover:text-text-secondary">Leave game</button>
        </div>
      </div>
    </section>
  );
}
