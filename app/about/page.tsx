import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/app/components/site-footer";
import SiteHeader from "@/app/components/site-header";
import { CATEGORY_META, FILE_CATEGORIES } from "@/app/lib/share";

export const metadata: Metadata = {
  title: "About",
  description:
    "What GSO is, how sharing works, what file categories exist, and where the honest gaps are.",
};

const highlights = [
  {
    title: "Files, straight to cloud",
    description:
      "Uploads go from your browser to Vercel Blob storage. The server only mints a short-lived token, so big files never pass through it.",
  },
  {
    title: "Links welcome",
    description:
      "Paste URLs alongside files — they share the same page, behind the same one link you send out.",
  },
  {
    title: "No account, by design",
    description:
      "Nothing to sign up for, nothing to manage. The link is the product; anyone holding it can open the share.",
  },
];

const gaps = [
  "100 MB per file, 50 files and 50 links per share.",
  "Shares are public — anyone with the URL can open them. Don't put anything secret in one.",
  "No accounts, no expiry and no deletion UI yet; a share lives until it's removed from storage.",
  "Links must be http(s) — anything else (javascript:, data:) is rejected.",
];

export default function AboutPage() {
  return (
    <div className="relative flex min-h-full flex-col">
      <SiteHeader size="narrow" />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="glow pointer-events-none absolute inset-0" aria-hidden />
        <div
          className="grid-overlay pointer-events-none absolute inset-0"
          aria-hidden
        />
        <div className="relative mx-auto w-full max-w-3xl px-6 pb-16 pt-16 sm:pt-20">
          <p className="fade-up text-xs uppercase tracking-[0.2em] text-muted">
            About
          </p>
          <h1
            className="fade-up mt-4 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl"
            style={{ animationDelay: "80ms" }}
          >
            One link for{" "}
            <span className="bg-gradient-to-r from-accent to-accent-2 bg-clip-text text-transparent">
              everything you send.
            </span>
          </h1>
          <p
            className="fade-up mt-6 max-w-xl text-lg leading-8 text-muted"
            style={{ animationDelay: "160ms" }}
          >
            GSO is a small, sharp sharing tool: drop files or paste URLs, get a
            single link back. No account, no dashboard, no clutter.
          </p>
        </div>
      </section>

      <main className="mx-auto w-full max-w-3xl px-6 pb-24">
        {/* What it does */}
        <section className="mt-4">
          <div className="grid gap-6 sm:grid-cols-3">
            {highlights.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-white/8 bg-white/[0.03] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_20px_60px_-30px] hover:shadow-accent/50"
              >
                <h2 className="text-base font-semibold tracking-tight">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* File categories */}
        <section id="categories" className="mt-16 scroll-mt-24">
          <div className="flex items-baseline justify-between gap-4 border-b border-white/8 pb-6">
            <h2 className="text-2xl font-semibold tracking-tight">
              File categories
            </h2>
            <span className="text-sm text-muted">Auto-detected</span>
          </div>
          <p className="mt-6 text-base leading-7 text-muted">
            Every file gets a category from its extension — no picking, no
            setup. Badges show it while you&apos;re assembling a share and on
            the share page itself, and shares with mixed types get a filter bar
            so recipients can jump straight to what they need.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {FILE_CATEGORIES.map((category) => (
              <article
                key={category}
                className="rounded-2xl border border-white/8 bg-white/[0.03] p-5"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${CATEGORY_META[category].dot}`}
                    aria-hidden="true"
                  />
                  <span className="text-sm font-semibold">
                    {CATEGORY_META[category].label}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {CATEGORY_META[category].blurb}
                </p>
                <p className="mt-3 break-words font-mono text-xs text-muted">
                  {CATEGORY_META[category].examples}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Limits & honest gaps */}
        <section className="mt-16">
          <div className="flex items-baseline justify-between gap-4 border-b border-white/8 pb-6">
            <h2 className="text-2xl font-semibold tracking-tight">
              Limits &amp; honest gaps
            </h2>
            <span className="text-sm text-muted">No fine print</span>
          </div>
          <p className="mt-6 text-base leading-7 text-muted">
            We&apos;d rather list the gaps than hide them:
          </p>
          <ul className="mt-4 space-y-3">
            {gaps.map((gap) => (
              <li
                key={gap}
                className="flex gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-5 py-4 text-sm leading-6 text-muted"
              >
                <span className="text-accent" aria-hidden="true">
                  →
                </span>
                {gap}
              </li>
            ))}
          </ul>
        </section>

        {/* Built with */}
        <section className="mt-16">
          <div className="flex items-baseline justify-between gap-4 border-b border-white/8 pb-6">
            <h2 className="text-2xl font-semibold tracking-tight">Built with</h2>
            <span className="text-sm text-muted">Small stack</span>
          </div>
          <p className="mt-6 text-base leading-7 text-muted">
            Next.js (App Router, server components where they fit), Tailwind
            CSS v4 and Vercel Blob for storage. There&apos;s no database —
            each share is a small JSON index living beside its files in the
            same store.
          </p>
        </section>

        {/* CTA */}
        <div className="mt-16 rounded-3xl border border-accent/30 bg-white/[0.03] p-8 text-center shadow-[0_30px_80px_-40px] shadow-accent/60">
          <h2 className="text-2xl font-semibold tracking-tight">
            Got something to share?
          </h2>
          <p className="mt-2 text-sm text-muted">It takes one drop.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/#upload"
              className="inline-flex h-11 items-center rounded-full bg-accent px-7 text-sm font-medium text-background shadow-[0_0_40px_-8px] shadow-accent transition-transform hover:-translate-y-0.5"
            >
              Upload something
            </Link>
            <Link
              href="/#how"
              className="inline-flex h-11 items-center rounded-full border border-white/12 px-7 text-sm transition-colors hover:border-accent/50 hover:bg-white/5"
            >
              How it works
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter size="narrow" />
    </div>
  );
}
