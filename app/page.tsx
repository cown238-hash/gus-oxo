import type { ReactNode } from "react";
import Link from "next/link";
import Reveal from "./components/reveal";
import ShareCard from "./components/share-card";
import SiteFooter from "./components/site-footer";
import SiteHeader from "./components/site-header";
import Uploader from "./components/uploader";
import { listPublicShares } from "./lib/browse";
import { CATEGORY_META, FILE_CATEGORIES, type FileCategory } from "./lib/share";

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

/** Section heading in the portal style: accent bar + title + optional hint
 *  or trailing action. Wrapped in Reveal by the caller. */
function SectionHead({
  title,
  hint,
  action,
}: {
  title: string;
  hint?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-white/8 pb-6">
      <div className="flex items-center gap-3">
        <span
          className="h-5 w-1.5 shrink-0 rounded-full bg-accent shadow-[0_0_16px_-2px] shadow-accent"
          aria-hidden
        />
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h2>
        {hint && <span className="hidden text-sm text-muted sm:inline">{hint}</span>}
      </div>
      {action}
    </div>
  );
}

/**
 * The homepage is prerendered, so without this the "Latest shares" grid
 * would stay frozen at whatever was uploaded when the site was built.
 * Revalidate at most once a minute — the /browse page itself is always
 * rendered fresh on each request.
 */
export const revalidate = 60;

export default async function Home() {
  const latest = await listPublicShares({ pageSize: 8 });

  return (
    <div className="relative flex min-h-full flex-col">
      {/* Header */}
      <SiteHeader activeNav="home" />

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
            className="fade-up mt-8 flex flex-wrap gap-3"
            style={{ animationDelay: "240ms" }}
          >
            <a
              href="#upload"
              className="inline-flex h-11 items-center rounded-full bg-accent px-6 text-sm font-medium text-background shadow-[0_0_40px_-10px] shadow-accent transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
            >
              Upload a file
            </a>
            <Link
              href="/browse"
              className="inline-flex h-11 items-center rounded-full border border-white/12 px-6 text-sm transition-all hover:border-accent/50 hover:bg-accent/10 active:scale-[0.98]"
            >
              Explore files →
            </Link>
          </div>

          <div
            id="upload"
            className="fade-up mt-12 scroll-mt-28"
            style={{ animationDelay: "320ms" }}
          >
            <Uploader />
          </div>
        </div>
      </section>

      {/* Latest public shares */}
      <section id="latest" className="mx-auto w-full max-w-5xl scroll-mt-28 px-6 py-16">
        <Reveal>
          <SectionHead
            title="Latest shares"
            hint="Fresh from the community"
            action={
              <Link
                href="/browse"
                className="text-sm text-muted transition-colors hover:text-accent"
              >
                View all →
              </Link>
            }
          />
        </Reveal>

        {latest.items.length > 0 ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {latest.items.map((card, index) => (
              <Reveal key={card.id} delay={(index % 4) * 70}>
                <ShareCard card={card} />
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal delay={80}>
            <div className="mt-8 rounded-2xl border border-dashed border-white/12 bg-white/[0.02] px-6 py-12 text-center">
              <p className="text-sm font-medium">No shares published yet</p>
              <p className="mt-2 text-sm text-muted">
                Upload the first file — it will appear right here.
              </p>
              <a
                href="#upload"
                className="mt-5 inline-flex h-10 items-center rounded-full bg-accent px-6 text-sm font-medium text-background transition-transform hover:-translate-y-0.5"
              >
                Upload a file
              </a>
            </div>
          </Reveal>
        )}
      </section>

      {/* Browse by category */}
      <section
        id="categories"
        className="mx-auto w-full max-w-5xl scroll-mt-28 px-6 py-16"
      >
        <Reveal>
          <SectionHead
            title="Browse by category"
            hint="Categories are automatic"
          />
        </Reveal>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FILE_CATEGORIES.map((category: FileCategory, index) => {
            const meta = CATEGORY_META[category];
            return (
              <Reveal key={category} delay={index * 60}>
                <Link
                  href={`/browse?cat=${category}`}
                  className="group flex h-full flex-col rounded-2xl border border-white/8 bg-white/[0.03] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_20px_60px_-30px] hover:shadow-accent/50"
                >
                  <div className="flex items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${meta.dot}`}
                        aria-hidden
                      />
                      <h3 className="text-base font-semibold tracking-tight">
                        {meta.label}
                      </h3>
                    </div>
                    <span
                      className="translate-x-1 text-accent opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                      aria-hidden
                    >
                      →
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted">
                    {meta.blurb}
                  </p>
                  <p className="mt-4 break-words font-mono text-xs text-muted/80">
                    {meta.examples}
                  </p>
                </Link>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={120}>
          <p className="mt-8 text-sm text-muted">
            Every file is tagged from its extension and shown as a badge on the
            share page — shares with mixed types also get a filter bar.{" "}
            <Link
              href="/about#categories"
              className="text-foreground underline underline-offset-4 transition-colors hover:text-accent"
            >
              How categories work →
            </Link>
          </p>
        </Reveal>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto w-full max-w-5xl scroll-mt-28 px-6 py-16">
        <Reveal>
          <SectionHead title="How it works" hint="Three steps" />
        </Reveal>

        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {steps.map((step, index) => (
            <Reveal key={step.index} delay={index * 90}>
              <article className="group h-full rounded-2xl border border-white/8 bg-white/[0.03] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_20px_60px_-30px] hover:shadow-accent/50">
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
            </Reveal>
          ))}
        </div>
      </section>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}
