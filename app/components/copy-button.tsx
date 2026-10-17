"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { useToast } from "./toast";

export default function CopyButton({
  label = "Copy link",
  className,
}: {
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const toast = useToast();

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast("Link copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked by permissions; say so instead of failing silently.
      toast("Couldn't copy — select the URL manually", "error");
    }
  };

  return (
    <motion.button
      onClick={copy}
      whileHover={{ y: -4, boxShadow: "0 0 50px -6px var(--accent)" }}
      whileTap={{ scale: 0.98 }}
      className={
        className ??
        "h-10 shrink-0 rounded-full bg-accent px-5 text-sm font-medium text-background shadow-[0_0_40px_-8px] shadow-accent"
      }
    >
      {copied ? "Copied!" : label}
    </motion.button>
  );
}
