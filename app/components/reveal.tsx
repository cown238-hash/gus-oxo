"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Fades/slides its content in when it scrolls into view. Server pages pass
 * their markup in as children — the effect only runs after hydration, and
 * the no-JS / reduced-motion cases stay fully visible (see globals.css).
 */
export default function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -48px 0px" }}
      transition={{
        duration: 0.7,
        delay: delay / 1000,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
