"use client";

/** Read-only share URL field. Lives in a client component because selecting
 *  the text on focus needs an event handler. */
export default function ShareUrlField({ value }: { value: string }) {
  return (
    <input
      readOnly
      value={value}
      onFocus={(event) => event.currentTarget.select()}
      className="h-10 flex-1 rounded-full border border-white/12 bg-black/40 px-5 font-mono text-sm outline-none focus:border-accent/50"
      aria-label="Share URL"
    />
  );
}
