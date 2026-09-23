import { cookies } from "next/headers";
import {
  ADMIN_COOKIE,
  SESSION_TTL_MS,
  checkPassword,
  createSessionToken,
  isConfigured,
} from "@/app/lib/admin-auth";

/** Signs in: verifies the password and sets the session cookie. */
export async function POST(request: Request) {
  if (!isConfigured()) {
    return Response.json(
      {
        error:
          "Admin isn't configured. Add ADMIN_PASSWORD to .env.local and restart the dev server.",
      },
      { status: 500 },
    );
  }

  const body = (await request.json().catch(() => null)) as {
    password?: unknown;
  } | null;
  const password = typeof body?.password === "string" ? body.password : "";

  if (!checkPassword(password)) {
    // Small delay so failed attempts can't be timed at network speed.
    await new Promise((resolve) => setTimeout(resolve, 300));
    return Response.json({ error: "Wrong password." }, { status: 401 });
  }

  const store = await cookies();
  store.set(ADMIN_COOKIE, createSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  });

  return Response.json({ ok: true });
}
