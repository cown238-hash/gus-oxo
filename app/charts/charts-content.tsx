"use client";

import { motion } from "motion/react";
import Reveal from "@/app/components/reveal";

type ChartEntry = {
  rank: number;
  title: string;
  artist: string;
  album: string;
  duration: string;
  trend: "up" | "down" | "same" | "new";
};

const chartData: ChartEntry[] = [
  { rank: 1, title: "Blinding Lights", artist: "The Weeknd", album: "After Hours", duration: "3:20", trend: "same" },
  { rank: 2, title: "Shape of You", artist: "Ed Sheeran", album: "÷ (Divide)", duration: "3:53", trend: "up" },
  { rank: 3, title: "Dance Monkey", artist: "Tones and I", album: "The Kids Are Coming", duration: "3:29", trend: "down" },
  { rank: 4, title: "Someone You Loved", artist: "Lewis Capaldi", album: "Divinely Uninspired", duration: "3:02", trend: "up" },
  { rank: 5, title: "Sunflower", artist: "Post Malone & Swae Lee", album: "Spider-Man Soundtrack", duration: "2:38", trend: "down" },
  { rank: 6, title: "Bad Guy", artist: "Billie Eilish", album: "WWAFAWDWG", duration: "3:14", trend: "same" },
  { rank: 7, title: "Senorita", artist: "Shawn Mendes & Camila Cabello", album: "Senorita", duration: "3:10", trend: "up" },
  { rank: 8, title: "Old Town Road", artist: "Lil Nas X ft. Billy Ray Cyrus", album: "Old Town Road", duration: "2:37", trend: "down" },
  { rank: 9, title: "Watermelon Sugar", artist: "Harry Styles", album: "Fine Line", duration: "2:54", trend: "new" },
  { rank: 10, title: "Levitating", artist: "Dua Lipa", album: "Future Nostalgia", duration: "3:23", trend: "up" },
];

function TrendIcon({ trend }: { trend: ChartEntry["trend"] }) {
  if (trend === "up")
    return (
      <span className="inline-flex items-center gap-0.5 text-xs text-green-400" title="Moving up">
        <svg viewBox="0 0 12 12" className="h-3 w-3" fill="currentColor" aria-hidden>
          <path d="M6 2l4 5H2z" />
        </svg>
      </span>
    );
  if (trend === "down")
    return (
      <span className="inline-flex items-center gap-0.5 text-xs text-red-400" title="Moving down">
        <svg viewBox="0 0 12 12" className="h-3 w-3" fill="currentColor" aria-hidden>
          <path d="M6 10L2 5h8z" />
        </svg>
      </span>
    );
  if (trend === "new")
    return (
      <span className="inline-flex items-center rounded-full bg-accent/15 px-1.5 py-0.5 text-[10px] font-medium text-accent" title="New entry">
        NEW
      </span>
    );
  return (
    <span className="inline-flex items-center text-xs text-muted" title="No change">
      —
    </span>
  );
}

export default function ChartsContent() {
  return (
    <div className="relative flex min-h-full flex-col">
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.2em] text-muted">
            Music
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Top Charts
          </h1>
          <p className="mt-4 text-sm text-muted">
            Last updated: September 30, 2026
          </p>
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-8 overflow-hidden rounded-3xl border border-white/8 bg-white/[0.03]">
            {/* Header */}
            <div className="flex items-center gap-4 border-b border-white/8 bg-white/[0.02] px-5 py-3 text-xs font-medium uppercase tracking-[0.14em] text-muted sm:px-6">
              <span className="w-8">#</span>
              <span className="flex-1">Title</span>
              <span className="hidden sm:block w-28">Album</span>
              <span className="hidden md:block w-16 text-right">Time</span>
              <span className="w-10 text-center">Trend</span>
            </div>

            {/* Rows */}
            <div className="divide-y divide-white/6">
              {chartData.map((entry, index) => (
                <motion.div
                  key={entry.rank}
                  className="group flex items-center gap-4 px-5 py-4 hover:bg-white/[0.03] sm:px-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.05,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{ x: 4 }}
                >
                  <span className={`w-8 shrink-0 text-center font-mono text-sm ${entry.rank <= 3 ? "text-accent font-semibold" : "text-muted"}`}>
                    {entry.rank}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium transition-colors group-hover:text-accent">
                      {entry.title}
                    </p>
                    <p className="truncate text-xs text-muted">
                      {entry.artist}
                    </p>
                  </div>
                  <span className="hidden sm:block w-28 truncate text-xs text-muted">
                    {entry.album}
                  </span>
                  <span className="hidden md:block w-16 text-right font-mono text-xs text-muted">
                    {entry.duration}
                  </span>
                  <span className="w-10 flex justify-center">
                    <TrendIcon trend={entry.trend} />
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={200}>
          <p className="mt-6 text-xs text-muted">
            Charts are for demonstration purposes only. Data is static and does not reflect real-time rankings.
          </p>
        </Reveal>
      </main>
    </div>
  );
}