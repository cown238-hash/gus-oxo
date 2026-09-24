import Logo from "@/app/components/logo";

/** Skeleton for the admin dashboard while the share listing loads. */
export default function AdminLoading() {
  return (
    <div className="relative min-h-full overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.12),transparent_55%)]"
      />

      <header className="relative z-10 border-b border-white/8 bg-black/40 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between px-6">
          <Logo />
          <div className="skeleton h-9 w-24 rounded-full" />
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-3xl px-6 py-14">
        <div className="skeleton h-9 w-36 rounded-xl" />
        <div className="skeleton mt-4 h-4 w-64 rounded-md" />
        <div className="mt-8 overflow-hidden rounded-3xl border border-white/8 bg-white/[0.03]">
          <div className="divide-y divide-white/6">
            {[0, 1, 2].map((row) => (
              <div
                key={row}
                className="flex items-center gap-4 px-5 py-4 sm:px-6"
              >
                <div className="skeleton h-4 w-32 rounded-md" />
                <div className="skeleton hidden h-4 w-24 rounded-md sm:block" />
                <div className="skeleton ml-auto h-9 w-24 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
