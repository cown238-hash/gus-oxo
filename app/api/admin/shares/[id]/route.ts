import { cookies } from "next/headers";
import {
  ADMIN_COOKIE,
  isConfigured,
  verifySessionToken,
} from "@/app/lib/admin-auth";
import { deleteShare } from "@/app/lib/admin-data";

/**
 * Deletes a share and its files. Re-verifies the session here (not just in
 * proxy.ts) so a routing mistake can never expose destructive actions.
 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isConfigured()) {
    return Response.json({ error: "Admin isn't configured." }, { status: 500 });
  }
  const store = await cookies();
  if (!verifySessionToken(store.get(ADMIN_COOKIE)?.value)) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;

  try {
    const deleted = await deleteShare(id);
    if (!deleted) {
      return Response.json({ error: "Share not found." }, { status: 404 });
    }
    return Response.json({ ok: true });
  } catch (error) {
    console.error("Failed to delete share", id, error);
    return Response.json(
      { error: "Could not delete the share. Check your storage credentials." },
      { status: 500 },
    );
  }
}
