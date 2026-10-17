import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminUnconfigured from "@/app/components/admin-unconfigured";
import { ADMIN_COOKIE, isConfigured, verifySessionToken } from "@/app/lib/admin-auth";
import { listShares } from "@/app/lib/admin-data";
import AdminContent, { AdminError } from "./admin-content";

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
    return <AdminError />;
  }

  return <AdminContent rows={data.rows} hasMore={data.hasMore} />;
}