import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Logo from "@/app/components/logo";
import LoginForm from "@/app/components/login-form";
import AdminUnconfigured from "@/app/components/admin-unconfigured";
import { ADMIN_COOKIE, isConfigured, verifySessionToken } from "@/app/lib/admin-auth";

export const metadata: Metadata = {
  title: "Admin sign in — GSO",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  if (!isConfigured()) return <AdminUnconfigured />;

  // Already signed in? Skip the form.
  const store = await cookies();
  if (verifySessionToken(store.get(ADMIN_COOKIE)?.value)) redirect("/admin");

  return (
    <div className="relative flex min-h-full flex-col items-center justify-center overflow-hidden px-6 py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(99,102,241,0.16),transparent_55%)]"
      />
      <div className="relative z-10 flex w-full max-w-sm flex-col items-center text-center">
        <Logo />
        <h1 className="mt-8 text-2xl font-semibold tracking-tight">
          Admin sign in
        </h1>
        <p className="mt-3 text-sm text-muted">
          Manage every share in this store: list, inspect and delete.
        </p>
        <LoginForm />
      </div>
    </div>
  );
}
