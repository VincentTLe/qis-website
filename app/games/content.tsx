"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Calculator, Dice5, TrendingUp, Trophy } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { gamesList } from "@/data/games";
import { MentalMathGame } from "./mental-math";
import { ProbabilityGame } from "./probability";

const iconMap: Record<string, typeof Calculator> = {
  calculator: Calculator,
  dice: Dice5,
  "trending-up": TrendingUp,
};

export function GamesContent() {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="px-6 pb-24">
      <div className="mx-auto max-w-6xl">
        {/* Game Selector */}
        {!activeGame && (
          <div ref={ref} className="grid gap-6 md:grid-cols-3">
            {gamesList.map((game, i) => {
              const Icon = iconMap[game.icon] || Calculator;
              return (
                <motion.div
                  key={game.slug}
                  initial={false}
                  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  {game.available ? (
                    <button
                      onClick={() => setActiveGame(game.slug)}
                      className="block w-full text-left cursor-pointer"
                    >
                      <Card className="flex h-full flex-col items-center p-8 text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-blue/10">
                          <Icon size={32} className="text-accent-blue" />
                        </div>
                        <h3 className="mb-2 text-xl font-bold text-text-primary">
                          {game.name}
                        </h3>
                        <p className="mb-4 text-sm leading-relaxed text-text-secondary">
                          {game.description}
                        </p>
                        <span className="mt-auto inline-flex items-center rounded-lg bg-accent-blue/10 px-4 py-2 font-mono text-xs uppercase tracking-wider text-accent-blue">
                          Play Now
                        </span>
                      </Card>
                    </button>
                  ) : (
                    <Card className="flex h-full flex-col items-center p-8 text-center opacity-60" hover={false}>
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-hover">
                        <Icon size={32} className="text-text-tertiary" />
                      </div>
                      <h3 className="mb-2 text-xl font-bold text-text-primary">
                        {game.name}
                      </h3>
                      <p className="mb-4 text-sm leading-relaxed text-text-secondary">
                        {game.description}
                      </p>
                      <Badge color="gray" className="mt-auto">Coming Soon</Badge>
                    </Card>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Active Game */}
        {activeGame && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <button
              onClick={() => setActiveGame(null)}
              className="mb-6 font-mono text-sm text-text-secondary transition-colors hover:text-text-primary cursor-pointer"
            >
              &larr; Back to Games
            </button>

            {activeGame === "mental-math" && <MentalMathGame />}
            {activeGame === "probability" && <ProbabilityGame />}
          </motion.div>
        )}

        {/* Leaderboard */}
        {!activeGame && <Leaderboard />}
      </div>
    </section>
  );
}

function Leaderboard() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  // Read from localStorage
  const getScores = (game: string) => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(`qis-leaderboard-${game}`);
      if (!raw) return [];
      return JSON.parse(raw) as { score: number; date: string }[];
    } catch {
      return [];
    }
  };

  const mathScores = typeof window !== "undefined" ? getScores("mental-math") : [];
  const probScores = typeof window !== "undefined" ? getScores("probability") : [];

  return (
    <motion.div
      ref={ref}
      initial={false}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="mt-16"
    >
      <div className="mb-8 flex items-center gap-3">
        <Trophy size={24} className="text-accent-green" />
        <h2 className="text-2xl font-bold text-text-primary">Leaderboard</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <LeaderboardTable title="Mental Math" scores={mathScores} />
        <LeaderboardTable title="Probability" scores={probScores} />
      </div>
    </motion.div>
  );
}

function LeaderboardTable({
  title,
  scores,
}: {
  title: string;
  scores: { score: number; date: string }[];
}) {
  const top10 = scores.slice(0, 10);

  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="mb-4 font-mono text-sm uppercase tracking-wider text-accent-blue">
        {title}
      </h3>
      {top10.length === 0 ? (
        <p className="py-8 text-center text-sm text-text-tertiary">
          No scores yet. Be the first to play!
        </p>
      ) : (
        <div className="space-y-2">
          {top10.map((entry, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-lg bg-surface/50 px-4 py-2"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`font-mono text-sm font-bold ${
                    i === 0
                      ? "text-accent-green"
                      : i === 1
                        ? "text-accent-blue"
                        : i === 2
                          ? "text-purple-400"
                          : "text-text-tertiary"
                  }`}
                >
                  #{i + 1}
                </span>
                <span className="font-mono text-sm text-text-primary">
                  {entry.score} pts
                </span>
              </div>
              <span className="font-mono text-xs text-text-tertiary">
                {new Date(entry.date).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
