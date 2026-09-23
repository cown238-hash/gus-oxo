import Link from "next/link";

/** Shared footer. `size` matches the content container of the page. */
export default function SiteFooter({
  size = "wide",
}: {
  size?: "wide" | "narrow";
}) {
  const container = size === "wide" ? "max-w-5xl" : "max-w-3xl";
  return (
    <footer className="mt-auto border-t border-white/5">
      <div
        className={`mx-auto flex w-full ${container} flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-muted sm:flex-row`}
      >
        <p>
          © {new Date().getFullYear()} GSO. Shared links are public to anyone
          who has them.
        </p>
        <div className="flex items-center gap-5">
          <Link href="/about" className="transition-colors hover:text-foreground">
            About
          </Link>
          <Link
            href="/#upload"
            className="transition-colors hover:text-foreground"
          >
            Upload something ↑
          </Link>
        </div>
      </div>
    </footer>
  );
}
