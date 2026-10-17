"use client";

import Link from "next/link";
import { motion } from "motion/react";
import Logo from "@/app/components/logo";
import AdminDashboard from "@/app/components/admin-dashboard";

interface AdminContentProps {
  rows: Awaited<ReturnType<typeof import("@/app/lib/admin-data").listShares>>["rows"];
  hasMore: boolean;
}

export default function AdminContent({ rows, hasMore }: AdminContentProps) {
  return (
    <div className="relative min-h-full overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.12),transparent_55%)]"
      />

      <header className="relative z-10 border-b border-white/8 bg-black/40 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between px-6">
          <Link href="/" aria-label="GSO home">
            <Logo />
          </Link>
          <motion.div
            whileHover={{ x: 4 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="inline-block"
          >
            <Link
              href="/"
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              Back to site
            </Link>
          </motion.div>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-3xl px-6 py-14">
        <AdminDashboard rows={rows} hasMore={hasMore} />
      </main>
    </div>
  );
}

export function AdminError() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-24">
      <div className="rounded-3xl border border-white/8 bg-white/[0.03] p-8">
        <h1 className="text-2xl font-semibold tracking-tight">
          Couldn&apos;t read storage
        </h1>
        <p className="mt-4 text-base leading-7 text-muted">
          The share index couldn&apos;t be listed. Check that{" "}
          <code className="font-mono text-accent">BLOB_READ_WRITE_TOKEN</code>{" "}
          is set and the store exists, then{" "}
          <motion.button
            onClick={() => window.location.reload()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-accent underline underline-offset-4 transition-colors hover:text-foreground"
          >
            reload
          </motion.button>
          .
        </p>
      </div>
    </div>
  );
}