import { del, get, list } from "@vercel/blob";
import { SHARE_ID_PATTERN, isShare, type Share } from "@/app/lib/share";

export type AdminShareRow = {
  id: string;
  createdAt: string | null;
  fileCount: number | null;
  linkCount: number | null;
  totalBytes: number;
  /** False when shares/{id}.json exists but failed validation — the row is
   *  still listed (and deletable) so corrupted indexes don't become orphans. */
  valid: boolean;
};

type ShareListing = {
  rows: AdminShareRow[];
  hasMore: boolean;
};

/** Reads one share index by storage pathname. Returns null if missing or
 *  malformed. */
async function loadShare(pathname: string): Promise<Share | null> {
  const result = await get(pathname, { access: "public" });
  if (!result) return null;
  const text = await new Response(result.stream).text();
  try {
    const parsed: unknown = JSON.parse(text);
    return isShare(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Lists every share in the store, newest first. Each share's JSON is read to
 * get file/link counts and total size, so this is one request per share —
 * fine at this scale (capped at the newest 1000 indexes).
 */
export async function listShares(): Promise<ShareListing> {
  const listed = await list({ prefix: "shares/", limit: 1000 });

  const rows = await Promise.all(
    listed.blobs
      .filter((blob) => blob.pathname.endsWith(".json"))
      .map(async (blob): Promise<AdminShareRow | null> => {
        const id = blob.pathname.slice(
          "shares/".length,
          -".json".length,
        );
        if (!SHARE_ID_PATTERN.test(id)) return null;

        const share = await loadShare(blob.pathname);
        if (!share) {
          // Unreadable index: still surface it so it can be cleaned up.
          return {
            id,
            createdAt: blob.uploadedAt.toISOString(),
            fileCount: null,
            linkCount: null,
            totalBytes: blob.size,
            valid: false,
          };
        }
        return {
          id: share.id,
          createdAt: share.createdAt,
          fileCount: share.files.length,
          linkCount: share.links.length,
          totalBytes: share.files.reduce((sum, file) => sum + file.size, 0),
          valid: true,
        };
      }),
  );

  return {
    rows: rows
      .filter((row): row is AdminShareRow => row !== null)
      .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? "")),
    hasMore: listed.hasMore,
  };
}

/**
 * Deletes a share: the JSON index plus every file it references. Returns
 * false when the share doesn't exist (or its index is unreadable — in that
 * case the JSON is still removed, but unreachable files can't be found).
 */
export async function deleteShare(id: string): Promise<boolean> {
  if (!SHARE_ID_PATTERN.test(id)) return false;
  const pathname = `shares/${id}.json`;

  const share = await loadShare(pathname);
  const targets = [pathname];
  if (share) {
    // url and downloadUrl point at the same blob; derive the pathname once.
    for (const file of share.files) {
      targets.push(new URL(file.url).pathname.slice(1));
    }
  } else {
    // Missing or corrupted index: confirm the blob actually exists so we
    // don't report success for a share that was never there.
    const listed = await list({ prefix: pathname, limit: 1 });
    if (listed.blobs.length === 0) return false;
  }

  await del([...new Set(targets)]);
  return true;
}
