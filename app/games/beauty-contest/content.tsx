"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Crown, Plus, RefreshCw, Sigma, Target, Trash2, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Entry = {
  id: string;
  name: string;
  guess: string;
};

type RankedEntry = Entry & {
  guessValue: number;
  distanceToTarget: number;
};

function createEntry(index: number): Entry {
  return {
    id: `entry-${index}-${Math.random().toString(36).slice(2, 8)}`,
    name: `Player ${index}`,
    guess: "",
  };
}

function formatNumber(value: number) {
  return Number.isInteger(value) ? value.toString() : value.toFixed(2);
}

export function BeautyContestPageContent() {
  const [entries, setEntries] = useState<Entry[]>([
    createEntry(1),
    createEntry(2),
    createEntry(3),
    createEntry(4),
  ]);

  const validEntries = useMemo(() => {
    return entries
      .map((entry) => {
        const guessValue = Number(entry.guess);
        const isValidGuess = entry.guess.trim() !== "" && Number.isFinite(guessValue) && guessValue >= 0 && guessValue <= 100;
        return isValidGuess ? { ...entry, guessValue } : null;
      })
      .filter((entry): entry is Entry & { guessValue: number } => entry !== null);
  }, [entries]);

  const average = validEntries.length > 0
    ? validEntries.reduce((sum, entry) => sum + entry.guessValue, 0) / validEntries.length
    : null;

  const target = average !== null ? (2 / 3) * average : null;

  const rankedEntries = useMemo<RankedEntry[]>(() => {
    if (target === null) return [];

    return validEntries
      .map((entry) => ({
        ...entry,
        distanceToTarget: Math.abs(entry.guessValue - target),
      }))
      .sort((left, right) => {
        if (left.distanceToTarget !== right.distanceToTarget) {
          return left.distanceToTarget - right.distanceToTarget;
        }
        return left.guessValue - right.guessValue;
      });
  }, [target, validEntries]);

  const winners = rankedEntries.length > 0
    ? rankedEntries.filter((entry) => entry.distanceToTarget === rankedEntries[0].distanceToTarget)
    : [];

  function updateEntry(id: string, patch: Partial<Entry>) {
    setEntries((current) => current.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry)));
  }

  function addPlayer() {
    setEntries((current) => [...current, createEntry(current.length + 1)]);
  }

  function removePlayer(id: string) {
    setEntries((current) => (current.length > 2 ? current.filter((entry) => entry.id !== id) : current));
  }

  function resetGuesses() {
    setEntries((current) => current.map((entry) => ({ ...entry, guess: "" })));
  }

  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent-blue/10 px-4 py-1.5 font-mono text-xs uppercase tracking-wider text-accent-blue">
            <Target size={14} /> Quick Multiplayer Game
          </div>
          <h1 className="mb-4 text-5xl font-bold tracking-tight text-text-primary md:text-6xl">
            Keynesian Beauty Contest
          </h1>
          <p className="mx-auto max-w-3xl text-lg text-text-secondary">
            Everyone picks a number from 0 to 100. The room average is computed, then the winner is whoever guessed closest to two-thirds of that average.
          </p>
        </motion.div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <Card className="p-6 md:p-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-accent-blue">Room Inputs</p>
                <h2 className="mt-1 text-2xl font-bold text-text-primary">Player Guesses</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={resetGuesses}>
                  <RefreshCw size={14} /> Clear Guesses
                </Button>
                <Button variant="secondary" size="sm" onClick={addPlayer}>
                  <Plus size={14} /> Add Player
                </Button>
              </div>
            </div>

            <div className="mb-6 grid gap-3">
              {entries.map((entry, index) => (
                <div key={entry.id} className="grid gap-3 rounded-xl border border-border bg-surface/40 p-4 md:grid-cols-[minmax(0,1fr)_160px_auto]">
                  <div>
                    <label className="mb-1 block font-mono text-xs uppercase tracking-wider text-text-tertiary">
                      Player Name
                    </label>
                    <input
                      value={entry.name}
                      onChange={(event) => updateEntry(entry.id, { name: event.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-text-primary focus:border-accent-blue focus:outline-none"
                      placeholder={`Player ${index + 1}`}
                    />
                  </div>

                  <div>
                    <label className="mb-1 block font-mono text-xs uppercase tracking-wider text-text-tertiary">
                      Guess (0-100)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      step="0.1"
                      value={entry.guess}
                      onChange={(event) => updateEntry(entry.id, { guess: event.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-text-primary focus:border-accent-green focus:outline-none"
                      placeholder="50"
                    />
                  </div>

                  <div className="flex items-end justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removePlayer(entry.id)}
                      disabled={entries.length <= 2}
                      aria-label={`Remove ${entry.name || `Player ${index + 1}`}`}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid gap-4 rounded-2xl border border-border bg-background/60 p-5 md:grid-cols-3">
              <MetricCard label="Valid Guesses" value={validEntries.length.toString()} icon={<Users size={18} />} />
              <MetricCard label="Room Average" value={average === null ? "--" : formatNumber(average)} icon={<Sigma size={18} />} />
              <MetricCard label="Target: 2/3 Avg" value={target === null ? "--" : formatNumber(target)} icon={<Target size={18} />} />
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="p-6 md:p-8" glow="green">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-xl bg-accent-green/10 p-3 text-accent-green">
                  <Crown size={22} />
                </div>
                <div>
                  <p className="font-mono text-xs uppercase tracking-wider text-accent-green">Winner</p>
                  <h2 className="text-2xl font-bold text-text-primary">Closest to the target</h2>
                </div>
              </div>

              {winners.length === 0 ? (
                <p className="text-text-secondary">Enter at least one valid guess to calculate the result.</p>
              ) : (
                <div className="space-y-3">
                  {winners.map((winner) => (
                    <div key={winner.id} className="rounded-xl border border-accent-green/20 bg-accent-green/5 px-4 py-4">
                      <p className="text-lg font-bold text-text-primary">{winner.name || "Unnamed Player"}</p>
                      <p className="mt-1 font-mono text-sm text-text-secondary">
                        Guess: {formatNumber(winner.guessValue)}
                      </p>
                      <p className="font-mono text-sm text-accent-green">
                        Distance to target: {formatNumber(winner.distanceToTarget)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card className="p-6 md:p-8">
              <p className="mb-4 font-mono text-xs uppercase tracking-wider text-accent-blue">Ranking</p>
              {rankedEntries.length === 0 ? (
                <p className="text-text-secondary">No valid guesses yet.</p>
              ) : (
                <div className="space-y-3">
                  {rankedEntries.map((entry, index) => (
                    <div key={entry.id} className="flex items-center justify-between rounded-xl border border-border bg-surface/40 px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className={`font-mono text-sm font-bold ${index === 0 ? "text-accent-green" : index === 1 ? "text-accent-blue" : "text-text-tertiary"}`}>
                          #{index + 1}
                        </span>
                        <div>
                          <p className="font-semibold text-text-primary">{entry.name || `Player ${index + 1}`}</p>
                          <p className="font-mono text-xs text-text-tertiary">Guess {formatNumber(entry.guessValue)}</p>
                        </div>
                      </div>
                      <span className="font-mono text-sm text-text-secondary">Δ {formatNumber(entry.distanceToTarget)}</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card className="p-6 md:p-8">
              <p className="mb-3 font-mono text-xs uppercase tracking-wider text-accent-blue">Quick Rules</p>
              <div className="space-y-3 text-sm text-text-secondary">
                <p>1. Every player picks one number between 0 and 100.</p>
                <p>2. Compute the average of all valid guesses.</p>
                <p>3. Compute the target as two-thirds of that average.</p>
                <p>4. The player closest to the target wins. Exact ties are shared winners.</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

function MetricCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-surface/50 px-4 py-4">
      <div className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-text-tertiary">
        {icon}
        {label}
      </div>
      <p className="text-2xl font-bold text-text-primary">{value}</p>
    </div>
  );
}