"use client";

import { useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Play, RotateCcw, ArrowRight, Target } from "lucide-react";
import { probabilityQuestions, type ProbabilityQuestion } from "@/data/games";

type GameState = "idle" | "playing" | "feedback" | "results";

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function calculateScore(guess: number, correct: number): number {
  const error = Math.abs(guess - correct);
  // Max 100 points per question, lose 2 points per % off
  return Math.max(0, Math.round(100 - error * 2));
}

function saveScore(score: number) {
  try {
    const key = "qis-leaderboard-probability";
    const raw = localStorage.getItem(key);
    const scores: { score: number; date: string }[] = raw ? JSON.parse(raw) : [];
    scores.push({ score, date: new Date().toISOString() });
    scores.sort((a, b) => b.score - a.score);
    localStorage.setItem(key, JSON.stringify(scores.slice(0, 50)));
  } catch {
    // localStorage not available
  }
}

const ROUNDS = 8;

export function ProbabilityGame() {
  const [state, setState] = useState<GameState>("idle");
  const [questions, setQuestions] = useState<ProbabilityQuestion[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [guess, setGuess] = useState(50);
  const [totalScore, setTotalScore] = useState(0);
  const [roundScore, setRoundScore] = useState(0);
  const [roundResults, setRoundResults] = useState<{ question: string; guess: number; correct: number; score: number }[]>([]);

  const startGame = useCallback(() => {
    const shuffled = shuffleArray(probabilityQuestions).slice(0, ROUNDS);
    setQuestions(shuffled);
    setCurrentRound(0);
    setTotalScore(0);
    setGuess(50);
    setRoundScore(0);
    setRoundResults([]);
    setState("playing");
  }, []);

  const submitGuess = useCallback(() => {
    if (state !== "playing") return;
    const q = questions[currentRound];
    const score = calculateScore(guess, q.correctAnswer);
    setRoundScore(score);
    setTotalScore((s) => s + score);
    setRoundResults((prev) => [
      ...prev,
      { question: q.scenario, guess, correct: q.correctAnswer, score },
    ]);
    setState("feedback");
  }, [state, questions, currentRound, guess]);

  const nextRound = useCallback(() => {
    if (currentRound + 1 >= questions.length) {
      setState("results");
      saveScore(totalScore + roundScore);
      return;
    }
    setCurrentRound((r) => r + 1);
    setGuess(50);
    setState("playing");
  }, [currentRound, questions.length, totalScore, roundScore]);

  const currentQuestion = questions[currentRound];
  const maxScore = ROUNDS * 100;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="glass-card rounded-2xl p-8 md:p-10">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-text-primary">Probability Estimation</h2>
          {(state === "playing" || state === "feedback") && (
            <span className="font-mono text-sm text-text-tertiary">
              Round {currentRound + 1}/{questions.length}
            </span>
          )}
        </div>

        {/* Idle */}
        {state === "idle" && (
          <div className="py-12 text-center">
            <p className="mb-2 text-text-secondary">
              Estimate probabilities for {ROUNDS} quantitative scenarios.
            </p>
            <p className="mb-6 text-sm text-text-tertiary">
              Score up to 100 points per question based on how close your estimate is.
            </p>
            <button
              onClick={startGame}
              className="glow-green inline-flex items-center gap-2 rounded-lg bg-accent-green px-8 py-3.5 font-mono text-sm font-semibold uppercase tracking-wider text-background transition-all hover:brightness-110 cursor-pointer"
            >
              <Play size={18} />
              Start Game
            </button>
          </div>
        )}

        {/* Playing */}
        {state === "playing" && currentQuestion && (
          <div>
            {/* Progress */}
            <div className="mb-6 h-1.5 w-full rounded-full bg-surface">
              <div
                className="h-full rounded-full bg-accent-blue transition-all"
                style={{ width: `${((currentRound) / questions.length) * 100}%` }}
              />
            </div>

            <div className="mb-2 flex justify-between text-sm">
              <span className="text-text-secondary">
                Score: <span className="font-mono font-bold text-accent-green">{totalScore}</span>
              </span>
              <span className="font-mono text-xs rounded-full bg-surface px-3 py-1 text-text-tertiary">
                {currentQuestion.difficulty}
              </span>
            </div>

            {/* Question */}
            <div className="my-8 rounded-xl bg-surface p-6">
              <p className="text-base leading-relaxed text-text-primary">
                {currentQuestion.scenario}
              </p>
            </div>

            {/* Slider */}
            <div className="mb-6">
              <div className="mb-2 text-center">
                <span className="font-mono text-4xl font-bold text-accent-blue">
                  {guess}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={guess}
                onChange={(e) => setGuess(parseInt(e.target.value, 10))}
                className="w-full accent-accent-blue cursor-pointer"
              />
              <div className="flex justify-between text-xs text-text-tertiary">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>

            <button
              onClick={submitGuess}
              className="w-full rounded-lg bg-accent-blue px-6 py-3 font-mono text-sm font-semibold text-white transition-all hover:brightness-110 cursor-pointer"
            >
              Lock In Answer
            </button>
          </div>
        )}

        {/* Feedback */}
        {state === "feedback" && currentQuestion && (
          <div className="py-6 text-center">
            <div className="mb-6 flex items-center justify-center gap-8">
              <div>
                <p className="text-xs text-text-tertiary">Your Guess</p>
                <p className="font-mono text-3xl font-bold text-accent-blue">{guess}%</p>
              </div>
              <div>
                <p className="text-xs text-text-tertiary">Correct</p>
                <p className="font-mono text-3xl font-bold text-accent-green">
                  {currentQuestion.correctAnswer.toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-xs text-text-tertiary">Points</p>
                <p className={`font-mono text-3xl font-bold ${roundScore >= 80 ? "text-accent-green" : roundScore >= 50 ? "text-accent-blue" : "text-red-400"}`}>
                  +{roundScore}
                </p>
              </div>
            </div>

            <div className="mb-6 rounded-xl bg-surface p-4 text-left">
              <p className="text-sm leading-relaxed text-text-secondary">
                {currentQuestion.explanation}
              </p>
            </div>

            <button
              onClick={nextRound}
              className="inline-flex items-center gap-2 rounded-lg bg-accent-green px-6 py-3 font-mono text-sm font-semibold text-background transition-all hover:brightness-110 cursor-pointer"
            >
              {currentRound + 1 >= questions.length ? "See Results" : "Next Question"}
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* Results */}
        {state === "results" && (
          <div className="py-6 text-center">
            <Target size={48} className="mx-auto mb-4 text-accent-green" />
            <p className="mb-1 font-mono text-xs uppercase tracking-wider text-text-tertiary">
              Final Score
            </p>
            <p className="mb-2 font-mono text-6xl font-bold text-accent-green">
              {totalScore}
            </p>
            <p className="mb-8 text-text-secondary">
              out of {maxScore} possible ({Math.round((totalScore / maxScore) * 100)}%)
            </p>

            {/* Round breakdown */}
            <div className="mb-8 space-y-2 text-left">
              {roundResults.map((r, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg bg-surface px-4 py-2.5">
                  <span className="flex-1 truncate text-xs text-text-secondary">
                    Q{i + 1}: {r.guess}% vs {r.correct.toFixed(1)}%
                  </span>
                  <span className={`ml-3 font-mono text-xs font-bold ${r.score >= 80 ? "text-accent-green" : r.score >= 50 ? "text-accent-blue" : "text-red-400"}`}>
                    +{r.score}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={startGame}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 font-mono text-sm text-text-secondary transition-colors hover:border-border-hover hover:text-text-primary cursor-pointer"
            >
              <RotateCcw size={16} />
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
