export const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB
export const MAX_FILES = 50;
export const MAX_LINKS = 50;
export const MAX_NAME_LENGTH = 255;

/** Share ids are generated with this alphabet, and validated with it on read. */
export const SHARE_ID_PATTERN = /^[a-z0-9]{6,20}$/;

export type SharedFile = {
  name: string;
  size: number;
  url: string;
  downloadUrl: string;
};

export type Share = {
  id: string;
  createdAt: string;
  files: SharedFile[];
  links: string[];
};

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let value = bytes;
  let unit = "";
  for (const next of units) {
    value /= 1024;
    unit = next;
    if (value < 1024) break;
  }
  return `${value.toFixed(value >= 10 ? 0 : 1)} ${unit}`;
}

/** Accepts bare domains ("example.com/x") and normalizes them to https URLs. */
export function normalizeUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
  try {
    const url = new URL(withProtocol);
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

/** Reduces an arbitrary filename to something safe for a storage pathname. */
export function safeFileName(name: string): string {
  const cleaned = name
    .replace(/[^\w.\- ]+/g, "_")
    .replace(/\s+/g, "-")
    .replace(/^\.+/, "")
    .slice(0, MAX_NAME_LENGTH);
  // Falls back when the name was nothing but separators (e.g. "///").
  return /[A-Za-z0-9]/.test(cleaned) ? cleaned : "file";
}

/** True for plain http(s) URLs — used to reject `javascript:`/`data:` links. */
export function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/** Vercel Blob public URLs look like {storeId}.public.blob.vercel-storage.com */
export function isBlobUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      url.hostname.endsWith(".blob.vercel-storage.com")
    );
  } catch {
    return false;
  }
}

export function isSharedFile(value: unknown): value is SharedFile {
  if (typeof value !== "object" || value === null) return false;
  const file = value as Record<string, unknown>;
  return (
    typeof file.name === "string" &&
    file.name.length > 0 &&
    file.name.length <= MAX_NAME_LENGTH &&
    typeof file.size === "number" &&
    Number.isFinite(file.size) &&
    file.size >= 0 &&
    file.size <= MAX_FILE_SIZE &&
    typeof file.url === "string" &&
    isBlobUrl(file.url) &&
    typeof file.downloadUrl === "string" &&
    isBlobUrl(file.downloadUrl)
  );
}

export function isShare(value: unknown): value is Share {
  if (typeof value !== "object" || value === null) return false;
  const share = value as Record<string, unknown>;
  return (
    typeof share.id === "string" &&
    SHARE_ID_PATTERN.test(share.id) &&
    typeof share.createdAt === "string" &&
    Array.isArray(share.files) &&
    share.files.length <= MAX_FILES &&
    share.files.every(isSharedFile) &&
    Array.isArray(share.links) &&
    share.links.length <= MAX_LINKS &&
    share.links.every(
      (link) => typeof link === "string" && link.length <= 2048 && isHttpUrl(link),
    )
  );
}
