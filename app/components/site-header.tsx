import Link from "next/link";
import Logo from "./logo";
import {
  CATEGORY_META,
  FILE_CATEGORIES,
  type FileCategory,
} from "@/app/lib/share";

type NavKey = "home" | "explore" | null;

function navPill(active: boolean) {
  return `shrink-0 rounded-full px-3 py-1.5 text-sm transition-all active:scale-[0.97] ${
    active
      ? "bg-white/8 text-foreground"
      : "text-muted hover:bg-white/5 hover:text-foreground"
  }`;
}

function catPill(active: boolean) {
  return `inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all active:scale-[0.97] ${
    active
      ? "bg-accent text-background shadow-[0_0_24px_-6px] shadow-accent"
      : "text-muted hover:bg-white/5 hover:text-foreground"
  }`;
}

/** Portal-style sticky header: brand + search + nav, with the category rail
 *  underneath (i-loadzone style). `size` matches the content container of
 *  the page; `activeNav`/`activeCat` highlight the current page. */
export default function SiteHeader({
  size = "wide",
  activeNav = null,
  activeCat = "all",
}: {
  size?: "wide" | "narrow";
  activeNav?: NavKey;
  activeCat?: FileCategory | "all";
}) {
  const container = size === "wide" ? "max-w-5xl" : "max-w-3xl";
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-md">
      {/* Top row: logo · search · nav */}
      <div
        className={`mx-auto flex h-16 w-full ${container} items-center gap-3 px-6`}
      >
        <Link href="/" className="inline-flex shrink-0" aria-label="GSO home">
          <Logo />
        </Link>

        <form
          action="/browse"
          method="get"
          role="search"
          className="relative ml-auto hidden w-full max-w-[16rem] sm:block lg:max-w-xs"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            aria-hidden
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            type="search"
            name="q"
            placeholder="Search files…"
            aria-label="Search files"
            className="h-9 w-full rounded-full border border-white/12 bg-black/40 pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-muted focus:border-accent/50"
          />
        </form>

        <nav className="flex shrink-0 items-center gap-1 sm:gap-1.5">
          <Link href="/" className={navPill(activeNav === "home")}>
            Home
          </Link>
          <Link href="/browse" className={navPill(activeNav === "explore")}>
            Explore
          </Link>
          <Link href="/about" className={`${navPill(false)} hidden sm:block`}>
            About
          </Link>
          <Link
            href="/#upload"
            className="ml-1 shrink-0 rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-background shadow-[0_0_32px_-8px] shadow-accent transition-transform hover:-translate-y-0.5 active:scale-[0.97]"
          >
            Upload
          </Link>
        </nav>
      </div>

      {/* Second row: category rail */}
      <div className="border-t border-white/5">
        <nav
          aria-label="File categories"
          className={`mx-auto flex w-full ${container} items-center gap-1.5 overflow-x-auto px-6 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}
        >
          <Link
            href="/browse"
            className={catPill(activeCat === "all")}
            aria-current={activeCat === "all" ? "page" : undefined}
          >
            All files
          </Link>
          {FILE_CATEGORIES.map((category) => (
            <Link
              key={category}
              href={`/browse?cat=${category}`}
              className={catPill(activeCat === category)}
              aria-current={activeCat === category ? "page" : undefined}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${CATEGORY_META[category].dot}`}
                aria-hidden
              />
              {CATEGORY_META[category].label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
