import Link from "next/link";
import Logo from "./logo";

/** Shared sticky header. `size` matches the content container of the page. */
export default function SiteHeader({
  size = "wide",
}: {
  size?: "wide" | "narrow";
}) {
  const container = size === "wide" ? "max-w-5xl" : "max-w-3xl";
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-background/70 backdrop-blur-md">
      <nav
        className={`mx-auto flex h-16 w-full ${container} items-center justify-between px-6`}
      >
        <Link href="/" className="inline-flex items-center" aria-label="GSO home">
          <Logo />
        </Link>
        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/#how"
            className="rounded-full px-3 py-1.5 text-sm text-muted transition-colors hover:text-foreground"
          >
            How it works
          </Link>
          <Link
            href="/about"
            className="rounded-full px-3 py-1.5 text-sm text-muted transition-colors hover:text-foreground"
          >
            About
          </Link>
          <Link
            href="/#upload"
            className="ml-2 hidden rounded-full border border-white/12 px-4 py-1.5 text-sm transition-colors hover:border-accent/50 hover:bg-accent/10 sm:block"
          >
            Upload
          </Link>
        </div>
      </nav>
    </header>
  );
}
