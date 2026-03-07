"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { History, Users, Calendar } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";

interface SessionSummary {
  id: string;
  name: string;
  phase: string;
  createdAt: string;
  endedAt: string | null;
  teams: { teamCode: string; teamName: string; color?: string }[];
  _count: { players: number; submissions: number };
}

export function HistoryContent() {
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/heist/history")
      .then(r => r.json())
      .then(data => { setSessions(data.sessions ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section className="px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center gap-3">
          <History size={24} className="text-accent-blue" />
          <h1 className="text-2xl font-bold text-text-primary">Game History</h1>
        </div>

        {loading ? (
          <p className="text-text-secondary">Loading...</p>
        ) : sessions.length === 0 ? (
          <div className="glass-card rounded-xl p-8 text-center">
            <p className="text-text-secondary">No past sessions yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((s, i) => (
              <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Link href={`/games/heist/history/${s.id}`}>
                  <Card className="p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-text-primary">{s.name}</h3>
                        <div className="mt-1 flex items-center gap-4 text-sm text-text-secondary">
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {new Date(s.createdAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users size={14} />
                            {s._count.players} players
                          </span>
                          <span>{s._count.submissions} submissions</span>
                        </div>
                        <div className="mt-2 flex gap-2">
                          {s.teams.map(t => (
                            <span key={t.teamCode} className="inline-flex items-center gap-1 rounded-full bg-surface px-2 py-0.5 text-xs text-text-secondary">
                              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: t.color ?? "#888" }} />
                              {t.teamName}
                            </span>
                          ))}
                        </div>
                      </div>
                      <span className="font-mono text-xs text-text-tertiary">{s.phase}</span>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
