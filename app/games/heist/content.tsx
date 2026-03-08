"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Swords, Monitor, Shield, Users, History } from "lucide-react";
import { Card } from "@/components/ui/card";

export function HeistLanding() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent-green/10 px-4 py-1.5 font-mono text-xs uppercase tracking-wider text-accent-green">
            <Swords size={14} />
            Live Event Game
          </div>
          <h1 className="mb-4 text-5xl font-bold tracking-tight text-text-primary md:text-6xl">
            The Heist
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-text-secondary">
            A live multiplayer public-goods game. Each round, decide how much to contribute to your team&apos;s vault.
            Then audit your rivals to punish free-riders — or get punished yourself.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Link href="/games/heist/play">
              <Card className="flex h-full flex-col items-center p-8 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-green/10">
                  <Users size={32} className="text-accent-green" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-text-primary">Play</h3>
                <p className="text-sm text-text-secondary">
                  Join the game with your player code and submit your decisions.
                </p>
              </Card>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link href="/games/heist/admin">
              <Card className="flex h-full flex-col items-center p-8 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-blue/10">
                  <Shield size={32} className="text-accent-blue" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-text-primary">Admin</h3>
                <p className="text-sm text-text-secondary">
                  Operator panel to control phases, monitor submissions, and manage the session.
                </p>
              </Card>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link href="/games/heist/projector">
              <Card className="flex h-full flex-col items-center p-8 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-500/10">
                  <Monitor size={32} className="text-purple-400" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-text-primary">Projector</h3>
                <p className="text-sm text-text-secondary">
                  Full-screen leaderboard for the big screen. Dramatic, high-contrast, no clutter.
                </p>
              </Card>
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-center"
        >
          <Link href="/games/heist/history" className="inline-flex items-center gap-2 font-mono text-sm text-text-secondary hover:text-text-primary transition-colors">
            <History size={16} /> View past sessions
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16"
        >
          <div className="glass-card rounded-xl p-8">
            <h2 className="mb-4 font-mono text-sm uppercase tracking-wider text-accent-blue">How It Works</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-1 font-semibold text-text-primary">Contribution Rounds (x3)</h3>
                <p className="text-sm text-text-secondary">
                  Each round you get $10,000. Choose how much to contribute to the team vault.
                  The vault is multiplied by 1.5x and split equally. Keep more privately — or invest in the group.
                </p>
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-text-primary">Audit Phases (x2)</h3>
                <p className="text-sm text-text-secondary">
                  After Rounds 2 and 3, you can audit a teammate. If they gave under $6,000, they lose $3,000,
                  the rest of the team splits a $10,000 bonus, and the auditor earns an extra $500.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
