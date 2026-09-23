import { cookies } from "next/headers";
import { ADMIN_COOKIE } from "@/app/lib/admin-auth";

/** Clears the session cookie. Safe to call even when signed out. */
export async function POST() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  return Response.json({ ok: true });
}
