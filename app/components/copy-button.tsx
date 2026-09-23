"use client";

import { useState } from "react";

export default function CopyButton({
  label = "Copy link",
  className,
}: {
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked by permissions; the URL stays in the address bar.
    }
  };

  return (
    <button
      onClick={copy}
      className={
        className ??
        "h-10 shrink-0 rounded-full bg-accent px-5 text-sm font-medium text-background shadow-[0_0_40px_-8px] shadow-accent transition-transform hover:-translate-y-0.5"
      }
    >
      {copied ? "Copied!" : label}
    </button>
  );
}
