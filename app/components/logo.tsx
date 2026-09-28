/** GSO brand mark: dark squircle with chrome GSO text, plus wordmark. */
export default function Logo({
  withWordmark = true,
}: {
  withWordmark?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <svg viewBox="0 0 512 512" className="h-6 w-6" aria-hidden="true">
        <defs>
          <linearGradient id="logo-bg" x1="0" y1="0" x2="0" y2="512" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1a1a2e" />
            <stop offset="1" stopColor="#0a0a12" />
          </linearGradient>
          <linearGradient id="logo-chrome" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
            <stop stopColor="#e8e8e8" />
            <stop offset="0.3" stopColor="#a0a0a0" />
            <stop offset="0.5" stopColor="#f5f5f5" />
            <stop offset="0.7" stopColor="#808080" />
            <stop offset="1" stopColor="#c0c0c0" />
          </linearGradient>
        </defs>
        <rect width="512" height="512" rx="112" fill="url(#logo-bg)" />
        <text x="256" y="280" textAnchor="middle" fontFamily="'Arial Black', Arial, Helvetica, sans-serif" fontSize="170" fontWeight="900" letterSpacing="8" fill="url(#logo-chrome)">GSO</text>
        <rect x="146" y="320" width="220" height="8" rx="4" fill="url(#logo-chrome)" />
      </svg>
      {withWordmark && (
        <span className="text-sm font-semibold tracking-tight">
          gso<span className="text-accent">.</span>
        </span>
      )}
    </span>
  );
}
