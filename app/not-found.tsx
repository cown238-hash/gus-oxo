"use client";

import Link from "next/link";
import { motion } from "motion/react";

export default function NotFound() {
  return (
    <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-24 text-center">
      <div className="glow pointer-events-none absolute inset-0" aria-hidden />
      <div className="grid-overlay pointer-events-none absolute inset-0" aria-hidden />

      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.p
          className="font-mono text-sm text-accent"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          404
        </motion.p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          This share doesn&apos;t exist
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-7 text-muted">
          The link may be wrong, expired, or never created. Check the URL and
          try again.
        </p>
        <motion.div
          whileHover={{ y: -4, boxShadow: "0 0 50px -6px var(--accent)" }}
          whileTap={{ scale: 0.98 }}
          className="mt-8 inline-block"
        >
          <Link
            href="/"
            className="inline-flex h-11 items-center rounded-full bg-accent px-6 text-sm font-medium text-background shadow-[0_0_40px_-8px] shadow-accent"
          >
            Share something new
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
