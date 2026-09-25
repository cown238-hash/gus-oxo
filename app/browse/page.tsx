import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/app/components/reveal";
import ShareCard from "@/app/components/share-card";
import SiteFooter from "@/app/components/site-footer";
import SiteHeader from "@/app/components/site-header";
import { listPublicShares } from "@/app/lib/browse";
import {
  CATEGORY_META,
  FILE_CATEGORIES,
  type FileCategory,
} from "@/app/lib/share";

export const metadata: Metadata = {
  title: "Explore files — GSO",
  description:
    "Browse the latest files and links shared publicly on GSO — search by name and filter by category.",
};

const chipClass = (active: boolean) =>
  `inline-flex h-8 items-center gap-2 rounded-full border px-3.5 text-xs font-medium transition-colors ${
    active
      ? "border-accent/60 bg-accent/15 text-foreground"
      : "border-white/12 text-muted hover:border-white/25 hover:text-foreground"
  }`;

function parseCat(raw: string | string[] | undefined): FileCategory | "all" {
  const value = Array.isArray(raw) ? raw[0] : raw;
  return FILE_CATEGORIES.includes(value as FileCategory)
    ? (value as FileCategory)
    : "all";
}

export default async function BrowsePage(props: PageProps<"/browse">) {
  const sp = await props.searchParams;
  const rawQ = typeof sp.q === "string" ? sp.q.slice(0, 80) : "";
  const q = rawQ.trim();
  const cat = parseCat(sp.cat);
  const rawPage = Number.parseInt(
    typeof sp.page === "string" ? sp.page : "",
    10,
  );

  const result = await listPublicShares({
    q,
    cat,
    page: Number.isFinite(rawPage) ? rawPage : 1,
  });

  /** Keeps the current search/category unless a caller overrides them. */
  const href = (next: { q?: string; cat?: FileCategory | "all"; page?: number }) => {
    const params = new URLSearchParams();
    const nextQ = (next.q ?? q).trim();
    const nextCat = next.cat ?? cat;
    const nextPage = next.page ?? 1;
    if (nextQ) params.set("q", nextQ);
    if (nextCat !== "all") params.set("cat", nextCat);
    if (nextPage > 1) params.set("page", String(nextPage));
    const search = params.toString();
    return search ? `/browse?${search}` : "/browse";
  };

  const filtered = q.length > 0 || cat !== "all";

  return (
    <div className="relative flex min-h-full flex-col">
      <SiteHeader activeNav="explore" activeCat={cat} />

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
        {/* Title + search */}
        <Reveal>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted">
                Explore
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                {cat === "all" ? "Browse shared files" : CATEGORY_META[cat].label}
              </h1>
            </div>
            <p className="hidden shrink-0 pb-1 text-sm text-muted sm:block">
              {result.total} share{result.total === 1 ? "" : "s"}
            </p>
          </div>

          <form
            action="/browse"
            method="get"
            role="search"
            className="mt-6 flex max-w-xl gap-2"
          >
            <input
              type="search"
              name="q"
              defaultValue={rawQ}
              placeholder="Search titles and filenames…"
              aria-label="Search titles and filenames"
              className="h-11 flex-1 rounded-full border border-white/12 bg-black/40 px-5 text-sm outline-none transition-colors placeholder:text-muted focus:border-accent/50"
            />
            {cat !== "all" && <input type="hidden" name="cat" value={cat} />}
            <button
              type="submit"
              className="h-11 shrink-0 rounded-full bg-accent px-6 text-sm font-medium text-background shadow-[0_0_36px_-10px] shadow-accent transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
            >
              Search
            </button>
          </form>
        </Reveal>

        {/* Category chips with counts */}
        <Reveal delay={80}>
          <div
            className="mt-7 flex flex-wrap gap-2"
            role="group"
            aria-label="Filter by category"
          >
            <Link
              href={href({ cat: "all" })}
              aria-current={cat === "all" ? "page" : undefined}
              className={chipClass(cat === "all")}
            >
              All <span className="opacity-60">{result.total}</span>
            </Link>
            {FILE_CATEGORIES.map((category) => (
              <Link
                key={category}
                href={href({ cat: category })}
                aria-current={cat === category ? "page" : undefined}
                className={chipClass(cat === category)}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${CATEGORY_META[category].dot}`}
                  aria-hidden
                />
                {CATEGORY_META[category].label}
                <span className="opacity-60">{result.counts[category]}</span>
              </Link>
            ))}
          </div>
        </Reveal>

        {/* Grid */}
        {result.items.length > 0 ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {result.items.map((card, index) => (
              <Reveal key={card.id} delay={(index % 4) * 70}>
                <ShareCard card={card} />
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal delay={120}>
            <div className="mt-8 rounded-2xl border border-dashed border-white/12 bg-white/[0.02] px-6 py-14 text-center">
              <p className="text-base font-medium">
                {filtered ? "No shares match your search" : "Nothing published yet"}
              </p>
              <p className="mt-2 text-sm text-muted">
                {filtered
                  ? "Try a different keyword or category."
                  : "Upload the first file and it will show up right here."}
              </p>
              {filtered ? (
                <Link
                  href="/browse"
                  className="mt-6 inline-flex h-10 items-center rounded-full border border-white/12 px-5 text-sm transition-all hover:border-accent/50 hover:bg-white/5"
                >
                  Clear search
                </Link>
              ) : (
                <Link
                  href="/#upload"
                  className="mt-6 inline-flex h-10 items-center rounded-full bg-accent px-6 text-sm font-medium text-background transition-transform hover:-translate-y-0.5"
                >
                  Upload a file
                </Link>
              )}
            </div>
          </Reveal>
        )}

        {/* Pagination */}
        {result.pageCount > 1 && (
          <nav
            className="mt-10 flex items-center justify-center gap-4 text-sm"
            aria-label="Pagination"
          >
            {result.page > 1 ? (
              <Link
                href={href({ page: result.page - 1 })}
                className="rounded-full border border-white/12 px-4 py-1.5 transition-all hover:border-accent/50 hover:bg-white/5"
              >
                ← Previous
              </Link>
            ) : (
              <span className="rounded-full border border-white/8 px-4 py-1.5 opacity-40">
                ← Previous
              </span>
            )}
            <span className="text-muted">
              Page {result.page} of {result.pageCount}
            </span>
            {result.page < result.pageCount ? (
              <Link
                href={href({ page: result.page + 1 })}
                className="rounded-full border border-white/12 px-4 py-1.5 transition-all hover:border-accent/50 hover:bg-white/5"
              >
                Next →
              </Link>
            ) : (
              <span className="rounded-full border border-white/8 px-4 py-1.5 opacity-40">
                Next →
              </span>
            )}
          </nav>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
