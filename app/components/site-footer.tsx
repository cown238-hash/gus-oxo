import Link from "next/link";
import Logo from "./logo";
import { CATEGORY_META, FILE_CATEGORIES } from "@/app/lib/share";

/** Portal-style footer: brand blurb + explore/site/info columns, then a
 *  bottom bar. `size` matches the content container of the page. */
export default function SiteFooter({
  size = "wide",
}: {
  size?: "wide" | "narrow";
}) {
  const container = size === "wide" ? "max-w-5xl" : "max-w-3xl";
  const columnTitle =
    "text-xs font-semibold uppercase tracking-[0.18em] text-muted";
  const link =
    "text-sm text-muted transition-colors hover:text-foreground";

  return (
    <footer className="mt-auto border-t border-white/5 bg-black/20">
      <div
        className={`mx-auto grid w-full ${container} gap-10 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4`}
      >
        {/* Brand */}
        <div className="sm:col-span-2 lg:col-span-1">
          <Link href="/" aria-label="GSO home">
            <Logo />
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-6 text-muted">
            Drop files or paste a link, get one shareable URL in seconds.
            Files stay online until an admin deletes them — links never
            expire.
          </p>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
            Files never expire
          </p>
        </div>

        {/* Explore */}
        <div>
          <h2 className={columnTitle}>Explore</h2>
          <ul className="mt-4 space-y-2.5">
            <li>
              <Link href="/browse" className={link}>
                All files
              </Link>
            </li>
            {FILE_CATEGORIES.map((category) => (
              <li key={category}>
                <Link
                  href={`/browse?cat=${category}`}
                  className={`inline-flex items-center gap-2 ${link}`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${CATEGORY_META[category].dot}`}
                    aria-hidden
                  />
                  {CATEGORY_META[category].label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Site */}
        <div>
          <h2 className={columnTitle}>Site</h2>
          <ul className="mt-4 space-y-2.5">
            <li>
              <Link href="/" className={link}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/#upload" className={link}>
                Upload a file
              </Link>
            </li>
            <li>
              <Link href="/#how" className={link}>
                How it works
              </Link>
            </li>
            <li>
              <Link href="/about" className={link}>
                About
              </Link>
            </li>
            <li>
              <Link href="/admin" className={link}>
                Admin
              </Link>
            </li>
          </ul>
        </div>

        {/* Good to know */}
        <div>
          <h2 className={columnTitle}>Good to know</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-muted">
            <li>Up to 100 MB per file</li>
            <li>No account required</li>
            <li>Categories detected automatically</li>
            <li>Anyone with a link can download</li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div
          className={`mx-auto flex w-full ${container} flex-col items-center justify-between gap-3 px-6 py-6 text-sm text-muted sm:flex-row`}
        >
          <p>
            © {new Date().getFullYear()} GSO. Shared links are public to
            anyone who has them.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/about" className={link}>
              About
            </Link>
            <Link href="/#upload" className={link}>
              Upload something ↑
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
