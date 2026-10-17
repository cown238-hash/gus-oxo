"use client";

import { motion } from "motion/react";
import Link from "next/link";

/** Shown on admin screens until ADMIN_PASSWORD exists. */
export default function AdminUnconfigured() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-24">
      <div className="rounded-3xl border border-white/8 bg-white/[0.03] p-8">
        <h1 className="text-2xl font-semibold tracking-tight">
          Admin isn&apos;t configured
        </h1>
        <p className="mt-4 text-base leading-7 text-muted">
          Add{" "}
          <code className="font-mono text-accent">ADMIN_PASSWORD</code> to{" "}
          <code className="font-mono text-accent">.env.local</code>, then
          restart the dev server. The password protects{" "}
          <code className="font-mono text-accent">/admin</code>.
        </p>
        <motion.div
          whileHover={{ y: -4, boxShadow: "0 0 40px -8px var(--accent)" }}
          whileTap={{ scale: 0.98 }}
          className="mt-8 inline-block"
        >
          <Link
            href="/"
            className="inline-flex h-11 items-center rounded-full bg-accent px-6 text-sm font-medium text-background shadow-[0_0_40px_-8px] shadow-accent"
          >
            Back to upload
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
