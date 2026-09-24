import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-24 text-center">
      <div className="glow pointer-events-none absolute inset-0" aria-hidden />
      <div className="grid-overlay pointer-events-none absolute inset-0" aria-hidden />

      <div className="fade-up relative">
        <p className="font-mono text-sm text-accent">404</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          This share doesn&apos;t exist
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-7 text-muted">
          The link may be wrong, expired, or never created. Check the URL and
          try again.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex h-11 items-center rounded-full bg-accent px-6 text-sm font-medium text-background shadow-[0_0_40px_-8px] shadow-accent transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
        >
          Share something new
        </Link>
      </div>
    </div>
  );
}
