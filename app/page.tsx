import SiteFooter from "./components/site-footer";
import SiteHeader from "./components/site-header";
import Uploader from "./components/uploader";
import { CATEGORY_META, FILE_CATEGORIES } from "./lib/share";

const steps = [
  {
    index: "01",
    title: "Drop or paste",
    description:
      "Drag files into the box, or paste a URL. Mix both — they live behind the same share link.",
  },
  {
    index: "02",
    title: "Get a link",
    description:
      "Everything is uploaded and indexed in seconds. You get one short URL that holds it all.",
  },
  {
    index: "03",
    title: "Share anywhere",
    description:
      "Send it in a chat, an email or a tweet. Anyone with the link can open and download.",
  },
];

export default function Home() {
  return (
    <div className="relative flex min-h-full flex-col">
      {/* Header */}
      <SiteHeader />

      {/* Hero + uploader */}
      <section id="top" className="relative overflow-hidden">
        <div className="glow pointer-events-none absolute inset-0" aria-hidden />
        <div className="grid-overlay pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative mx-auto w-full max-w-5xl px-6 pb-24 pt-20 sm:pt-28">
          <div className="fade-up flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-muted">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            No account required
          </div>

          <h1
            className="fade-up mt-8 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl"
            style={{ animationDelay: "80ms" }}
          >
            Drop a file.{" "}
            <span className="bg-gradient-to-r from-accent to-accent-2 bg-clip-text text-transparent">
              Share a link.
            </span>
          </h1>

          <p
            className="fade-up mt-6 max-w-xl text-lg leading-8 text-muted"
            style={{ animationDelay: "160ms" }}
          >
            Upload files or paste a URL and get one shareable link in seconds —
            no sign-up, no clutter.
          </p>

          <div
            id="upload"
            className="fade-up mt-12 scroll-mt-24"
            style={{ animationDelay: "240ms" }}
          >
            <Uploader />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto w-full max-w-5xl scroll-mt-24 px-6 py-24">
        <div className="flex items-baseline justify-between gap-4 border-b border-white/8 pb-6">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            How it works
          </h2>
          <span className="text-sm text-muted">Three steps</span>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {steps.map((step) => (
            <article
              key={step.index}
              className="group rounded-2xl border border-white/8 bg-white/[0.03] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_20px_60px_-30px] hover:shadow-accent/50"
            >
              <span className="font-mono text-xs text-accent/70">
                {step.index}
              </span>
              <h3 className="mt-4 text-lg font-semibold tracking-tight">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* File categories */}
      <section
        id="categories"
        className="mx-auto w-full max-w-5xl scroll-mt-24 px-6 py-24"
      >
        <div className="flex items-baseline justify-between gap-4 border-b border-white/8 pb-6">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            What can you share?
          </h2>
          <span className="text-sm text-muted">
            Categories are automatic
          </span>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FILE_CATEGORIES.map((category) => {
            const meta = CATEGORY_META[category];
            return (
              <article
                key={category}
                className="group rounded-2xl border border-white/8 bg-white/[0.03] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_20px_60px_-30px] hover:shadow-accent/50"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${meta.dot}`}
                    aria-hidden
                  />
                  <h3 className="text-base font-semibold tracking-tight">
                    {meta.label}
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted">
                  {meta.blurb}
                </p>
                <p className="mt-4 break-words font-mono text-xs text-muted/80">
                  {meta.examples}
                </p>
              </article>
            );
          })}
        </div>

        <p className="mt-8 text-sm text-muted">
          Every file is tagged from its extension and shown as a badge on the
          share page — shares with mixed types also get a filter bar.{" "}
          <a
            href="/about#categories"
            className="text-foreground underline underline-offset-4 transition-colors hover:text-accent"
          >
            How categories work →
          </a>
        </p>
      </section>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}
