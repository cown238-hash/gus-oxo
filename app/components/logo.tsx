/** GSO brand mark: gradient squircle with an upload arrow, plus wordmark. */
export default function Logo({
  withWordmark = true,
}: {
  withWordmark?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <svg viewBox="0 0 32 32" className="h-6 w-6" aria-hidden="true">
        <defs>
          <linearGradient
            id="gso-mark"
            x1="0"
            y1="0"
            x2="32"
            y2="32"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#f5a524" />
            <stop offset="1" stopColor="#ff7a45" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="9" fill="url(#gso-mark)" />
        <path
          d="M16 23.5V8.5m0 0-5.5 5.5M16 8.5l5.5 5.5"
          fill="none"
          stroke="#fff"
          strokeWidth="2.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {withWordmark && (
        <span className="text-sm font-semibold tracking-tight">
          gso<span className="text-accent">.</span>
        </span>
      )}
    </span>
  );
}
