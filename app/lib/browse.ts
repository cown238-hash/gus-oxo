import { get, list } from "@vercel/blob";
import {
  FILE_CATEGORIES,
  SHARE_ID_PATTERN,
  fileCategory,
  isShare,
  type FileCategory,
  type Share,
} from "@/app/lib/share";

/** One card on the Explore grid (plain JSON — safe to pass into client
 *  components). */
export type BrowseCard = {
  id: string;
  title: string;
  createdAt: string;
  /** Pre-formatted on the server (UTC) so client/server renders agree. */
  dateLabel: string;
  /** First image file, used as the cover; null → category icon tile. */
  coverUrl: string | null;
  coverCategory: FileCategory;
  fileCount: number;
  linkCount: number;
  totalBytes: number;
  cats: FileCategory[];
};

export type BrowseResult = {
  items: BrowseCard[];
  total: number;
  page: number;
  pageCount: number;
  /** Share counts per category for the current search (ignores `cat`). */
  counts: Record<FileCategory, number>;
};

export const BROWSE_PAGE_SIZE = 24;

/** Upper bound on indexes read per request — plenty for this scale, and it
 *  keeps every Explore render to one bounded batch of reads. */
const MAX_INDEXES = 300;

function zeroCounts(): Record<FileCategory, number> {
  const counts = {} as Record<FileCategory, number>;
  for (const category of FILE_CATEGORIES) counts[category] = 0;
  return counts;
}

function loadShare(pathname: string): Promise<Share | null> {
  return get(pathname, { access: "public" })
    .then(async (result) => {
      if (!result) return null;
      const text = await new Response(result.stream).text();
      try {
        const parsed: unknown = JSON.parse(text);
        return isShare(parsed) ? parsed : null;
      } catch {
        return null;
      }
    })
    .catch(() => null);
}

/** The categories a share shows under — every distinct file category, or
 *  just "other" for link-only shares. */
function categoriesOf(share: Share): FileCategory[] {
  if (share.files.length === 0) return ["other"];
  const seen = new Set<FileCategory>();
  for (const file of share.files) seen.add(fileCategory(file.name));
  return FILE_CATEGORIES.filter((category) => seen.has(category));
}

function hostOf(link: string): string | null {
  try {
    return new URL(link).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

function titleOf(share: Share): string {
  const explicit = share.title?.trim();
  if (explicit) return explicit;
  const firstFile = share.files[0]?.name;
  if (firstFile) return firstFile.slice(0, 120);
  const host = share.links[0] ? hostOf(share.links[0]) : null;
  if (host) return host;
  return "Shared items";
}

function matchesQuery(share: Share, query: string): boolean {
  if (!query) return true;
  const haystack = [
    share.title ?? "",
    ...share.files.map((file) => file.name),
    ...share.links,
  ]
    .join("\n")
    .toLowerCase();
  return haystack.includes(query);
}

function toCard(share: Share): BrowseCard {
  const cats = categoriesOf(share);
  const cover = share.files.find((file) => fileCategory(file.name) === "image");
  const created = new Date(share.createdAt);
  const dateLabel = Number.isNaN(created.getTime())
    ? ""
    : created.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      });

  return {
    id: share.id,
    title: titleOf(share),
    createdAt: share.createdAt,
    dateLabel,
    coverUrl: cover?.url ?? null,
    coverCategory: cats[0] ?? "other",
    fileCount: share.files.length,
    linkCount: share.links.length,
    totalBytes: share.files.reduce((sum, file) => sum + file.size, 0),
    cats,
  };
}

/**
 * The public Explore listing: every listed share, newest first, with
 * search (`q`), category filter (`cat`) and pagination applied. Reads the
 * same shares/{id}.json indexes the admin panel uses — one read per share,
 * bounded at MAX_INDEXES, which is fine at this scale.
 */
export async function listPublicShares(
  options: {
    q?: string;
    cat?: FileCategory | "all";
    page?: number;
    pageSize?: number;
  } = {},
): Promise<BrowseResult> {
  const empty: BrowseResult = {
    items: [],
    total: 0,
    page: 1,
    pageCount: 0,
    counts: zeroCounts(),
  };
  if (!process.env.BLOB_READ_WRITE_TOKEN) return empty;

  const listed = await list({ prefix: "shares/", limit: MAX_INDEXES });
  const shares = (
    await Promise.all(
      listed.blobs
        .filter(
          (blob) =>
            blob.pathname.endsWith(".json") &&
            SHARE_ID_PATTERN.test(
              blob.pathname.slice("shares/".length, -".json".length),
            ),
        )
        .map((blob) => loadShare(blob.pathname)),
    )
  )
    .filter((share): share is Share => share !== null)
    .filter((share) => share.listed !== false)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const query = options.q?.trim().toLowerCase() ?? "";
  const searched = shares.filter((share) => matchesQuery(share, query));

  const counts = zeroCounts();
  for (const share of searched) {
    for (const category of categoriesOf(share)) counts[category] += 1;
  }

  const cat = options.cat && options.cat !== "all" ? options.cat : null;
  const filtered = cat
    ? searched.filter((share) => categoriesOf(share).includes(cat))
    : searched;

  const pageSize = options.pageSize ?? BROWSE_PAGE_SIZE;
  const total = filtered.length;
  const pageCount = Math.ceil(total / pageSize);
  const requested = options.page ?? 1;
  const page = Math.min(Math.max(Number.isFinite(requested) ? requested : 1, 1), Math.max(pageCount, 1));
  const start = (page - 1) * pageSize;

  return {
    items: filtered.slice(start, start + pageSize).map(toCard),
    total,
    page,
    pageCount,
    counts,
  };
}
