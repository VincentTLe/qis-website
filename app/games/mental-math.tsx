"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Play, RotateCcw, Clock, CheckCircle, XCircle } from "lucide-react";

type GameState = "idle" | "playing" | "results";

interface Problem {
  question: string;
  answer: number;
}

function generateProblem(): Problem {
  const ops = ["+", "-", "*"];
  const op = ops[Math.floor(Math.random() * ops.length)];

  let a: number, b: number, answer: number;

  if (op === "*") {
    a = Math.floor(Math.random() * 20) + 2;
    b = Math.floor(Math.random() * 12) + 2;
    answer = a * b;
  } else if (op === "+") {
    a = Math.floor(Math.random() * 900) + 100;
    b = Math.floor(Math.random() * 900) + 100;
    answer = a + b;
  } else {
    a = Math.floor(Math.random() * 900) + 100;
    b = Math.floor(Math.random() * Math.min(a, 900)) + 10;
    answer = a - b;
  }

  const symbol = op === "*" ? "\u00d7" : op;
  return { question: `${a} ${symbol} ${b}`, answer };
}

function saveScore(score: number) {
  try {
    const key = "qis-leaderboard-mental-math";
    const raw = localStorage.getItem(key);
    const scores: { score: number; date: string }[] = raw ? JSON.parse(raw) : [];
    scores.push({ score, date: new Date().toISOString() });
    scores.sort((a, b) => b.score - a.score);
    localStorage.setItem(key, JSON.stringify(scores.slice(0, 50)));
  } catch {
    // localStorage not available
  }
}

export function MentalMathGame() {
  const [state, setState] = useState<GameState>("idle");
  const [timeLeft, setTimeLeft] = useState(60);
  const [problem, setProblem] = useState<Problem>(generateProblem());
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const startGame = useCallback(() => {
    setState("playing");
    setTimeLeft(60);
    setScore(0);
    setTotal(0);
    setStreak(0);
    setInput("");
    setLastCorrect(null);
    setProblem(generateProblem());
  }, []);

  // Timer
  useEffect(() => {
    if (state !== "playing") return;
    if (timeLeft <= 0) {
      setState("results");
      saveScore(score);
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [state, timeLeft, score]);

  // Focus input when playing
  useEffect(() => {
    if (state === "playing") inputRef.current?.focus();
  }, [state, problem]);

  const submitAnswer = useCallback(() => {
    if (!input.trim()) return;
    const userAnswer = parseInt(input, 10);
    const correct = userAnswer === problem.answer;

    if (correct) {
      setScore((s) => s + 1);
      setStreak((s) => s + 1);
    } else {
      setStreak(0);
    }

    setTotal((t) => t + 1);
    setLastCorrect(correct);
    setInput("");
    setProblem(generateProblem());
  }, [input, problem]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") submitAnswer();
  };

  const accuracy = total > 0 ? Math.round((score / total) * 100) : 0;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="glass-card rounded-2xl p-8 md:p-10">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-text-primary">Mental Math</h2>
          {state === "playing" && (
            <div className="flex items-center gap-2">
              <Clock size={18} className={timeLeft <= 10 ? "text-red-400" : "text-accent-blue"} />
              <span className={`font-mono text-2xl font-bold ${timeLeft <= 10 ? "text-red-400" : "text-accent-green"}`}>
                {timeLeft}s
              </span>
            </div>
          )}
        </div>

        {/* Idle State */}
        {state === "idle" && (
          <div className="py-12 text-center">
            <p className="mb-6 text-text-secondary">
              Solve as many arithmetic problems as you can in 60 seconds.
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

        {/* Playing State */}
        {state === "playing" && (
          <div>
            {/* Progress bar */}
            <div className="mb-8 h-1.5 w-full rounded-full bg-surface">
              <motion.div
                className="h-full rounded-full bg-accent-green"
                initial={{ width: "100%" }}
                animate={{ width: `${(timeLeft / 60) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* Score display */}
            <div className="mb-6 flex justify-between text-sm">
              <span className="text-text-secondary">
                Score: <span className="font-mono font-bold text-accent-green">{score}</span>
              </span>
              <span className="text-text-secondary">
                Streak: <span className="font-mono font-bold text-accent-blue">{streak}</span>
              </span>
              <span className="text-text-secondary">
                Accuracy: <span className="font-mono font-bold text-text-primary">{accuracy}%</span>
              </span>
            </div>

            {/* Feedback */}
            {lastCorrect !== null && (
              <motion.div
                key={total}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`mb-4 flex items-center justify-center gap-2 text-sm ${
                  lastCorrect ? "text-accent-green" : "text-red-400"
                }`}
              >
                {lastCorrect ? <CheckCircle size={16} /> : <XCircle size={16} />}
                {lastCorrect ? "Correct!" : "Wrong"}
              </motion.div>
            )}

            {/* Problem */}
            <div className="mb-6 text-center">
              <p className="font-mono text-4xl font-bold text-text-primary md:text-5xl">
                {problem.question}
              </p>
            </div>

            {/* Input */}
            <div className="flex gap-3">
              <input
                ref={inputRef}
                type="number"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Your answer..."
                className="flex-1 rounded-lg border border-border bg-surface px-4 py-3 font-mono text-lg text-text-primary placeholder:text-text-tertiary focus:border-accent-green focus:outline-none"
                autoComplete="off"
              />
              <button
                onClick={submitAnswer}
                className="rounded-lg bg-accent-green px-6 py-3 font-mono text-sm font-semibold text-background transition-all hover:brightness-110 cursor-pointer"
              >
                Submit
              </button>
            </div>
          </div>
        )}

        {/* Results State */}
        {state === "results" && (
          <div className="py-8 text-center">
            <p className="mb-2 font-mono text-xs uppercase tracking-wider text-text-tertiary">
              Final Score
            </p>
            <p className="mb-2 font-mono text-6xl font-bold text-accent-green">
              {score}
            </p>
            <p className="mb-6 text-text-secondary">
              {score} correct out of {total} ({accuracy}% accuracy)
            </p>

            <div className="mb-8 grid grid-cols-3 gap-4">
              <div className="rounded-lg bg-surface p-3">
                <p className="font-mono text-xl font-bold text-text-primary">{total}</p>
                <p className="text-xs text-text-tertiary">Attempted</p>
              </div>
              <div className="rounded-lg bg-surface p-3">
                <p className="font-mono text-xl font-bold text-accent-green">{score}</p>
                <p className="text-xs text-text-tertiary">Correct</p>
              </div>
              <div className="rounded-lg bg-surface p-3">
                <p className="font-mono text-xl font-bold text-text-primary">{accuracy}%</p>
                <p className="text-xs text-text-tertiary">Accuracy</p>
              </div>
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
