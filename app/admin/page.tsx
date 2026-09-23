import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Logo from "@/app/components/logo";
import AdminDashboard from "@/app/components/admin-dashboard";
import AdminUnconfigured from "@/app/components/admin-unconfigured";
import { ADMIN_COOKIE, isConfigured, verifySessionToken } from "@/app/lib/admin-auth";
import { listShares } from "@/app/lib/admin-data";

export const metadata: Metadata = {
  title: "Admin — GSO",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  if (!isConfigured()) return <AdminUnconfigured />;

  // proxy.ts already gates this route; re-check here so a routing change
  // can never leak the share index without a valid session.
  const store = await cookies();
  if (!verifySessionToken(store.get(ADMIN_COOKIE)?.value)) {
    redirect("/admin/login");
  }

  let data: Awaited<ReturnType<typeof listShares>>;
  try {
    data = await listShares();
  } catch (error) {
    console.error("Failed to list shares", error);
    return (
      <div className="mx-auto w-full max-w-3xl px-6 py-24">
        <div className="rounded-3xl border border-white/8 bg-white/[0.03] p-8">
          <h1 className="text-2xl font-semibold tracking-tight">
            Couldn&apos;t read storage
          </h1>
          <p className="mt-4 text-base leading-7 text-muted">
            The share index couldn&apos;t be listed. Check that{" "}
            <code className="font-mono text-accent">BLOB_READ_WRITE_TOKEN</code>{" "}
            is set and the store exists, then reload.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-full overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.12),transparent_55%)]"
      />

      <header className="relative z-10 border-b border-white/8 bg-black/40 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between px-6">
          <Link href="/" aria-label="GSO home">
            <Logo />
          </Link>
          <Link
            href="/"
            className="text-sm text-muted transition-colors hover:text-foreground"
          >
            Back to site
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-3xl px-6 py-14">
        <AdminDashboard rows={data.rows} hasMore={data.hasMore} />
      </main>
    </div>
  );
}
